import Redis from "ioredis";

const getRedisUrl = () => {
    if (process.env.REDIS_URL) return process.env.REDIS_URL;

    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    const password = process.env.REDIS_PASSWORD;
    const username = process.env.REDIS_USERNAME || "default";

    if (host && port && password) {
        const protocol = port === "18254" ? "redis" : port.startsWith("3") ? "rediss" : "redis";
        return `${protocol}://${username}:${password}@${host}:${port}`;
    }
    return null;
};

const redisUrl = getRedisUrl();

let redis = null;

if (redisUrl) {
    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                return Math.min(times * 50, 2000);
            },
            reconnectOnError(err) {
                return err.message.includes("READONLY");
            },
        });
        redis.on("error", (err) => console.error("Redis error:", err));
        redis.on("connect", () => console.log("Redis connected ✅"));
    } catch (error) {
        console.error("Failed to initialize Redis:", error);
        redis = null;
    }
} else {
    console.warn("Redis credentials not found. Caching will be disabled.");
}

export default redis;
