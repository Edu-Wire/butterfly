const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://butterfly-couture:8zO9y1X1sJ4f7K6m@butterfly-couture.t4z1e.mongodb.net/butterfly-couture?retryWrites=true&w=majority";

const inventorySchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    totalStock: Number,
    reservedStock: Number,
    sku: String,
    color: String,
    size: String
});
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

const orderSchema = new mongoose.Schema({
    items: [{
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        color: String,
        size: String
    }]
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

async function debug() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const inventories = await Inventory.find().lean();
    console.log("Inventories found:", inventories.length);
    inventories.forEach(i => {
        console.log(`INV: ${i.sku} | PID: ${i.productId} | Color: ${i.color} | Size: ${i.size} | Total: ${i.totalStock} | Reserved: ${i.reservedStock}`);
    });

    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    console.log("\nLatest 5 Orders:");
    orders.forEach(o => {
        console.log(`Order ID: ${o._id} | Created: ${o.createdAt}`);
        o.items.forEach(item => {
            console.log(`  - Item: PID ${item.productId} | Color: ${item.color} | Size: ${item.size} | Qty: ${item.quantity}`);
        });
    });

    process.exit();
}

debug().catch(err => {
    console.error(err);
    process.exit(1);
});
