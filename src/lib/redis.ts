import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

declare global {
  var redisClient: Redis | undefined;
}

export const redis =
  global.redisClient ||
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    // Add this TLS block to fix the EINVAL error for Upstash
    tls: {
      rejectUnauthorized: false, 
    },
    connectTimeout: 10000, // 10 seconds
  });

// Error handling to prevent the "Unhandled error event" crash
redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  global.redisClient = redis;
}