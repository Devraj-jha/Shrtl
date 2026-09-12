"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { shortUrl } from "@/lib/short-url";
import { WaypointMarker } from "@/components/waypoint-marker";
import { CopyButton } from "@/components/dashboard/copy-button";

export function CreateWaypoint({
  customSlugs,
}: {
  customSlugs: boolean;
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ slug: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreated(null);
    setBusy(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl: url,
          slug: customSlugs && slug ? slug : undefined,
          title: title || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error?.message ?? "Couldn't plot that waypoint.");
        return;
      }
      setCreated({ slug: data.link.slug });
      setUrl("");
      setSlug("");
      setTitle("");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-text-muted" htmlFor="wp-url">
            Long URL
          </label>
          <input
            id="wp-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://a-very-long-address-that-is-hard-to-share.example.com/some/path"
            required
            className="mt-1.5 w-full rounded-md border border-grid-line bg-white/40 px-3 py-2.5 text-sm text-ink-deep placeholder:text-text-faint focus:border-coral focus:outline-none"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-text-muted" htmlFor="wp-slug">
            Waypoint name
            {!customSlugs && (
              <span className="normal-case tracking-normal text-text-faint">(Pro)</span>
            )}
          </label>
          <input
            id="wp-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!customSlugs}
            placeholder={customSlugs ? "my-links" : "random for Free"}
            className="mt-1.5 w-full rounded-md border border-grid-line bg-white/40 px-3 py-2.5 font-mono text-sm text-ink-deep placeholder:text-text-faint focus:border-coral focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-44"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-widest text-text-muted" htmlFor="wp-title">
          Title <span className="normal-case tracking-normal text-text-faint">(optional)</span>
        </label>
        <input
          id="wp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What leads here?"
          className="mt-1.5 w-full max-w-md rounded-md border border-grid-line bg-white/40 px-3 py-2.5 text-sm text-ink-deep placeholder:text-text-faint focus:border-coral focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      )}

      {created ? (
        <div className="flex items-center gap-3 rounded-md border border-brass/40 bg-brass/10 px-3 py-2.5">
          <WaypointMarker className="h-4 w-4 text-brass" dotFill="var(--brass)" label="new waypoint" />
          <span className="font-mono text-sm text-ink-deep">{shortUrl(created.slug)}</span>
          <CopyButton value={shortUrl(created.slug)} />
        </div>
      ) : (
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-ink-deep px-4 py-2.5 text-sm font-semibold text-paper no-underline transition hover:bg-brass hover:text-ink-deep disabled:opacity-50"
        >
          {busy ? "Plotting…" : "Create waypoint"}
        </button>
      )}
    </form>
  );
}