import { CourseAnim } from "@/components/landing/course-anim";

const MESSY_URL =
  "https://app.example.com/campaigns/summer-2026/landing?utm_source=newsletter&utm_medium=email&utm_campaign=summer";

/**
 * The hero's chart panel. This is where a long, ungainly URL gets plotted into
 * a short, clean waypoint code — the one signature interaction of the site.
 */
export function CoursePanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-brass/40 bg-contour-light text-ink-deep shadow-card">
      {/* graduation marks along the top edge, like a scale bar */}
      <div
        aria-hidden
        className="absolute right-6 top-3 flex items-baseline gap-1 font-mono text-[10px] text-brass/70"
      >
        <span>60°</span>
        <span className="mx-2 h-px w-16 bg-brass/50" />
        <span>120°</span>
        <span className="mx-2 h-px w-16 bg-brass/50" />
        <span>180°</span>
      </div>

      <div className="px-5 pt-10 sm:px-8 sm:pt-12">
        <CourseAnim />
      </div>

      {/* the before / after labels framing the course */}
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pb-5 sm:px-8 sm:pb-6">
        <p className="max-w-[16rem] truncate pt-2 font-mono text-[11px] text-ink-deep/55">
          {MESSY_URL}
        </p>
        <p className="font-mono text-sm text-brass">
          <span className="text-ink-deep/50">in →</span> wp.app/<span className="font-semibold">sail7</span>
        </p>
      </div>
    </div>
  );
}