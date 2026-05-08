require('dotenv').config();
const mongoose = require('mongoose');

// Define simplified schemas
const collectionSchema = new mongoose.Schema({ name: String, isActive: Boolean }, { strict: false });
const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

// In-memory categories simulation
const categories = [
    { id: 1, name: 'Evening Wear' },
    { id: 2, name: 'Cocktail' },
    { id: 3, name: 'Jacket' },
    { id: 4, name: 'Blazer' },
    { id: 5, name: 'Blouse' },
    { id: 6, name: 'Coat' }
];

async function checkData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        console.log('\n--- Collections Check ---');
        const collections = await Collection.find({});
        console.log(`Found ${collections.length} collections.`);
        if (collections.length > 0) {
            console.log('First collection:', JSON.stringify(collections[0], null, 2));
        } else {
            console.log('No collections found. This explains why the dropdown is empty.');
            // Prompt to create one?
        }

        console.log('\n--- Categories Check (InMemory) ---');
        console.log(`Expecting ${categories.length} categories.`);
        console.log('Example category:', JSON.stringify(categories[0], null, 2));

        console.log('\n--- API Connectivity Check ---');
        // Simple fetch check using global fetch (Node 18+)
        try {
            const apiRes = await fetch('http://localhost:3000/api/categories');
            console.log('Categories API Status:', apiRes.status);
            const apiText = await apiRes.text();
            console.log('Categories API Response:', apiText.substring(0, 200)); // Log first 200 chars
        } catch (e) {
            console.error('Failed to fetch API:', e.message);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

checkData();
