const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const products = db.collection('products');

        const allProducts = await products.find().toArray();
        console.log('--- All Products ---');
        allProducts.forEach(p => {
            console.log(`ID: ${p._id}, Name: ${p.name}`);
            console.log(`  images: ${JSON.stringify(p.images)}`);
            console.log(`  imageGradient: ${p.imageGradient}`);
            console.log('------------------');
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
