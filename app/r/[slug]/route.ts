import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSlug } from "@/lib/cache";
import { deviceFromUA, countryFromHeaders, referrerFromHeaders } from "@/lib/tracking";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REDIRECT_LIMIT_PER_SLUG_PER_MIN = 100;
const CREATE_LIMIT_PER_IP_PER_MIN = 20;

type Params = { slug: string };

/** GET /r/[slug] — the fast redirect. Logs sightings asynchronously. */
export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate-limit per slug and per IP to avoid abuse spikes.
  const [slugRL, ipRL] = await Promise.all([
    rateLimit(`sl:${slug}`, REDIRECT_LIMIT_PER_SLUG_PER_MIN),
    rateLimit(`ip:${ip}`, CREATE_LIMIT_PER_IP_PER_MIN),
  ]);

  if (!slugRL.allowed || !ipRL.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const hit = await resolveSlug(slug);
  if (!hit) {
    return new NextResponse(null, { status: 404 });
  }

  // Log the sighting after the response so the redirect returns immediately.
  after(() =>
    prisma.click
      .create({
        data: {
          link: { connect: { slug } },
          referrer: referrerFromHeaders(req.headers),
          device: deviceFromUA(req.headers.get("user-agent")),
          country: countryFromHeaders(req.headers),
        },
      })
      .catch((err) => console.error("[sighting log failed]", err))
  );

  return NextResponse.redirect(hit.longUrl, 302);
}