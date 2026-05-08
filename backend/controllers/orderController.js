import { connectDB } from "../lib/db.js";
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";
import Inventory from "../models/inventory.js";
import { Types } from "mongoose";

export class OrderController {
    static async create(req, res) {
        try {
            await connectDB();
            const {
                items,
                total,
                customer,
                userId,
                shipping: shippingAddress,
                billing: billingAddress,
                paymentMethod = "COD",
                paymentStatus = "pending",
                transactionId = "",
            } = req.body;

            if (!items?.length || !customer?.email || !shippingAddress?.address || !billingAddress?.address) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const order = await Order.create({
                items,
                total: Math.round(total * 100) / 100,
                customer,
                userId: userId || undefined,
                shipping: shippingAddress,
                billing: billingAddress,
                status: "pending",
                paymentMethod,
                paymentStatus,
                transactionId,
            });

            try {
                console.log(`🚀 [INVENTORY] Synchronizing stock for Order: ${order.orderId}`);
                for (const item of items) {
                    if (!item.productId) continue;
                    if (!Types.ObjectId.isValid(item.productId)) continue;

                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || "N/A";
                    const itemColor = item.color || "N/A";

                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: "N/A" });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: "N/A", color: "N/A" });

                    if (inventoryItem) {
                        await inventoryItem.reserve(item.quantity);
                        if (paymentMethod === "COD") {
                            await inventoryItem.commitSold(item.quantity);
                        }
                    }
                }
            } catch (inventoryError) {
                console.error("❌ [INVENTORY] System Failure:", inventoryError.message);
            }

            await Contact.create({
                name: customer.name,
                email: customer.email,
                subject: `Order Confirmation: ${order.orderId}`,
                message: `Your order has been received. Order ID: ${order.orderId}. Total: INR ${order.total.toLocaleString()}`,
            });

            return res.json({
                success: true,
                data: order,
                message: "Order created successfully. Please check your email for confirmation.",
            });
        } catch (error) {
            console.error("[Orders] POST error:", error);
            return res.status(500).json({ success: false, error: error.message || "Failed to create order" });
        }
    }

    static async getAll(req, res) {
        try {
            await connectDB();
            const { email, userId } = req.query;

            let query = {};
            if (userId && Types.ObjectId.isValid(userId)) {
                query = { userId };
            } else if (email) {
                query = { "customer.email": email };
            }

            const orders = await Order.find(query).sort({ createdAt: -1 });
            return res.json({ success: true, data: orders, count: orders.length });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message || "Failed to fetch orders" });
        }
    }

    static async getById(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });
            return res.json({ success: true, data: order });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });

            for (const item of order.items) {
                try {
                    if (!item.productId) continue;
                    const pId = new Types.ObjectId(item.productId);
                    const itemSize = item.size || "N/A";
                    const itemColor = item.color || "N/A";

                    let inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: itemSize, color: "N/A" });
                    if (!inventoryItem) inventoryItem = await Inventory.findOne({ productId: pId, size: "N/A", color: "N/A" });

                    if (inventoryItem) {
                        if (order.status === "pending") {
                            await inventoryItem.release(item.quantity);
                        } else if (order.status === "paid" || order.paymentStatus === "paid") {
                            await inventoryItem.restock(item.quantity);
                            inventoryItem.soldCount = Math.max(0, inventoryItem.soldCount - item.quantity);
                            await inventoryItem.save();
                        }
                    }
                } catch (err) {
                    console.error(`❌ [ORDER-DELETE] Error releasing stock:`, err);
                }
            }

            await Order.findByIdAndDelete(id);
            return res.json({ success: true, message: "Order deleted and stock released." });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
