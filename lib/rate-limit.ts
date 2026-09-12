import { redis, redisConfigured } from "@/lib/redis";

const WINDOW_SECONDS = 60;

/**
 * Fixed-window rate limit via Upstash. Returns remaining attempts and
 * whether the caller is allowed through this window.
 *
 * When Redis is unconfigured (local dev), the guard is a permissive no-op so
 * development never gets blocked — protection engages once Upstash is wired.
 */
export async function rateLimit(key: string, limit: number): Promise<{
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}> {
  if (!redisConfigured || !redis) {
    return { allowed: true, remaining: limit, retryAfter: 0 };
  }

  const fullKey = `wp:rl:${key}:${Math.floor(Date.now() / (WINDOW_SECONDS * 1000))}`;
  const count = await redis.incr(fullKey);
  if (count === 1) await redis.expire(fullKey, WINDOW_SECONDS);

  return {
    allowed: count <= limit,
    remaining: Math.max(limit - count, 0),
    retryAfter: WINDOW_SECONDS,
  };
}