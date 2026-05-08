const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order.js');
const Inventory = require('./models/inventory.js');

async function checkPending() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        // Check Pending Orders
        const pendingAgg = await Order.aggregate([
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
        ]);

        console.log("Pending Aggregation Result:", JSON.stringify(pendingAgg, null, 2));

        if (pendingAgg.length > 0) {
            const p = pendingAgg[0];
            const pId = p._id.productId;
            const size = p._id.size || "N/A";
            const color = p._id.color || "N/A";

            console.log(`Checking Inventory for Product: ${pId}, Size: ${size}, Color: ${color}`);

            let inv = await Inventory.findOne({ productId: pId, size: size, color: color });
            if (!inv) {
                console.log("No Exact Match. Trying Size Only...");
                inv = await Inventory.findOne({ productId: pId, size: size, color: "N/A" });
            }
            if (!inv) {
                console.log("No Size Match. Trying Generic...");
                inv = await Inventory.findOne({ productId: pId, size: "N/A", color: "N/A" });
            }

            if (inv) {
                console.log("Found Inventory Item:", JSON.stringify(inv, null, 2));
            } else {
                console.log("Inventory Item Not Found!");
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkPending();
