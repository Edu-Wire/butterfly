
const mongoose = require('mongoose');

// URI from lib/db.js
const MONGODB_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

const checkStatus = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
        console.log('MongoDB connected');

        const db = mongoose.connection.db;
        const inventoryCollection = db.collection('inventories');
        const orderCollection = db.collection('orders');

        // Check the order from the screenshot
        const orderId = "ORD-FL2AFX5";
        const order = await orderCollection.findOne({ orderId });

        if (order) {
            console.log('\n--- Order Details ---');
            console.log(`OrderId: ${order.orderId}`);
            console.log(`Status: ${order.status}`);
            console.log(`Payment Status: ${order.paymentStatus}`);
            console.log(`Items:`, JSON.stringify(order.items, null, 2));

            for (const item of order.items) {
                const inv = await inventoryCollection.findOne({
                    productId: item.productId,
                    size: item.size,
                    color: item.color
                });

                if (inv) {
                    console.log(`\n--- Inventory for ${item.name} (${item.size}/${item.color}) ---`);
                    console.log(`Total Stock: ${inv.totalStock}`);
                    console.log(`Reserved Stock: ${inv.reservedStock}`);
                    console.log(`Available Stock: ${inv.availableStock}`);
                    console.log(`Sold Count: ${inv.soldCount}`);

                    // Verify if math is correct: availableStock should be totalStock - reservedStock
                    const expectedAvailable = inv.totalStock - inv.reservedStock;
                    if (inv.availableStock === expectedAvailable) {
                        console.log(`✅ Available Stock is correctly synced (${inv.totalStock} - ${inv.reservedStock} = ${inv.availableStock})`);
                    } else {
                        console.log(`❌ MISMATCH! Available Stock is ${inv.availableStock}, but should be ${expectedAvailable}`);
                    }
                } else {
                    console.log(`\n❌ No inventory found for ProductId: ${item.productId} (${item.name}, ${item.size}/${item.color})`);

                    // Try looking for variant with any size/color
                    const variants = await inventoryCollection.find({ productId: item.productId }).toArray();
                    if (variants.length > 0) {
                        console.log(`Found other variants for this product:`);
                        variants.forEach(v => console.log(` - ${v.size}/${v.color}: Total=${v.totalStock}, Reserved=${v.reservedStock}`));
                    }
                }
            }
        } else {
            console.log(`Order ${orderId} not found`);
            const recentOrders = await orderCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray();
            console.log('\n--- Recent Orders ---');
            recentOrders.forEach(o => console.log(`${o.orderId} | Status: ${o.status} | Payment: ${o.paymentStatus}`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkStatus();
