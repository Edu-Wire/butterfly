import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        orderObjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                quantity: Number,
                price: Number,
                size: String,
                color: String,
                reason: String,
                condition: String,
            },
        ],
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "received", "refunded", "cancelled"],
            default: "pending",
        },
        customerReason: {
            type: String,
        },
        adminNotes: {
            type: String,
        },
        images: [String],
        refundAmount: {
            type: Number,
        },
        trackingNumber: {
            type: String,
        },
    },
    { timestamps: true }
);

// Avoid OverwriteModelError
delete mongoose.models.ReturnRequest;
export default mongoose.models.ReturnRequest || mongoose.model("ReturnRequest", returnRequestSchema);
