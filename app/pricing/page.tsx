import Link from "next/link";
import { WaypointMarker } from "@/components/waypoint-marker";

/**
 * Free / Pro comparison. Billing is intentionally deferred in this build; the
 * plans are presented so the tiers and limits are legible, and both CTAs route
 * to sign-in rather than to a payment flow that isn't wired up yet.
 */

function Mark() {
  return (
    <WaypointMarker
      className="h-6 w-6 text-brass"
      dotFill="var(--brass)"
      label="Waypoint mark"
    />
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-svh bg-paper text-text-primary">
      {/* masthead — same skin as the landing hero */}
      <header className="relative overflow-hidden bg-ink-deep text-paper">
        <div aria-hidden className="absolute inset-0 bg-contour-dark opacity-70" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Mark />
            <span className="font-display text-lg font-semibold tracking-wide">Waypoint</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-paper/70 no-underline transition hover:text-paper"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-paper px-3 py-1.5 text-sm font-medium text-ink-deep no-underline transition hover:bg-brass hover:text-ink-deep"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-contour-light opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="font-display text-sm italic text-brass">the charters</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-deep sm:text-4xl">
            Two courses. Pick your water.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-text-muted">
            Every waypoint charts sightings and hands you a short code. Upgrade
            to a Pro course for unlimited links, your own waypoint names, and a
            full CSV of the log.
          </p>

          {/* two-tier ledger, not a row of identical cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <section className="rounded-xl border border-brass/40 bg-paper px-6 py-8 sm:px-8">
              <h2 className="font-display text-2xl font-semibold text-ink-deep">Free</h2>
              <p className="mt-1 text-sm text-text-muted">For dipping a toe in the water.</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-ink-deep">$0</span>
                <span className="text-sm text-text-muted">forever</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <Row label="25 active waypoints" />
                <Row label="1,000 sightings a month" />
                <Row label="Random waypoint codes" />
                <Row label="Country, device and referrer breakdowns" />
              </ul>
              <Link
                href="/login"
                className="mt-8 block rounded-md border border-brass px-4 py-2.5 text-center text-sm font-semibold text-brass no-underline transition hover:bg-brass hover:text-ink-deep"
              >
                Chart the free course
              </Link>
            </section>

            {/* Pro — the fuller chart */}
            <section className="relative rounded-xl border border-brass bg-ink-deep px-6 py-8 text-paper sm:px-8">
              <span className="absolute -top-3 left-6 rounded-sm bg-coral px-2 py-0.5 font-mono text-xs text-paper">
                Pro
              </span>
              <h2 className="font-display text-2xl font-semibold">Pro</h2>
              <p className="mt-1 text-sm text-paper/70">For charters who sail a lot.</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold">$9</span>
                <span className="text-sm text-paper/70">per month</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <Row label="Unlimited active waypoints" />
                <Row label="Unlimited sightings" />
                <Row label="Your own waypoint names" />
                <Row label="Everything in Free, plus CSV export" />
              </ul>
              <Link
                href="/login"
                className="mt-8 block rounded-md bg-paper px-4 py-2.5 text-center text-sm font-semibold text-ink-deep no-underline transition hover:bg-brass hover:text-ink-deep"
              >
                Sail the Pro course
              </Link>
            </section>
          </div>

          <p className="mt-6 text-center font-mono text-xs text-text-muted">
            billing sets sail soon — for now both CTAs drop you at the chart
          </p>
        </div>
      </main>
    </div>
  );
}

function Row({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg viewBox="0 0 12 12" className="mt-0.5 h-3 w-3 shrink-0 text-coral" aria-hidden>
        <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill="currentColor" />
      </svg>
      <span>{label}</span>
    </li>
  );
}