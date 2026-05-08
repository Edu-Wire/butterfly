
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const db = mongoose.connection.db;
        const inventories = await db.collection('inventories').find({}).toArray();
        console.log(`Found ${inventories.length} inventory records.`);

        inventories.forEach(inv => {
            console.log(`\nSKU: ${inv.sku}`);
            console.log(`Product ID: ${inv.productId}`);
            console.log(`Total: ${inv.totalStock}`);
            console.log(`Reserved: ${inv.reservedStock}`);
            console.log(`Available: ${inv.availableStock}`);
            console.log(`Sold: ${inv.soldCount}`);
            console.log(`Color: ${inv.color}, Size: ${inv.size}`);
        });

        // Check the specific order the user mentioned
        const orderId = "ORD-FL2AFX5";
        const order = await db.collection('orders').findOne({ orderId });
        if (order) {
            console.log(`\n--- Order ${orderId} ---`);
            console.log(`Status: ${order.status}`);
            console.log(`Payment Status: ${order.paymentStatus}`);
            console.log(`Items:`, order.items.map(i => `${i.name} (Qty: ${i.quantity})`));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

run();
