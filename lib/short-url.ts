const BASE = process.env.APP_URL ?? "http://localhost:3000";

export function shortUrl(slug: string) {
  return `${BASE}/r/${slug}`;
}

export type LinkStatus = "active" | "expiring" | "archived";

/** Link lifecycle status driving the waypoint marker colour. */
export function linkStatus(link: {
  archivedAt: Date | string | null;
  expiresAt: Date | string | null;
}): LinkStatus {
  if (link.archivedAt) return "archived";
  if (link.expiresAt) {
    const remaining = new Date(link.expiresAt).getTime() - Date.now();
    if (remaining < 7 * 86400000) return "expiring";
  }
  return "active";
}

export function resolveShortUrl(slug: string): URL {
  return new URL(`/r/${slug}`, BASE);
}