import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { apiError, safeHandler } from "@/lib/api";
import { createLinkSchema } from "@/lib/validations/links";
import { planLimits } from "@/lib/plans";
import { generateSlug } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const CREATE_LIMIT_PER_USER_PER_MIN = 20;

async function activeLinkCount(userId: string) {
  return prisma.link.count({
    where: {
      userId,
      archivedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
}

/** POST /api/links — create a waypoint (enforces plan limits). */
export async function POST(req: Request) {
  return safeHandler(async () => {
    const user = await getCurrentUser();
    if (!user) return apiError(401, "UNAUTHORIZED", "Sign in to plot a waypoint.");

    const rl = await rateLimit(`create:${user.id}`, CREATE_LIMIT_PER_USER_PER_MIN);
    if (!rl.allowed) {
      return apiError(429, "RATE_LIMIT", "You're plotting too fast. Wait a moment and try again.");
    }

    const body = await req.json().catch(() => ({}));
    const parsed = createLinkSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(422, "VALIDATION", parsed.error.issues[0]?.message ?? "Invalid input.");
    }
    const { longUrl, title } = parsed.data;
    const requestedSlug = parsed.data.slug?.trim() || undefined;

    const limits = planLimits(user.plan);

    // Free plan: custom slugs are a Pro feature.
    if (requestedSlug && !limits.customSlugs) {
      return apiError(
        403,
        "PLAN_LIMIT",
        "Custom slugs are a Pro feature. Upgrade to choose your own waypoint name."
      );
    }

    // Free plan: cap active waypoints.
    if (!Number.isFinite(limits.maxActiveLinks)) {
      const active = await activeLinkCount(user.id);
      if (active >= limits.maxActiveLinks) {
        return apiError(
          429,
          "PLAN_LIMIT",
          `You've hit the Free limit of ${limits.maxActiveLinks} active waypoints. Archive one or upgrade to Pro.`
        );
      }
    }

    // Resolve the final slug: requested (Pro) or a fresh random one.
    let slug = requestedSlug ?? generateSlug();
    if (requestedSlug) {
      const taken = await prisma.link.findUnique({ where: { slug } });
      if (taken) return apiError(409, "SLUG_TAKEN", "That waypoint name is already in use.");
    } else {
      // Retry a few times if a random slug collides.
      let attempts = 0;
      while ((await prisma.link.findUnique({ where: { slug } })) && attempts < 3) {
        slug = generateSlug();
        attempts += 1;
      }
    }

    const link = await prisma.link.create({
      data: {
        slug,
        longUrl,
        title: title || undefined,
        userId: user.id,
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  });
}

/** GET /api/links — list the current user's waypoints with live click counts. */
export async function GET() {
  return safeHandler(async () => {
    const user = await getCurrentUser();
    if (!user) return apiError(401, "UNAUTHORIZED", "Sign in to view your chart.");

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      orderBy: [{ archivedAt: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        longUrl: true,
        title: true,
        createdAt: true,
        expiresAt: true,
        archivedAt: true,
        _count: { select: { clicks: true } },
      },
    });

    return NextResponse.json({
      links: links.map(({ _count, ...l }) => ({ ...l, clicks: _count.clicks })),
    });
  });
}