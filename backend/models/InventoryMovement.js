import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema(
    {
        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
            index: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        type: {
            type: String,
            enum: ["IN", "OUT", "ADJUSTMENT", "RESERVED", "RELEASED", "SOLD"],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        previousStock: {
            type: Number, // Snapshot of stock before this movement
            required: true
        },
        newStock: {
            type: Number, // Snapshot of stock after
            required: true
        },
        reason: {
            type: String,
            trim: true
        },
        referenceId: {
            type: String, // e.g., Order ID, Transfer ID
            trim: true
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // If you track which admin/user did it
        }
    },
    { timestamps: true }
);

const InventoryMovement = mongoose.models.InventoryMovement || mongoose.model("InventoryMovement", inventoryMovementSchema);

export default InventoryMovement;
