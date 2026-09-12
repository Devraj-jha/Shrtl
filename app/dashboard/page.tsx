import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { planLimits } from "@/lib/plans";
import { WaypointMarker } from "@/components/waypoint-marker";
import { WaypointRow } from "@/components/dashboard/waypoint-row";
import { CreateWaypoint } from "@/components/dashboard/create-waypoint";

async function getChart(userId: string) {
  return prisma.link.findMany({
    where: { userId },
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
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const links = await getChart(user.id);
  const limits = planLimits(user.plan);

  const serialized = links.map(({ _count, ...l }) => ({ ...l, clicks: _count.clicks }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-deep">Your chart</h1>
          <p className="mt-1 text-sm text-text-muted">
            {serialized.length} waypoint{serialized.length === 1 ? "" : "s"} plotted ·{" "}
            {limits.customSlugs ? "Pro" : `Free · ${limits.maxActiveLinks} active max`}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-grid-line bg-white/30 p-4 sm:p-6">
        <h2 className="mb-1 text-xs font-medium uppercase tracking-widest text-text-muted">
          Plot a new waypoint
        </h2>
        <CreateWaypoint customSlugs={limits.customSlugs} />
      </section>

      <section className="relative mt-8">
        {/* graticule / contour backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-contour-light" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-5 border-l border-brass/30 sm:block"
        />

        {serialized.length === 0 ? (
          <div className="relative rounded-lg border border-dashed border-brass/50 px-6 py-16 text-center">
            <WaypointMarker
              className="mx-auto mb-4 h-8 w-8 text-text-faint"
              dotFill="var(--brass)"
              label="no waypoints yet"
            />
            <p className="font-display text-2xl text-ink-deep">Your chart is clear sailing</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Paste a long URL above to plot your first waypoint — you&apos;ll get a short link you
              can share anywhere, with sightings tracked from the moment it&apos;s nudged.
            </p>
            <Link
              href="#wp-url"
              className="mt-5 inline-block rounded-md bg-ink-deep px-4 py-2.5 text-sm font-semibold text-paper no-underline hover:bg-brass hover:text-ink-deep"
            >
              Plot your first waypoint
            </Link>
          </div>
        ) : (
          <ol className="relative border-l border-brass/30 pl-5 sm:pl-6">
            {serialized.map((link) => (
              <WaypointRow key={link.id} link={link} />
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}