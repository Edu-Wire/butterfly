import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    name: String
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

console.log("🚀 Starting debug script...");
async function listUsers() {
    try {
        console.log("⏳ Connecting to DB...");
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to DB ✅");
        const users = await User.find({}, 'email role name');
        console.log("Users in DB:");
        console.log(JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

listUsers();
