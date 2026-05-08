import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import fs from "fs";

const MONGO_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function seedAdmin() {
    const client = new MongoClient(MONGO_URI);
    try {
        fs.writeFileSync("seed_log.txt", "Connecting to MongoDB...\n");
        await client.connect();
        fs.appendFileSync("seed_log.txt", "Connected successfully.\n");

        const db = client.db("butterfly");
        const users = db.collection("users");

        const adminEmail = "admin@butterfly.com";
        const existingAdmin = await users.findOne({ email: adminEmail });

        const adminData = {
            name: "Admin User",
            email: adminEmail,
            role: "admin",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            phoneNumber: "1234567890",
            isActive: true,
            updatedAt: new Date()
        };

        if (existingAdmin) {
            fs.appendFileSync("seed_log.txt", "Admin user exists, updating fields...\n");
            await users.updateOne({ email: adminEmail }, { $set: adminData });
            console.log("ℹ️ Admin user updated successfully!");
        } else {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await users.insertOne({
                ...adminData,
                password: hashedPassword,
                createdAt: new Date()
            });
            console.log("🚀 Admin user seeded successfully!");
        }

        fs.appendFileSync("seed_log.txt", "Admin seeding/update operation completed.\n");
        process.exit(0);

    } catch (error) {
        fs.appendFileSync("seed_log.txt", "Error: " + error.message + "\n" + error.stack + "\n");
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seedAdmin();

