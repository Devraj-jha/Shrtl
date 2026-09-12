import Link from "next/link";
import { CoursePanel } from "@/components/landing/course-panel";
import { WaypointMarker } from "@/components/waypoint-marker";

const STEPS = [
  {
    n: "01",
    title: "Drop your long URL here",
    body: "Paste the ungainly thing — the one bloated with UTM codes and page folders. It doesn’t need tidying; that’s our job.",
  },
  {
    n: "02",
    title: "We plot a waypoint",
    body: "Out comes a short, memorable code. Choose your own name on Pro, or let us drop a clean random one for you.",
  },
  {
    n: "03",
    title: "Sail every sighting",
    body: "Every click is logged on the chart — country, device and referrer — so you can watch your course and trim it.",
  },
];

const FEATURES = [
  {
    title: "Sightings charted, not guessed",
    body: "Each click is a sighting on your route. See the line over time, and break it down by country, device and where the traffic set sail from.",
  },
  {
    title: "Codes you can read aloud",
    body: "Random codes skip the lookalike characters — no 1/l/O/0 confusion. On Pro, name the waypoint yourself: wp.app/sail is far easier to share than a hash.",
  },
  {
    title: "Bearings that expire",
    body: "Set a course that runs out. Time-limited waypoints stop responding on the bell you choose — handy for promotions and ephemeral posts.",
  },
  {
    title: "The chart is the cockpit",
    body: "Plotted waypoints line the dashboard in route order. Archive the ones you’ve outgrown; the active course stays clear.",
  },
];

function Nav() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link
        href="/pricing"
        className="text-sm text-paper/70 no-underline transition hover:text-paper"
      >
        Pricing
      </Link>
      <Link
        href="/login"
        className="rounded-md border border-brass/50 px-3 py-1.5 text-sm font-medium text-brass no-underline transition hover:bg-brass hover:text-ink-deep"
      >
        Sign in
      </Link>
      <Link
        href="/login"
        className="rounded-md bg-paper px-3 py-1.5 text-sm font-medium text-ink-deep no-underline transition hover:bg-brass hover:text-ink-deep"
      >
        Chart a link
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-paper text-text-primary">
      {/* ---- Masthead ---- */}
      <header className="relative overflow-hidden bg-ink-deep text-paper">
        <div aria-hidden className="absolute inset-0 bg-contour-dark opacity-70" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <WaypointMarker
              className="h-6 w-6 text-brass"
              dotFill="var(--brass)"
              label="Waypoint mark"
            />
            <span className="font-display text-lg font-semibold tracking-wide">Waypoint</span>
          </div>
          <Nav />
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-ink-deep text-paper">
        <div aria-hidden className="absolute inset-0 bg-contour-dark opacity-70" />
        {/* a lone, drawn latitude ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border border-brass/20"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="font-display text-sm italic text-brass">
              a waypoint for every link you send into the world
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Chart a course to
              <span className="text-brass"> anywhere</span>. The link is short,
              the sightings are yours.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/75">
              Waypoint turns a long, forgettable URL into a clean code you can
              say out loud — then charts every click along the way. Country,
              device, referrer. All on one map.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-md bg-paper px-5 py-2.5 text-sm font-semibold text-ink-deep no-underline transition hover:bg-brass hover:text-ink-deep"
              >
                Chart your first link
              </Link>
              <Link
                href="/pricing"
                className="rounded-md border border-brass/60 px-5 py-2.5 text-sm font-semibold text-brass no-underline transition hover:bg-brass hover:text-ink-deep"
              >
                See the plans
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <CoursePanel />
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-contour-light opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-xl">
            <p className="font-display text-sm italic text-brass">the course</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-deep sm:text-4xl">
              Three lines of bearing, from paste to sail
            </h2>
          </div>

          <div className="mt-10 divide-y divide-brass/25 border-y border-brass/25">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="grid gap-2 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
              >
                <span className="font-mono text-sm text-coral">{step.n}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink-deep">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl leading-relaxed text-text-muted">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="relative overflow-hidden bg-ink-deep text-paper">
        <div aria-hidden className="absolute inset-0 bg-contour-dark opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-display text-sm italic text-brass">the instruments</p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Everything a point of sail needs
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="border-t border-brass/30 pt-6">
                <h3 className="font-display text-xl font-semibold text-brass">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-md leading-relaxed text-paper/75">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-6 rounded-xl border border-brass/30 bg-ink-mid/40 px-6 py-6 sm:px-8">
            <p className="max-w-md text-sm leading-relaxed text-paper/80">
              <span className="font-display text-base font-semibold text-paper">Free to plot,</span>{" "}
              and a Pro course for charters who need more. No password — a magic
              link lands in your inbox.
            </p>
            <Link
              href="/pricing"
              className="rounded-md bg-paper px-5 py-2.5 text-sm font-semibold text-ink-deep no-underline transition hover:bg-brass hover:text-ink-deep"
            >
              Compare the plans
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="relative overflow-hidden bg-ink-deep text-paper/60">
        <div aria-hidden className="absolute inset-0 bg-contour-dark opacity-60" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2">
            <WaypointMarker className="h-5 w-5 text-brass" dotFill="var(--brass)" label="Waypoint mark" />
            <span className="font-display text-base font-semibold tracking-wide text-paper">
              Waypoint
            </span>
          </div>
          <p className="font-mono text-xs">53°32′ N · a quieter route through every link</p>
          <p className="text-xs">charts drawn by hand, not by a template</p>
        </div>
      </footer>
    </div>
  );
}