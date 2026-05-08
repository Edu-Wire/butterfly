const Redis = require('ioredis');

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }

    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    const password = process.env.REDIS_PASSWORD;
    const username = process.env.REDIS_USERNAME || 'default';

    if (host && port && password) {
        // The error ERR_SSL_PACKET_LENGTH_TOO_LONG means we are trying to use SSL/TLS
        // on a port that does not support it. Port 18254 is usually non-SSL.
        // We will force 'redis://' for this port.
        const protocol = (port === '18254') ? 'redis' : (port.startsWith('3') ? 'rediss' : 'redis');
        return `${protocol}://${username}:${password}@${host}:${port}`;
    }

    return null;
};

const redisUrl = getRedisUrl();

let redis;

if (redisUrl) {
    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError(err) {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            }
        });

        redis.on('error', (err) => {
            console.error('Redis error:', err);
        });

        redis.on('connect', () => {
            console.log('Redis connected');
        });
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
    }
} else {
    console.warn('Redis credentials not found in environment variables. Caching will be disabled.');
}

module.exports = redis;
