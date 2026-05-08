
const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
    let output = "";
    const log = (msg) => {
        output += msg + "\n";
        console.log(msg);
    };

    try {
        log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
        log("Connected to DB");

        const db = mongoose.connection.db;
        const inventories = await db.collection('inventories').find({}).toArray();
        log(`Found ${inventories.length} inventory records.`);

        inventories.forEach(inv => {
            log(`\nSKU: ${inv.sku}`);
            log(`Product ID: ${inv.productId}`);
            log(`TotalStock: ${inv.totalStock}`);
            log(`ReservedStock: ${inv.reservedStock}`);
            log(`AvailableStock: ${inv.availableStock}`);
            log(`SoldCount: ${inv.soldCount}`);
            log(`Color: ${inv.color}, Size: ${inv.size}`);
        });

        const orderId = "ORD-FL2AFX5";
        const order = await db.collection('orders').findOne({ orderId });
        if (order) {
            log(`\n--- Order ${orderId} ---`);
            log(`Status: ${order.status}`);
            log(`Payment Status: ${order.paymentStatus}`);
            log(`Items: ${JSON.stringify(order.items)}`);
        } else {
            log(`\nOrder ${orderId} not found`);
        }

    } catch (err) {
        log("Error: " + err.message);
    } finally {
        fs.writeFileSync('debug_output.txt', output);
        await mongoose.disconnect();
        process.exit();
    }
}

run();
