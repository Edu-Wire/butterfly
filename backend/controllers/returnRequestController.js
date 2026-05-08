import { connectDB } from "../lib/db.js";
import ReturnRequest from "../models/ReturnRequest.js";
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { Types } from "mongoose";

export class ReturnRequestController {
    static async create(req, res) {
        try {
            await connectDB();
            const { orderId, orderObjectId, userId, items, customerReason, images } = req.body;

            if (!orderId || !orderObjectId || !userId || !items?.length) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const order = await Order.findById(orderObjectId);
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });

            const returnRequest = await ReturnRequest.create({
                orderId, orderObjectId, userId, items, customerReason, images, status: "pending",
            });

            try {
                const user = await User.findById(userId);
                if (user) {
                    await Contact.create({
                        name: user.name,
                        email: user.email,
                        subject: `Return Request Received: ${orderId}`,
                        message: `We have received your return request for Order ${orderId}. We will review it and get back to you within 2-3 business days.`,
                    });
                }
            } catch (notifErr) {
                console.error("Error creating return notification:", notifErr);
            }

            return res.json({
                success: true,
                data: returnRequest,
                message: "Return request submitted successfully. We will review it and get back to you.",
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message || "Failed to submit return request" });
        }
    }

    static async getAll(req, res) {
        try {
            await connectDB();
            const { userId } = req.query;
            let query = {};
            if (userId && Types.ObjectId.isValid(userId)) query = { userId };

            const returns = await ReturnRequest.find(query)
                .populate("userId", "name email")
                .sort({ createdAt: -1 });

            return res.json({ success: true, data: returns, count: returns.length });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message || "Failed to fetch return requests" });
        }
    }

    static async updateStatus(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const { status, adminNotes, refundAmount } = req.body;

            const returnRequest = await ReturnRequest.findById(id);
            if (!returnRequest) return res.status(404).json({ success: false, error: "Return request not found" });

            returnRequest.status = status || returnRequest.status;
            returnRequest.adminNotes = adminNotes || returnRequest.adminNotes;
            if (refundAmount !== undefined) returnRequest.refundAmount = refundAmount;
            await returnRequest.save();

            try {
                const user = await User.findById(returnRequest.userId);
                if (user) {
                    await Contact.create({
                        name: user.name,
                        email: user.email,
                        subject: `Return Request ${status.toUpperCase()}: ${returnRequest.orderId}`,
                        message: `The status of your return request for Order ${returnRequest.orderId} has been updated to: ${status.toUpperCase()}. ${adminNotes ? `Admin Notes: ${adminNotes}` : ""}`,
                    });
                }
            } catch (notifErr) {
                console.error("Error creating return status notification:", notifErr);
            }

            if (status === "refunded") {
                const order = await Order.findById(returnRequest.orderObjectId);
                if (order) {
                    order.paymentStatus = "refunded";
                    await order.save();
                }
            }

            return res.json({ success: true, data: returnRequest });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const returnRequest = await ReturnRequest.findById(id);
            if (!returnRequest) return res.status(404).json({ success: false, error: "Return request not found" });
            return res.json({ success: true, data: returnRequest });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
