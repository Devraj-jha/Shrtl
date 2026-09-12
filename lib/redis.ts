import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/** True only when Upstash REST credentials are configured. */
export const redisConfigured = Boolean(url && token);

/**
 * Upstash Redis client (REST). Null in local dev so callers can degrade
 * gracefully to the database — the redirect never throws a hard error just
 * because Redis isn't wired yet.
 */
export const redis: Redis | null = redisConfigured ? new Redis({ url: url!, token: token! }) : null;