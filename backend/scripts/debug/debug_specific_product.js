require('dotenv').config();
const mongoose = require('mongoose');

// Define simplified schemas
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkProduct() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const productId = '698ef987ac9bd42fb38eedde';
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found.');
            return;
        }

        console.log('--- Product Data ---');
        console.log('Name:', product.name);
        console.log('Image (imageGradient):', product.imageGradient);
        console.log('Images Array:', product.images);
        console.log('imageUrl field:', product.imageUrl);
        console.log('Entire Document:', JSON.stringify(product, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkProduct();
