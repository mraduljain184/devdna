import Redis from "ioredis";

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  // Retry connection if it fails
  retryStrategy: (times) => {
    if (times > 3) {
      console.error("Redis connection failed after 3 retries");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

// Helper functions

// Set a value with expiry (TTL = time to live in seconds)
export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = 300,
): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error("Cache set error:", err);
  }
}

// Get a value from cache
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error("Cache get error:", err);
    return null;
  }
}

// Delete a value from cache
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error("Cache delete error:", err);
  }
}

// Delete multiple keys by pattern
// e.g. deletePattern('user:*') deletes all user cache
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error("Cache delete pattern error:", err);
  }
}

// Cache TTL constants (in seconds)
// Makes it easy to change TTLs in one place
export const CACHE_TTL = {
  LEADERBOARD: 5 * 60, // 5 minutes
  PUBLIC_PROFILE: 10 * 60, // 10 minutes
  BENCHMARK: 5 * 60, // 5 minutes
  DNA_PROFILE: 15 * 60, // 15 minutes
  REPOS: 30 * 60, // 30 minutes
};

export default redis;
