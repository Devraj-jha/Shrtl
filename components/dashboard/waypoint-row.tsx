"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WaypointMarker } from "@/components/waypoint-marker";
import { CopyButton } from "@/components/dashboard/copy-button";
import { shortUrl, linkStatus, type LinkStatus } from "@/lib/short-url";
import { cn } from "@/lib/utils";

export type WaypointLink = {
  id: string;
  slug: string;
  longUrl: string;
  title: string | null;
  clicks: number;
  createdAt: Date | string;
  expiresAt: Date | string | null;
  archivedAt: Date | string | null;
};

const STATUS_COLOR: Record<LinkStatus, string> = {
  active: "text-brass",
  expiring: "text-coral",
  archived: "text-text-faint",
};

const STATUS_LABEL: Record<LinkStatus, string> = {
  active: "Active",
  expiring: "Expiring",
  archived: "Archived",
};

function markerDot(status: LinkStatus) {
  return status === "active" ? "var(--brass)"
    : status === "expiring" ? "var(--coral)"
    : "var(--brass)";
}

export function WaypointRow({ link }: { link: WaypointLink }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const status = linkStatus(link);
  const short = shortUrl(link.slug);

  async function act(path: string, init: RequestInit) {
    setBusy(true);
    try {
      await fetch(path, init);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function archive() {
    act(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive: !link.archivedAt }),
    });
  }

  function remove() {
    if (!window.confirm(`Delete ${link.slug}? This removes its sighting history too.`)) return;
    act(`/api/links/${link.id}`, { method: "DELETE" });
  }

  return (
    <li className="group relative border-b border-grid-line/70 py-4">
      {/* connector line to the grid */}
      <span
        aria-hidden
        className="absolute right-full top-1/2 hidden h-px w-5 -translate-y-1/2 bg-grid-line lg:block"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <WaypointMarker
          className={cn("h-4 w-4 shrink-0", STATUS_COLOR[status])}
          dotFill={markerDot(status)}
          label={`${STATUS_LABEL[status]} waypoint`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link
              href={`/dashboard/${link.id}`}
              className="font-mono text-sm font-medium text-ink-deep no-underline hover:text-brass"
            >
              {link.slug}
            </Link>
            {link.title && (
              <span className="font-display text-base text-text-primary">{link.title}</span>
            )}
            <span
              className={cn(
                "hidden text-[11px] uppercase tracking-widest sm:inline",
                STATUS_COLOR[status]
              )}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-text-muted">{link.longUrl}</p>
        </div>

        <div className="flex items-center gap-2 sm:w-auto">
          <CopyButton value={short} />
          <button
            type="button"
            onClick={archive}
            disabled={busy}
            className="rounded-md px-2 py-1 text-xs text-text-muted no-underline hover:bg-brass/20"
          >
            {link.archivedAt ? "Restore" : "Archive"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded-md px-2 py-1 text-xs text-coral hover:bg-coral/10"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 sm:pl-7">
        <a
          href={short}
          className="truncate font-mono text-xs text-brass no-underline hover:underline"
        >
          {short.replace(/^https?:\/\//, "")}
        </a>
        <span className="shrink-0 text-xs text-text-muted" title={`${link.clicks} sightings`}>
          <span className="font-mono font-medium text-ink-deep">{link.clicks}</span> sightings
        </span>
      </div>
    </li>
  );
}