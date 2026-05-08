import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function checkCollections() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("butterfly");
        const collections = await db.collection("collections").find({}).toArray();
        console.log("Current Collections in DB:");
        console.log(JSON.stringify(collections, null, 2));
    } catch (error) {
        console.error("Error checking collections:", error);
    } finally {
        await client.close();
    }
}

checkCollections();
