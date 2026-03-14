import { redis } from "@/lib/redis";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function checkRateLimit(options: RateLimitOptions) {
  const current = await redis.incr(options.key);

  if (current === 1) {
    await redis.expire(options.key, options.windowSeconds);
  }

  const ttl = await redis.ttl(options.key);

  return {
    success: current <= options.limit,
    limit: options.limit,
    remaining: Math.max(0, options.limit - current),
    retryAfter: ttl > 0 ? ttl : options.windowSeconds,
    current,
  };
}