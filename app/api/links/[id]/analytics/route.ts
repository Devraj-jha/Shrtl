import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { apiError, ApiError, safeHandler } from "@/lib/api";
import { normalizeRange, sinceDate, bucketByDay, top } from "@/lib/analytics";

export const runtime = "nodejs";

/** GET /api/links/[id]/analytics — sighting timeseries + breakdowns. */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return safeHandler(async () => {
    const user = await getCurrentUser();
    if (!user) return apiError(401, "UNAUTHORIZED", "Sign in to read the route.");

    const { id } = await params;
    const url = new URL(req.url);
    const days = normalizeRange(url.searchParams.get("range"));

    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) throw new ApiError(404, "NOT_FOUND", "That waypoint doesn't exist.");
    if (link.userId !== user.id) {
      throw new ApiError(403, "FORBIDDEN", "That route isn't yours to read.");
    }

    const since = sinceDate(days);
    const where = { linkId: id, timestamp: { gte: since } };

    // Timeseries + summary.
    const recent = await prisma.click.findMany({
      where,
      select: { timestamp: true },
    });
    const series = bucketByDay(recent.map((c) => c.timestamp), days);

    // Breakdowns over the same window.
    const [referrers, countries, devices] = await Promise.all([
      prisma.click.groupBy({
        by: ["referrer"],
        where,
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
      }),
      prisma.click.groupBy({
        by: ["country"],
        where,
        _count: true,
        orderBy: { _count: { country: "desc" } },
      }),
      prisma.click.groupBy({
        by: ["device"],
        where,
        _count: true,
        orderBy: { _count: { device: "desc" } },
      }),
    ]);

    const total = recent.length;

    return NextResponse.json({
      id,
      days,
      summary: { total },
      series,
      referrers: top(
        referrers.map((r) => ({ value: r.referrer, count: r._count })),
        8,
        "Direct"
      ),
      countries: top(
        countries.map((c) => ({ value: c.country, count: c._count })),
        8,
        "Unknown"
      ),
      devices: top(
        devices.map((d) => ({ value: d.device, count: d._count })),
        8,
        "Unknown"
      ),
    });
  });
}