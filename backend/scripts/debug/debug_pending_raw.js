const fs = require('fs');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function checkPending() {
    let output = "";
    const log = (msg) => {
        output += msg + "\n";
        console.log(msg);
    };

    try {
        log("Connecting...");
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
        log("Connected.");

        const db = mongoose.connection.db;
        const ordersColl = db.collection('orders');
        const inventoryColl = db.collection('inventories'); // Note: Mongoose might pluralize differently. Usually 'inventories'.

        // Check Pending Orders Aggregate
        const pendingAgg = await ordersColl.aggregate([
            { $match: { status: "pending" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        productId: "$items.productId",
                        size: "$items.size",
                        color: "$items.color"
                    },
                    totalPending: { $sum: "$items.quantity" }
                }
            }
        ]).toArray();

        log("Pending Orders Aggregation Result: " + JSON.stringify(pendingAgg, null, 2));

        if (pendingAgg.length > 0) {
            for (const p of pendingAgg) {
                const pId = p._id.productId;
                const size = p._id.size || "N/A";
                const color = p._id.color || "N/A";

                log(`\nChecking Inventory for Product: ${pId}, Size: ${size}, Color: ${color}`);

                try {
                    // Need to cast string ID to ObjectId for matching
                    const pIdObj = new mongoose.Types.ObjectId(String(pId));

                    let inv = await inventoryColl.findOne({ productId: pIdObj, size: size, color: color });
                    if (!inv) {
                        log("No Exact Match. Trying Size Only...");
                        inv = await inventoryColl.findOne({ productId: pIdObj, size: size, color: "N/A" });
                    }
                    if (!inv) {
                        log("No Size Match. Trying Generic...");
                        inv = await inventoryColl.findOne({ productId: pIdObj, size: "N/A", color: "N/A" });
                    }

                    if (inv) {
                        log(`Found Inventory Item: ${JSON.stringify(inv, null, 2)}`);
                    } else {
                        log("Inventory Item Not Found!");
                    }
                } catch (e) {
                    log(`Error querying inventory: ${e.message}`);
                }
            }
        } else {
            log("No pending orders found.");
        }

    } catch (err) {
        log("Error: " + err);
    } finally {
        fs.writeFileSync('debug_pending.txt', output);
        await mongoose.disconnect();
        process.exit();
    }
}

checkPending();
