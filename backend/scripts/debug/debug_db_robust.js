const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in .env');
        return;
    }
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // Uses the DB name from URI
        const products = db.collection('products');

        const productId = '698ef987ac9bd42fb38eedde';
        console.log('Searching for product:', productId);

        let product;
        try {
            product = await products.findOne({ _id: new ObjectId(productId) });
        } catch (e) {
            console.log('Error searching by ObjectId, trying string match:', e.message);
            product = await products.findOne({ _id: productId });
        }

        if (!product) {
            console.log('Product not found.');
            // List last 5 products to see what's there
            const lastProducts = await products.find().sort({ _id: -1 }).limit(5).toArray();
            console.log('Last 5 products:');
            lastProducts.forEach(p => console.log(`- ${p._id}: ${p.name} (images: ${JSON.stringify(p.images)})`));
            return;
        }

        console.log('--- Found Product ---');
        console.log(JSON.stringify(product, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

main();
