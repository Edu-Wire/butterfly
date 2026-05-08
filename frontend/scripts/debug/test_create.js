const mongoose = require('mongoose');
require('dotenv').config();

// Simple Product Schema for test
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    images: [String],
    category: String,
    isActive: Boolean
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function testCreate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const testName = 'Test Product ' + Date.now();
        const product = await Product.create({
            name: testName,
            price: 99,
            brand: 'Test Brand',
            category: 'Test Category',
            subCategory: 'Test Style',
            gender: 'Unisex',
            images: ['/uploads/test.jpg'],
            isActive: true
        });

        console.log('Product created:', product._id);

        // Find it back
        const found = await Product.findById(product._id);
        console.log('Verified in DB:', found ? 'Yes' : 'No');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

testCreate();
