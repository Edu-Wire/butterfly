const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        console.log('Connected to Database:', db.databaseName);

        const collections = await db.listCollections().toArray();
        console.log('--- Collections ---');
        collections.forEach(c => console.log(`- ${c.name}`));

        // For each collection, count docs
        for (const c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`  Count in ${c.name}: ${count}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
