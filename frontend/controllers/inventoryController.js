import { NextResponse } from "next/server";
import connectDB from "../lib/db.js";
import Inventory from "../models/inventory.js";
import Product from "../models/Product.js"; // Optional: to verify product existence
import InventoryMovement from "../models/InventoryMovement.js";
import Order from "../models/Order.js";
import redis from "@/lib/redis";

const CACHE_KEYS = {
    PRODUCTS_ALL: 'products:all',
    PRODUCTS_ADMIN: 'products:admin',
    INVENTORY_ALL: 'inventory:all'
};

// Helper to log movement
async function logMovement({ inventoryId, productId, type, quantity, previousStock, newStock, reason, referenceId, performedBy }) {
    try {
        await InventoryMovement.create({
            inventoryId,
            productId,
            type,
            quantity,
            previousStock,
            newStock,
            reason,
            referenceId,
            performedBy
        });
    } catch (err) {
        console.error("Failed to log inventory movement:", err);
    }
}

async function syncWithPendingOrders() {
    try {
        // Aggregation pipeline to sum quantities of pending items per product variant
        const pendingAgg = await Order.aggregate([
            { $match: { status: "pending" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        productId: "$items.productId",
                        size: "$items.size",
                        color: "$items.color"
                    },
                    totalPending: { $sum: "$items.quantity" }
                }
            }
        ]);

        // Reset all reservedStock to 0 first (to clear zombie reservations)
        // Note: This might be heavy on large datasets, but ensures 100% accuracy.
        // Optimization: Only reset items that are NOT in the pendingAgg list? 
        // Safer: Update all.
        // Reset all reservedStock to 0 first (to clear zombie reservations)
        // AND reset availableStock to totalStock (since reserved is 0)
        await Inventory.updateMany({}, [
            { $set: { reservedStock: 0 } },
            { $set: { availableStock: "$totalStock" } }
        ]);

        // Update with actual pending counts
        // Since we need robust matching (fallback to N/A), we can't easily use bulkWrite with simple filters.
        // We will iterate through the aggregated results and find the best match for each.
        for (const p of pendingAgg) {
            const pId = p._id.productId;
            if (!pId) continue;

            // Note: The Order items might contain null/undefined for size/color.
            const itemSize = p._id.size || "N/A";
            const itemColor = p._id.color || "N/A";
            const qty = p.totalPending;

            // 🔍 MULTI-STAGE DYNAMIC MATCHING (Same as Order Creation)
            let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });

            if (!inventoryItem) {
                // Fallback 1: Size Only
                inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
            }

            if (!inventoryItem) {
                // Fallback 2: Generic
                inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });
            }

            if (inventoryItem) {
                // We add to the reserved stock because multiple variants might map to the same generic inventory item
                // NOTE: Since we reset everything to 0 above, this accumulation logic works correctly
                // even if multiple order variants point to the same inventory item.
                inventoryItem.reservedStock += qty;
                await inventoryItem.save();
                // console.log(`🔄 [AUTO-SYNC] Updated Reserved Stock for ${inventoryItem.sku}: +${qty}`);
            }
        }
        // console.log("Inventory synced with pending orders.");

    } catch (error) {
        console.error("Auto-sync failed:", error);
    }
}


export class InventoryController {

