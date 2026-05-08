import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },

        // Variant details
        color: {
            type: String,
            required: true
        },

        size: {
            type: String,
            required: true
        },

        sku: {
            type: String,
            required: true,
            unique: true
        },

        // Stock management
        totalStock: {
            type: Number,
            required: true,
            min: 0
        },

        reservedStock: {
            type: Number,
            default: 0,
            min: 0
        },

        availableStock: {
            type: Number,
            default: 0
        },

        lowStockThreshold: {
            type: Number,
            default: 5
        },

        status: {
            type: String,
            enum: ["in_stock", "out_of_stock", "discontinued"],
            default: "in_stock"
        },

        // Warehouse & Logistics
        warehouseLocation: {
            type: String,
            trim: true
        },

        aisle: {
            type: String,
            trim: true
        },

        shelf: {
            type: String,
            trim: true
        },

        // Supply Chain & Costing
        supplier: {
            type: String,
            trim: true
        },

        batchNumber: {
            type: String,
            trim: true
        },

        costPrice: {
            type: Number,
            min: 0
        },

        lastRestocked: {
            type: Date
        },

        soldCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Pre-save hook to keep availableStock in sync
inventorySchema.pre("save", function () {
    this.availableStock = this.totalStock - this.reservedStock;
});

// Index for fast search
inventorySchema.index({ productId: 1, color: 1, size: 1 }, { unique: true });

// --- Instance Methods ---

inventorySchema.methods.canFulfill = function (quantity) {
    return this.availableStock >= quantity;
};

/**
 * Reserve stock for an order
 * @param {number} quantity 
 */
inventorySchema.methods.reserve = async function (quantity) {
    const availableBefore = this.totalStock - this.reservedStock;
    if (availableBefore < quantity) {
        throw new Error(`Insufficient stock. Total: ${this.totalStock}, Reserved: ${this.reservedStock}, Requested: ${quantity}`);
    }

    this.reservedStock += quantity;

    // Check available after reservation
    const availableAfter = this.totalStock - this.reservedStock;
    if (availableAfter <= 0) {
        this.status = 'out_of_stock';
    }
    return this.save();
};

/**
 * Release reserved stock (e.g. cancelled order)
 * @param {number} quantity 
 */
inventorySchema.methods.release = async function (quantity) {
    if (this.reservedStock < quantity) {
        throw new Error("Cannot release more than reserved stock.");
    }
    this.reservedStock -= quantity;
    if (this.availableStock > 0 && this.status === 'out_of_stock') {
        this.status = 'in_stock';
    }
    return this.save();
};

/**
 * Commit stock (sold) - reduces total and reserved
 * @param {number} quantity 
 */
inventorySchema.methods.commitSold = async function (quantity) {
    if (this.reservedStock < quantity) {
        // If not reserved, check total
        if (this.availableStock < quantity) {
            throw new Error("Insufficient stock to sell.");
        }
        // If we are selling un-reserved stock directly
        this.totalStock -= quantity;
    } else {
        // Consuming reserved stock
        this.reservedStock -= quantity;
        this.totalStock -= quantity;
    }

    this.soldCount += quantity;

    if (this.totalStock === 0) {
        this.status = "out_of_stock";
    }
    return this.save();
};

/**
 * Add new stock
 * @param {number} quantity 
 */
inventorySchema.methods.restock = async function (quantity) {
    this.totalStock += quantity;
    this.lastRestocked = new Date();
    if (this.totalStock > 0 && this.status === "out_of_stock") {
        this.status = "in_stock";
    }
    return this.save();
};

// Check for existing model to prevent overwrite errors in dev
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
