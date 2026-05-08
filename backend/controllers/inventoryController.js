import connectDB from "../lib/db.js";
import Inventory from "../models/inventory.js";
import Product from "../models/Product.js";
import InventoryMovement from "../models/InventoryMovement.js";
import Order from "../models/Order.js";
import redis from "../lib/redis.js";

const CACHE_KEYS = {
    PRODUCTS_ALL: "products:all",
    PRODUCTS_ADMIN: "products:admin",
    INVENTORY_ALL: "inventory:all",
};

async function logMovement({ inventoryId, productId, type, quantity, previousStock, newStock, reason, referenceId, performedBy }) {
    try {
        await InventoryMovement.create({ inventoryId, productId, type, quantity, previousStock, newStock, reason, referenceId, performedBy });
    } catch (err) {
        console.error("Failed to log inventory movement:", err);
    }
}

async function syncWithPendingOrders() {
    try {
        const pendingAgg = await Order.aggregate([
            { $match: { status: "pending" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: { productId: "$items.productId", size: "$items.size", color: "$items.color" },
                    totalPending: { $sum: "$items.quantity" },
                },
            },
        ]);

        await Inventory.updateMany({}, [
            { $set: { reservedStock: 0 } },
            { $set: { availableStock: "$totalStock" } },
        ]);

        for (const p of pendingAgg) {
            const pId = p._id.productId;
            if (!pId) continue;
            const itemSize = p._id.size || "N/A";
            const itemColor = p._id.color || "N/A";
            const qty = p.totalPending;

            let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
            if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: "N/A" });
            if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: "N/A", color: "N/A" });

            if (inventoryItem) {
                inventoryItem.reservedStock += qty;
                await inventoryItem.save();
            }
        }
    } catch (error) {
        console.error("Auto-sync failed:", error);
    }
}

