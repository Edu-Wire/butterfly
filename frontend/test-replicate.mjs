
import Replicate from 'replicate';
import dotenv from 'dotenv';
dotenv.config();

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
    try {
        console.log("Testing Replicate token:", process.env.REPLICATE_API_TOKEN ? "Present" : "Missing");
        if (process.env.REPLICATE_API_TOKEN) {
            console.log("Token length:", process.env.REPLICATE_API_TOKEN.length);
            console.log("Token start:", process.env.REPLICATE_API_TOKEN.substring(0, 5));
        }

        // Simple fetch to verify auth
        // We'll try to get the model details
        const model = await replicate.models.get("cuuupid", "idm-vton");
        console.log("Model fetched successfully:", model.latest_version?.id);
    } catch (error) {
        console.log("Replicate Error:", error.message);
        if (error.response) {
            console.log("Status:", error.response.status);
        }
    }
}

test();
