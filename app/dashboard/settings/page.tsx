import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { planLimits } from "@/lib/plans";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const limits = planLimits(user.plan);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-deep">Your berth</h1>
      <p className="mt-1 text-sm text-text-muted">Where your account and course live.</p>

      <section className="mt-8 rounded-lg border border-grid-line bg-white/30 p-6">
        <h2 className="font-display text-lg font-semibold text-ink-deep">Account</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-text-muted">Email</dt>
            <dd className="mt-1 break-all font-mono text-ink-deep">{user.email}</dd>
          </div>
          {user.name && (
            <div>
              <dt className="text-xs text-text-muted">Name</dt>
              <dd className="mt-1 break-all text-ink-deep">{user.name}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-brass/40 bg-contour-light p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink-deep">Your course</h2>
          <span className="rounded-sm bg-ink-deep px-2 py-0.5 font-mono text-xs text-paper">
            {limits.name}
          </span>
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-text-primary sm:grid-cols-2">
          <li>Active waypoints — {limits.maxActiveLinks === Infinity ? "unlimited" : limits.maxActiveLinks}</li>
          <li>Sightings a month — {limits.maxClicksPerMonth === Infinity ? "unlimited" : limits.maxClicksPerMonth}</li>
          <li>Custom waypoint codes — {limits.customSlugs ? "yes" : "no"}</li>
          <li>CSV of the log — {limits.csvExport ? "yes" : "no"}</li>
        </ul>
        <p className="mt-4 font-mono text-xs text-text-muted">
          billing sets sail soon — your course is plotted and ready
        </p>
      </section>
    </main>
  );
}