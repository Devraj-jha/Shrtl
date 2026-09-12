import { prisma } from "@/lib/prisma";
import { redis, redisConfigured } from "@/lib/redis";

export const SLUG_CACHE_TTL = 60; // seconds

type SlugLookup = { longUrl: string } | null;

/**
 * Resolve a slug → destination URL, Redis-cached. Falls back to a direct DB
 * read when Redis is configured but misses, or entirely when Redis is
 * unconfigured (local dev). Never throws on cache issues.
 */
export async function resolveSlug(slug: string): Promise<SlugLookup> {
  const key = `wp:slug:${slug}`;

  if (redisConfigured && redis) {
    try {
      const cached = await redis.get<SlugLookup>(key);
      if (cached) return cached;
    } catch {
      // cache read failed — fall through to the database
    }
  }

  const link = await prisma.link.findUnique({
    where: { slug },
    select: { longUrl: true, archivedAt: true, expiresAt: true },
  });
  if (!link || link.archivedAt) {
    // Negative-cache a miss briefly so hot 404s don't hammer the DB.
    if (redisConfigured && redis) await redis.setex(key, 15, null);
    return null;
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    if (redisConfigured && redis) await redis.setex(key, 15, null);
    return null;
  }

  const result: SlugLookup = { longUrl: link.longUrl };
  if (redisConfigured && redis) await redis.setex(key, SLUG_CACHE_TTL, result);
  return result;
}

/** Deletes a slug from cache after it changes or is deleted. */
export function invalidateSlug(slug: string) {
  if (redisConfigured && redis) return redis.del(`wp:slug:${slug}`);
}