export class InventoryController {
    static async getAll(req, res) {
        try {
            await connectDB();
            await syncWithPendingOrders();

            const { productId, lowStock, status } = req.query;
            const isFullList = !productId && !lowStock && !status;

            if (isFullList && redis) {
                try {
                    const cachedData = await redis.get(CACHE_KEYS.INVENTORY_ALL);
                    if (cachedData) return res.json(JSON.parse(cachedData));
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            let query = {};
            if (productId) query.productId = productId;
            if (status) query.status = status;
            if (lowStock === "true") query.$expr = { $lte: ["$totalStock", "$lowStockThreshold"] };

            const items = await Inventory.find(query).populate("productId", "name brand");
            const result = items.map((item) => {
                const doc = item.toObject();
                doc.availableStock = doc.totalStock - (doc.reservedStock || 0);
                return doc;
            });

            if (isFullList && redis) {
                try {
                    await redis.setex(CACHE_KEYS.INVENTORY_ALL, 3600, JSON.stringify(result));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const item = await Inventory.findById(id).populate("productId", "name brand image");
            if (!item) return res.status(404).json({ error: "Inventory item not found" });
            return res.json(item);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            await connectDB();
            const body = req.body;

            const productExists = await Product.findById(body.productId);
            if (!productExists) return res.status(404).json({ error: "Product not found" });

            const existing = await Inventory.findOne({
                $or: [
                    { sku: body.sku },
                    { productId: body.productId, color: body.color, size: body.size },
                ],
            });
            if (existing) return res.status(409).json({ error: "Inventory item already exists (SKU or Variant duplicate)" });

            const newItem = new Inventory(body);
            await newItem.save();

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            await logMovement({
                inventoryId: newItem._id,
                productId: newItem.productId,
                type: "IN",
                quantity: newItem.totalStock,
                previousStock: 0,
                newStock: newItem.totalStock,
                reason: "Initial Stock",
                referenceId: "SETUP",
            });

            return res.status(201).json(newItem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const originalItem = await Inventory.findById(id);
            if (!originalItem) return res.status(404).json({ error: "Inventory item not found" });

            const previousStock = originalItem.totalStock;
            Object.assign(originalItem, req.body);
            const updatedItem = await originalItem.save();

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (updatedItem.productId) await redis.del(`product:${updatedItem.productId}`);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            if (updatedItem.totalStock !== previousStock) {
                const diff = updatedItem.totalStock - previousStock;
                await logMovement({
                    inventoryId: updatedItem._id,
                    productId: updatedItem.productId,
                    type: "ADJUSTMENT",
                    quantity: Math.abs(diff),
                    previousStock,
                    newStock: updatedItem.totalStock,
                    reason: "Manual Adjustment (Update API)",
                    referenceId: "ADMIN_UPDATE",
                });
            }

            return res.json(updatedItem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const deletedItem = await Inventory.findByIdAndDelete(id);
            if (!deletedItem) return res.status(404).json({ error: "Inventory item not found" });

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (deletedItem.productId) await redis.del(`product:${deletedItem.productId}`);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ message: "Inventory item deleted" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async checkStock(req, res) {
        try {
            await connectDB();
            const { productId, color, size, quantity } = req.body;
            const item = await Inventory.findOne({ productId, color, size });
            if (!item) return res.status(404).json({ error: "Item variant not found", available: false });

            return res.json({
                available: item.canFulfill(quantity || 1),
                availableStock: item.availableStock,
                status: item.status,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async reserve(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const { quantity, referenceId } = req.body;
            const item = await Inventory.findById(id);
            if (!item) return res.status(404).json({ error: "Item not found" });

            const previousReserved = item.reservedStock;
            await item.reserve(quantity);
            await logMovement({ inventoryId: item._id, productId: item.productId, type: "RESERVED", quantity, previousStock: previousReserved, newStock: item.reservedStock, reason: "Allocated to Order", referenceId: referenceId || "UNKNOWN_ORDER" });
            return res.json({ message: "Stock reserved", item });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async release(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const { quantity, referenceId } = req.body;
            const item = await Inventory.findById(id);
            if (!item) return res.status(404).json({ error: "Item not found" });

            const previousReserved = item.reservedStock;
            await item.release(quantity);
            await logMovement({ inventoryId: item._id, productId: item.productId, type: "RELEASED", quantity, previousStock: previousReserved, newStock: item.reservedStock, reason: "Order Cancelled/Expired", referenceId: referenceId || "UNKNOWN_ORDER" });
            return res.json({ message: "Stock released", item });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async commit(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const { quantity, referenceId } = req.body;
            const item = await Inventory.findById(id);
            if (!item) return res.status(404).json({ error: "Item not found" });

            const previousTotal = item.totalStock;
            await item.commitSold(quantity);
            await logMovement({ inventoryId: item._id, productId: item.productId, type: "SOLD", quantity, previousStock: previousTotal, newStock: item.totalStock, reason: "Order Fulfilled", referenceId: referenceId || "UNKNOWN_ORDER" });
            return res.json({ message: "Stock committed (sold)", item });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async restock(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const { quantity, reason } = req.body;
            const item = await Inventory.findById(id);
            if (!item) return res.status(404).json({ error: "Item not found" });

            const previousTotal = item.totalStock;
            await item.restock(quantity);

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN, CACHE_KEYS.INVENTORY_ALL);
                    if (item.productId) await redis.del(`product:${item.productId}`);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            await logMovement({ inventoryId: item._id, productId: item.productId, type: "IN", quantity, previousStock: previousTotal, newStock: item.totalStock, reason: reason || "Restock Shipment", referenceId: "RESTOCK_" + Date.now() });
            return res.json({ message: "Stock replenished", item });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async getMovements(req, res) {
        try {
            await connectDB();
            const { inventoryId, productId, type } = req.query;
            let query = {};
            if (inventoryId) query.inventoryId = inventoryId;
            if (productId) query.productId = productId;
            if (type) query.type = type;

            const movements = await InventoryMovement.find(query)
                .sort({ createdAt: -1 })
                .populate("performedBy", "name email");
            return res.json(movements);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
