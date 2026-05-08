require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // try default .env too

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define schema (if not defined elsewhere, just for reading)
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkLatestProduct() {
    try {
        console.log('Connecting to MongoDB...');
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const product = await Product.findOne().sort({ createdAt: -1 });

        if (!product) {
            console.log('No products found.');
            return;
        }

        console.log('Latest Product:');
        console.log(JSON.stringify(product, null, 2));

        const images = product.images || (product.image ? [product.image] : []);

        if (images.length > 0) {
            console.log('Checking images on disk...');
            images.forEach(imgUrl => {
                if (imgUrl.startsWith('/uploads/')) {
                    // Check local path relative to public
                    const localPath = path.join(process.cwd(), 'public', imgUrl);
                    console.log(`Checking file: ${localPath}`);
                    if (fs.existsSync(localPath)) {
                        console.log(`✅ File exists on disk.`);
                        const stats = fs.statSync(localPath);
                        console.log(`Size: ${stats.size} bytes`);
                    } else {
                        console.log(`❌ File DOES NOT exist on disk.`);
                    }
                } else {
                    console.log(`External URL: ${imgUrl}`);
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

checkLatestProduct();
