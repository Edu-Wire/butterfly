
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

// Define schemas manually for script
const inventorySchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    size: String,
    color: String,
    totalStock: Number,
    reservedStock: Number,
    availableStock: Number,
    soldCount: { type: Number, default: 0 }
});

inventorySchema.pre("save", function (next) {
    this.availableStock = this.totalStock - this.reservedStock;
    next();
});

inventorySchema.methods.commitSold = async function (quantity) {
    if (this.reservedStock < quantity) {
        this.totalStock -= quantity;
    } else {
        this.reservedStock -= quantity;
        this.totalStock -= quantity;
    }
    this.soldCount += quantity;
    return this.save();
};

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

async function fixOrder(orderId) {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const db = mongoose.connection.db;
        const order = await db.collection('orders').findOne({ orderId });

        if (!order) {
            console.log("Order not found");
            return;
        }

        console.log(`Processing Order: ${orderId}, Status: ${order.status}`);

        for (const item of order.items) {
            const pId = new mongoose.Types.ObjectId(item.productId);
            const itemSize = item.size || 'N/A';
            const itemColor = item.color || 'N/A';

            console.log(`Searching for ${item.name} (${itemSize}/${itemColor})...`);

            let inv = await Inventory.findOne({ productId: pId, size: itemSize, color: itemColor });
            if (!inv) inv = await Inventory.findOne({ productId: pId, size: itemSize, color: 'N/A' });
            if (!inv) inv = await Inventory.findOne({ productId: pId, size: 'N/A', color: 'N/A' });

            if (inv) {
                console.log(`Found Inventory record: ${inv._id}. Current Sold: ${inv.soldCount}, Total: ${inv.totalStock}`);
                await inv.commitSold(item.quantity);
                console.log(`✅ Updated! New Sold: ${inv.soldCount}, New Total: ${inv.totalStock}, New Available: ${inv.availableStock}`);
            } else {
                console.log(`❌ No inventory record found for ${item.name}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

fixOrder("ORD-FL2AFX5");