    // =====================
    // Get All / Filter Inventory
    // =====================
    static async getAll(request) {
        try {
            await connectDB();

            // AUTO-SYNC: Ensure Reserved Stock matches Pending Orders exactly
            await syncWithPendingOrders();

            const { searchParams } = new URL(request.url);
            const productId = searchParams.get("productId");
            const lowStock = searchParams.get("lowStock");
            const status = searchParams.get("status");

            // Only cache the full list for now to keep it simple
            const isFullList = !productId && !lowStock && !status;

            if (isFullList && redis) {
                try {
                    const cachedData = await redis.get(CACHE_KEYS.INVENTORY_ALL);
                    if (cachedData) {
                        console.log('[Cache] Serving inventory list from Redis');
                        return NextResponse.json(JSON.parse(cachedData), { status: 200 });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            let query = {};
            if (productId) query.productId = productId;
            if (status) query.status = status;
            if (lowStock === 'true') {
                query.$expr = { $lte: ["$totalStock", "$lowStockThreshold"] };
            }

            const items = await Inventory.find(query).populate("productId", "name brand");

            // Recalculate availableStock for display just in case pre-save didn't fire
            const result = items.map(item => {
                const doc = item.toObject();
                doc.availableStock = doc.totalStock - (doc.reservedStock || 0);
                return doc;
            });

            if (isFullList && redis) {
                try {
                    await redis.setex(CACHE_KEYS.INVENTORY_ALL, 3600, JSON.stringify(result));
                    console.log('[Cache] Saved inventory list to Redis');
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json(result, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Get Single Inventory Item
    // =====================
    static async getById(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const item = await Inventory.findById(id).populate("productId", "name brand image");

            if (!item) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            return NextResponse.json(item, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Create Inventory Item
    // =====================
    static async create(request) {
        try {
            await connectDB();
            const body = await request.json();

            // Check if product exists
            const productExists = await Product.findById(body.productId);
            if (!productExists) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }

            // Check for duplicate sku or (productId + color + size)
            const existing = await Inventory.findOne({
                $or: [
                    { sku: body.sku },
                    { productId: body.productId, color: body.color, size: body.size }
                ]
            });

            if (existing) {
                return NextResponse.json({ error: "Inventory item already exists (SKU or Variant duplicate)" }, { status: 409 });
            }

            const newItem = new Inventory(body);
            await newItem.save();

            // Invalidate products and inventory cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    console.log('[Cache] Invalidated caches due to inventory creation');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            // Log INITIAL creation
            await logMovement({
                inventoryId: newItem._id,
                productId: newItem.productId,
                type: "IN",
                quantity: newItem.totalStock,
                previousStock: 0,
                newStock: newItem.totalStock,
                reason: "Initial Stock",
                referenceId: "SETUP"
            });

            return NextResponse.json(newItem, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Update Inventory Details
    // =====================
    static async update(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const body = await request.json();

            // Get previous state for logging
            const originalItem = await Inventory.findById(id);
            if (!originalItem) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            const previousStock = originalItem.totalStock;

            // Apply updates and use .save() to trigger pre-save hooks
            Object.assign(originalItem, body);
            const updatedItem = await originalItem.save();

            // Invalidate products and inventory cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (updatedItem.productId) {
                        await redis.del(`product:${updatedItem.productId}`);
                    }
                    console.log('[Cache] Invalidated caches due to inventory update');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            // Log if stock changed manually via update
            if (updatedItem.totalStock !== previousStock) {
                const diff = updatedItem.totalStock - previousStock;
                await logMovement({
                    inventoryId: updatedItem._id,
                    productId: updatedItem.productId,
                    type: "ADJUSTMENT",
                    quantity: Math.abs(diff), // Magnitude of change
                    previousStock: previousStock,
                    newStock: updatedItem.totalStock,
                    reason: "Manual Adjustment (Update API)",
                    referenceId: "ADMIN_UPDATE"
                });
            }

            return NextResponse.json(updatedItem, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Delete Inventory Item
    // =====================
    static async delete(request, { params }) {
        try {
            await connectDB();
            const { id } = params;

            const deletedItem = await Inventory.findByIdAndDelete(id);

            if (!deletedItem) {
                return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
            }

            // Invalidate products and inventory cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (deletedItem.productId) {
                        await redis.del(`product:${deletedItem.productId}`);
                    }
                    console.log('[Cache] Invalidated caches due to inventory deletion');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ message: "Inventory item deleted" }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Check Availability
    // =====================
    static async checkStock(request) {
        try {
            await connectDB();
            const body = await request.json();
            const { productId, color, size, quantity } = body;

            const item = await Inventory.findOne({ productId, color, size });
            if (!item) {
                return NextResponse.json({ error: "Item variant not found", available: false }, { status: 404 });
            }

            const canFulfill = item.canFulfill(quantity || 1);

            return NextResponse.json({
                available: canFulfill,
                availableStock: item.availableStock,
                status: item.status
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    // =====================
    // Reserve Stock
    // =====================
    static async reserve(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousReserved = item.reservedStock;
            await item.reserve(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "RESERVED",
                quantity: quantity,
                previousStock: previousReserved, // documenting reserved change contextually
                newStock: item.reservedStock,
                reason: "Allocated to Order",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock reserved", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Release Stock
    // =====================
    static async release(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousReserved = item.reservedStock;
            await item.release(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "RELEASED",
                quantity: quantity,
                previousStock: previousReserved,
                newStock: item.reservedStock,
                reason: "Order Cancelled/Expired",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock released", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Commit Sold Stock
    // =====================
    static async commit(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, referenceId } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousTotal = item.totalStock;
            await item.commitSold(quantity);

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "SOLD",
                quantity: quantity,
                previousStock: previousTotal,
                newStock: item.totalStock,
                reason: "Order Fulfilled",
                referenceId: referenceId || "UNKNOWN_ORDER"
            });

            return NextResponse.json({ message: "Stock committed (sold)", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Restock
    // =====================
    static async restock(request, { params }) {
        try {
            await connectDB();
            const { id } = params;
            const { quantity, reason } = await request.json();

            const item = await Inventory.findById(id);
            if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

            const previousTotal = item.totalStock;
            await item.restock(quantity);

            // Invalidate products and inventory cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (item.productId) {
                        await redis.del(`product:${item.productId}`);
                    }
                    console.log('[Cache] Invalidated caches due to restock');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            await logMovement({
                inventoryId: item._id,
                productId: item.productId,
                type: "IN",
                quantity: quantity,
                previousStock: previousTotal,
                newStock: item.totalStock,
                reason: reason || "Restock Shipment",
                referenceId: "RESTOCK_" + Date.now()
            });

            return NextResponse.json({ message: "Stock replenished", item }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    // =====================
    // Get Movements (History)
    // =====================
    static async getMovements(request) {
        try {
            await connectDB();
            const { searchParams } = new URL(request.url);
            const inventoryId = searchParams.get("inventoryId");
            const productId = searchParams.get("productId");
            const type = searchParams.get("type");

            let query = {};
            if (inventoryId) query.inventoryId = inventoryId;
            if (productId) query.productId = productId;
            if (type) query.type = type;

            const movements = await InventoryMovement.find(query)
                .sort({ createdAt: -1 })
                .populate("performedBy", "name email");

            return NextResponse.json(movements, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
