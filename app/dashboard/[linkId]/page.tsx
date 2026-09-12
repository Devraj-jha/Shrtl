import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { planLimits } from "@/lib/plans";
import { shortUrl } from "@/lib/short-url";
import { RouteView } from "@/components/dashboard/route-view";
import { CopyButton } from "@/components/dashboard/copy-button";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { _count: { select: { clicks: true } } },
  });
  if (!link) notFound();
  if (link.userId !== user.id) redirect("/dashboard");

  const limits = planLimits(user.plan);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/dashboard" className="text-sm text-text-muted no-underline hover:text-ink-deep">
        ← Back to chart
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-deep">
            {link.title ?? link.slug}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href={shortUrl(link.slug)}
              className="font-mono text-sm text-brass no-underline hover:underline"
            >
              {shortUrl(link.slug)}
            </a>
            <CopyButton value={shortUrl(link.slug)} />
          </div>
          <p className="mt-2 max-w-md truncate text-xs text-text-muted">{link.longUrl}</p>
        </div>
        <p className="text-sm text-text-muted">
          <span className="font-mono font-semibold text-ink-deep">{link._count.clicks}</span> total
          sightings
        </p>
      </div>

      <div className="mt-8">
        <RouteView linkId={link.id} canExport={limits.csvExport} />
      </div>
    </main>
  );
}