
const mongoose = require('mongoose');
const fs = require('fs');

const logFile = 'inventory_log.txt';
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
};

// Clear previous log
fs.writeFileSync(logFile, 'Starting log...\n');

const MONGODB_URI = "mongodb+srv://pranshugupta641:pEY8f0LzJHn2BvqF@cluster0.lmc45pl.mongodb.net/butterfly";

log('Connecting to MongoDB...');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        log('MongoDB connected successfully');

        const collections = await mongoose.connection.db.listCollections().toArray();
        log('Collections: ' + collections.map(c => c.name).join(', '));

        const inventoryCollection = mongoose.connection.db.collection('inventories');
        const items = await inventoryCollection.find({}).toArray();

        log('\n--- Inventory Items ---');
        if (items.length === 0) {
            log('No inventory items found! You need to CREATE one first (POST).');
        } else {
            items.forEach(item => {
                log(`ID: ${item._id.toString()} | ProductId: ${item.productId} | Stock: ${item.totalStock} | Color: ${item.color}`);
            });
            log('\nUse one of the IDs above for your PUT request.');
        }

    } catch (error) {
        log('Error in script: ' + error.message);
    } finally {
        await mongoose.disconnect();
        log('Disconnected');
        process.exit(0);
    }
};

connectDB();
