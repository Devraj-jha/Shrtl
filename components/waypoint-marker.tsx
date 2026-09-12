import { cn } from "@/lib/utils";

/**
 * The waypoint marker: a custom plotted-course mark (compass-rose pin with a
 * centre dot), not a map-pin emoji. Used both as status indicator and as a
 * decorative "you are here" element.
 */
export function WaypointMarker({
  className,
  dotFill = "currentColor",
  label,
}: {
  className?: string;
  dotFill?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      role="img"
      aria-label={label ?? "waypoint marker"}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* radiating compass ticks */}
        <path d="M12 2v3" strokeWidth="1.6" />
        <path d="M12 19v3" strokeWidth="1.6" />
        <path d="M2 12h3" strokeWidth="1.6" />
        <path d="M19 12h3" strokeWidth="1.6" />
        <path d="M5 5l2.1 2.1" strokeWidth="1.2" />
        <path d="M16.9 16.9l2.1 2.1" strokeWidth="1.2" />
        <path d="M19 5l-2.1 2.1" strokeWidth="1.2" />
        <path d="M7.1 16.9L5 19" strokeWidth="1.2" />
      </g>
      {/* the anchor dot */}
      <circle cx="12" cy="12" r="2.6" fill={dotFill} stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}