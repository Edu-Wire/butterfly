import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            default: () => "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        customer: {
            name: String,
            email: String,
            phone: String,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                price: Number,
                quantity: Number,
                size: String,
                color: String,
                measurements: Object,
                customSize: Object,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        shipping: {
            address: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        billing: {
            address: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "COD", // Default to Cash on Delivery
        },
        transactionId: {
            type: String,
        },
        deliveryStatus: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Avoid OverwriteModelError
delete mongoose.models.Order;
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
