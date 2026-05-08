console.log('Script started');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    console.log('Env loaded');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is missing');
        return;
    }
    console.log('URI:', uri.substring(0, 20) + '...');
    const client = new MongoClient(uri);

    try {
        console.log('Connecting...');
        await client.connect();
        const db = client.db();
        console.log('Connected to Database:', db.databaseName);

        const collections = await db.listCollections().toArray();
        console.log('--- Collections ---');
        collections.forEach(c => console.log(`- ${c.name}`));

        for (const c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`  Count in ${c.name}: ${count}`);
        }

    } catch (e) {
        console.error('Error in main:', e);
    } finally {
        await client.close();
        console.log('Done');
    }
}

main().catch(err => console.error('Outer error:', err));
