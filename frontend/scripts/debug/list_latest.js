const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const products = db.collection('products');

        console.log('Fetching 5 latest products...');
        const latest = await products.find().sort({ createdAt: -1 }).limit(5).toArray();

        latest.forEach(p => {
            console.log(`- ID: ${p._id}, Name: ${p.name}, CreatedAt: ${p.createdAt}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
