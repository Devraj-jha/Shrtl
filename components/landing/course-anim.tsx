"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  type MotionStyle,
} from "framer-motion";

/** Concentric rings + dot that ride the plotted course in SVG user units. */
const dotStyle = (tx: ReturnType<typeof useMotionValue<number>>, ty: ReturnType<typeof useMotionValue<number>>) =>
  ({ cx: tx, cy: ty }) as MotionStyle;

/**
 * The one signature interaction on the landing hero: a course is plotted on a
 * chart from a long, ungainly URL (left) to a short, clean waypoint code
 * (right). A coral sighting mark travels the dashed route on a loop, and the
 * course draws itself in on mount. Off "reduce motion" this is a static,
 * fully-drawn route with the mark resting at the destination.
 */
const COURSE =
  "M 24 168 C 190 168 190 62 366 62 C 470 62 540 84 596 38";

export function CourseAnim() {
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();
  const progress = useRef(0.12);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    const p = pathRef.current;
    if (!p || reduceMotion) return;
    const len = p.getTotalLength();
    progress.current = (progress.current + delta / 2600) % 1;
    const pt = p.getPointAtLength(progress.current * len);
    tx.set(pt.x);
    ty.set(pt.y);
  });

  return (
    <svg
      viewBox="0 0 640 200"
      className="h-auto w-full"
      role="img"
      aria-label="A route is plotted on a navigation chart from a long URL into a short waypoint code"
    >
      <defs>
        <pattern id="grid-fine" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity="0.07" />
        </pattern>
      </defs>

      {/* graticule */}
      <rect x="0.5" y="0.5" width="639" height="199" fill="url(#grid-fine)" stroke="none" />

      {/* faint laid-in course path */}
      <path
        d={COURSE}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeDasharray="1.5 9"
        strokeLinecap="round"
      />

      {/* the route drawing itself in */}
      <motion.path
        d={COURSE}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 14"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.15 }}
      />

      {/* hidden geometry the travelling mark follows */}
      <path ref={pathRef} d={COURSE} fill="none" stroke="transparent" />

      {/* travelling coral sighting mark */}
      <motion.circle r="4.5" fill="currentColor" style={dotStyle(tx, ty)} />
      <motion.circle r="9" fill="none" stroke="currentColor" strokeOpacity="0.45" style={dotStyle(tx, ty)} />
      <motion.circle r="14" fill="none" stroke="currentColor" strokeOpacity="0.18" style={dotStyle(tx, ty)} />

      {/* destination waypoint: a brass compass rose */}
      <g transform="translate(596,38)" fill="none" stroke="currentColor">
        <circle r="13" strokeOpacity="0.35" />
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9, duration: 0.5, type: "spring", stiffness: 220, damping: 15 }}
        >
          <circle r="13" strokeOpacity="0.2" />
          <path d="M0 -9 L3.2 0 L0 9 L-3.2 0 Z" fill="currentColor" stroke="none" />
        </motion.g>
      </g>
    </svg>
  );
}