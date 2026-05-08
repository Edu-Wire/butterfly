require('dotenv').config();
const mongoose = require('mongoose');

// Define simplified schemas
const collectionSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    isActive: Boolean
}, { strict: false, timestamps: true });

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

async function createCollection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const count = await Collection.countDocuments();
        console.log(`Current collection count: ${count}`);

        if (count === 0) {
            console.log('Creating "Featured" collection...');
            await Collection.create({
                name: 'Featured',
                description: 'Our finest selection',
                isActive: true,
                image: '/uploads/featured.jpg' // Placeholder
            });
            console.log('Created "Featured" collection.');

            console.log('Creating "New Arrivals" collection...');
            await Collection.create({
                name: 'New Arrivals',
                description: 'Latest trends',
                isActive: true,
                image: '/uploads/new.jpg' // Placeholder
            });
            console.log('Created "New Arrivals" collection.');
        } else {
            console.log('Collections already exist.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

createCollection();
