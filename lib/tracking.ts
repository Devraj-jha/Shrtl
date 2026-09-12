import { userAgentFromString } from "next/server";

type Device = "desktop" | "mobile" | "tablet" | "bot";

/** Coarse device classification using Next's UA parser (bot-aware). */
export function deviceFromUA(ua: string | null | undefined): Device {
  const { device, isBot } = userAgentFromString(ua ?? "");
  if (isBot) return "bot";
  if (device.type === "tablet") return "tablet";
  if (device.type === "mobile") return "mobile";
  return "desktop";
}

/**
 * Country from the request headers (Vercel or Cloudflare).
 * Delegates to the edge proxy — requires no geo-IP provider keys.
 */
export function countryFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    null
  );
}

export function referrerFromHeaders(headers: Headers): string | null {
  return headers.get("referer") || headers.get("referrer") || null;
}