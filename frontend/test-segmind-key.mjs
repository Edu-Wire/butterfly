
import dotenv from 'dotenv';
dotenv.config();

console.log("Checking SEGMIND_API_KEY...");
const key = process.env.SEGMIND_API_KEY;

if (!key) {
    console.error("❌ SEGMIND_API_KEY is not set in .env");
    process.exit(1);
}

console.log("✅ SEGMIND_API_KEY is present.");
console.log("Key length:", key.length);
console.log("Key prefix:", key.substring(0, 5) + "...");

// Example test call to verify API key validity (using a cheap endpoint if possible, or just checking if it works)
// Since we don't want to use credits, we'll just check if the endpoint is reachable.
// But IDM request is expensive. Let's just trust the key or try a GET request if available.
// Segmind API doesn't have a simple 'whoami'.
// We'll skip the call to save credits and just confirm env setup.
