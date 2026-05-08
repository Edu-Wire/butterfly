const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const products = db.collection('products');

        const productId = '698ef987ac9bd42fb38eedde';
        const localPath = '/uploads/product-1769255378058.png';

        console.log(`Updating product ${productId} to use local image ${localPath}`);

        const result = await products.updateOne(
            { _id: new ObjectId(productId) },
            {
                $set: {
                    images: [localPath],
                    imageGradient: localPath
                }
            }
        );

        console.log('Update result:', result);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
