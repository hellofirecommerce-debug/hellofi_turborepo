import redis from "../../lib/redis/redis.client";

class RedisService {
  // ── Get parsed JSON value ──
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`❌ Redis GET error for key "${key}":`, error);
      return null;
    }
  }

  // ── Set JSON value with optional TTL in seconds ──
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.set(key, serialized, "EX", ttlSeconds);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      console.error(`❌ Redis SET error for key "${key}":`, error);
    }
  }

  // ── Delete a key ──
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`❌ Redis DEL error for key "${key}":`, error);
    }
  }

  // ── Delete multiple keys by pattern ──
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`✅ Deleted ${keys.length} keys matching "${pattern}"`);
      }
    } catch (error) {
      console.error(`❌ Redis DEL pattern error for "${pattern}":`, error);
    }
  }

  // ── Check if key exists ──
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Redis EXISTS error for key "${key}":`, error);
      return false;
    }
  }

  // ── Set TTL on existing key ──
  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await redis.expire(key, ttlSeconds);
    } catch (error) {
      console.error(`❌ Redis EXPIRE error for key "${key}":`, error);
    }
  }
}

export default new RedisService();
