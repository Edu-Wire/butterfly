import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function seedCollections() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("butterfly");
        const collections = db.collection("collections");

        const data = [
            {
                name: "Summer 2026",
                slug: "summer-2026",
                description: "Light and airy styles for the warmest months.",
                products: [],
                bannerImage: "https://images.unsplash.com/photo-1523381235312-3a1647fa9a41",
                isFeatured: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const item of data) {
            await collections.updateOne(
                { slug: item.slug },
                { $set: item },
                { upsert: true }
            );
        }

        console.log("🚀 Collections seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding collections:", error);
    } finally {
        await client.close();
    }
}

seedCollections();
