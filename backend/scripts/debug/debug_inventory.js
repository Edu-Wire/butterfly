
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://pranshugupta641:pEY8f0LzJHn2BvqF@cluster0.lmc45pl.mongodb.net/butterfly";

console.log('Starting script...');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const inventoryCollection = mongoose.connection.db.collection('inventories');
        const items = await inventoryCollection.find({}).toArray();

        console.log('\n--- Inventory Items ---');
        if (items.length === 0) {
            console.log('No inventory items found! You need to CREATE one first (POST).');
        } else {
            items.forEach(item => {
                console.log(`ID: ${item._id.toString()} | ProductId: ${item.productId} | Stock: ${item.totalStock}`);
            });

            // Helpful message for the user
            console.log('\nUse one of the IDs above for your PUT request.');
        }

    } catch (error) {
        console.error('Error in script:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    }
};

connectDB();
