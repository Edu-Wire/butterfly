import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Contact from "@/models/Contact";
import Inventory from "@/models/inventory";
import { Types } from "mongoose";

export class OrderController {

    // CREATE ORDER
    static async create(req) {
        try {
            await connectDB();
            const body = await req.json();
            const {
                items,
                total,
                customer,
                userId,
                shipping: shippingAddress,
                billing: billingAddress,
                paymentMethod = 'COD',
                paymentStatus = 'pending',
                transactionId = ''
            } = body;

            // Validate required fields
            if (!items?.length || !customer?.email || !shippingAddress?.address || !billingAddress?.address) {
                return NextResponse.json(
                    { success: false, error: 'Missing required fields' },
                    { status: 400 }
                );
            }

            const order = await Order.create({
                items,
                total: Math.round(total * 100) / 100,
                customer,
                userId: userId || undefined,
                shipping: shippingAddress,
                billing: billingAddress,
                status: 'pending',
                paymentMethod,
                paymentStatus,
                transactionId
            });

            // --- Dynamic Inventory Synchronization Logic ---
            try {
                console.log(`🚀 [INVENTORY] Synchronizing stock for Order: ${order.orderId}`);

                for (const item of items) {
                    if (!item.productId) {
                        console.warn(`⚠️ [INVENTORY] Skipping item ${item.name} - No Product ID provided.`);
                        continue;
                    }

                    // Validate Product ID
                    if (!Types.ObjectId.isValid(item.productId)) {
                        console.error(`❌ [INVENTORY] Invalid Product ID format: ${item.productId} for item: ${item.name}`);
                        continue;
                    }

                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || 'N/A';
                    const itemColor = item.color || 'N/A';

                    // 🔍 MULTI-STAGE DYNAMIC MATCHING
                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });

                    if (!inventoryItem) {
                        console.log(`🔍 [INVENTORY] No exact match for ${item.name} (${itemSize}/${itemColor}), trying Size-Only fallback...`);
                        inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
                    }

                    if (!inventoryItem) {
                        console.log(`🔍 [INVENTORY] No Size-Only match, trying Generic fallback...`);
                        inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });
                    }

                    if (inventoryItem) {
                        console.log(`🎯 [INVENTORY] Match Found! Inventory Record ID: ${inventoryItem._id}`);

                        // Trigger persistent update
                        await inventoryItem.reserve(item.quantity);
                        console.log(`🔒 [INVENTORY] Reserved ${item.quantity} units. New Available: ${inventoryItem.availableStock}`);

                        if (paymentMethod === 'COD') {
                            await inventoryItem.commitSold(item.quantity);
                            console.log(`✅ [INVENTORY] COD Order: Committed ${item.quantity} units to SOLD.`);
                        }
                    } else {
                        console.warn(`❌ [INVENTORY] CRITICAL: No inventory record found in DB for Product ID ${item.productId} (${item.name})`);
                    }
                }
            } catch (inventoryError) {
                console.error('❌ [INVENTORY] System Failure during sync:', inventoryError.message);
            }
            // ----------------------------------------------

            // Create order confirmation email notification
            await Contact.create({
                name: customer.name,
                email: customer.email,
                subject: `Order Confirmation: ${order.orderId}`,
                message: `Your order has been received. Order ID: ${order.orderId}. Total: INR ${order.total.toLocaleString()}`,
            });

            return NextResponse.json({
                success: true,
                data: order,
                message: 'Order created successfully. Please check your email for confirmation.',
            });
        } catch (error) {
            console.error('[API] Orders POST error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to create order' },
                { status: 500 }
            );
        }
    }

    // GET ALL ORDERS
    static async getAll(req) {
        try {
            await connectDB();
            const url = new URL(req.url);
            const email = url.searchParams.get('email');
            const userId = url.searchParams.get('userId');

            let query = {};
            if (userId && Types.ObjectId.isValid(userId)) {
                query = { userId: userId };
            } else if (email) {
                query = { 'customer.email': email };
            }

            const orders = await Order.find(query).sort({ createdAt: -1 });

            return NextResponse.json({
                success: true,
                data: orders,
                count: orders.length,
            });
        } catch (error) {
            console.error('[API] Orders GET error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to fetch orders' },
                { status: 500 }
            );
        }
    }

    // GET ORDER BY ID
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const order = await Order.findById(id);

            if (!order) {
                return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: order });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    // DELETE ORDER
    static async delete(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;

            const order = await Order.findById(id);
            if (!order) {
                return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
            }

            console.log(`🗑️ [ORDER-DELETE] Deleting Order ${order.orderId}. Releasing stock...`);

            for (const item of order.items) {
                try {
                    if (!item.productId) continue;

                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || 'N/A';
                    const itemColor = item.color || 'N/A';

                    // Find inventory
                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });

                    if (inventoryItem) {
                        // Logic depends on order state
                        if (order.status === 'pending') {
                            // Pending order = Reserved stock. Release reservation.
                            await inventoryItem.release(item.quantity);
                            console.log(`✅ [ORDER-DELETE] Released RESERVED stock for ${item.name} (Available: ${inventoryItem.availableStock})`);
                        } else if (order.status === 'paid' || order.paymentStatus === 'paid') {
                            // Paid order = Sold stock. "Unsell" it -> increase totalStock.
                            await inventoryItem.restock(item.quantity);
                            // Also decrement sold count if you track it
                            inventoryItem.soldCount = Math.max(0, inventoryItem.soldCount - item.quantity);
                            await inventoryItem.save();
                            console.log(`✅ [ORDER-DELETE] Restocked SOLD item ${item.name} (Total: ${inventoryItem.totalStock})`);
                        } else {
                            console.log(`ℹ️ [ORDER-DELETE] Order status ${order.status} implies no active reservation to release.`);
                        }
                    }
                } catch (err) {
                    console.error(`❌ [ORDER-DELETE] Error releasing stock for item ${item.name}:`, err);
                }
            }

            await Order.findByIdAndDelete(id);

            return NextResponse.json({ success: true, message: "Order deleted and stock released." });
        } catch (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }
}
