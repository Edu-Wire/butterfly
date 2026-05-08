import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing connection to:', MONGODB_URI?.split('@')[1]); // Log host part only

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Successfully connected to MongoDB');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err);
    }
}

testConnection();
