import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Brand base palette (Section 3)
      ink: {
        deep: "#14213D", // primary background (dark surfaces)
        mid: "#1D3557", // secondary surface
      },
      paper: "#ECE6D6", // aged chart paper — light surfaces / card fills
      brass: "#B08D57", // primary accent — ink, borders, active states
      coral: "#E76F51", // waypoint markers, alerts, "you are here"
      "depth-line": "rgba(236, 230, 214, 0.12)", // contour/grid line on dark
      // Chart/text ink used on light surfaces
      text: {
        primary: "#1D3557",
        muted: "#5A6E8C",
        faint: "#8496B0",
      },
      // Semantic utility aliases mapped to the palette
      grid: {
        line: "#D9D2BE", // contour line on paper
        faint: "#E5DFCD",
      },
    },
    fontFamily: {
      // high-contrast engraving serif for display
      display: ["var(--font-display)", "Georgia", "serif"],
      // plain high-legibility sans for body
      sans: [
        "var(--font-sans)",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      // monospace ONLY for codes / timestamps / coordinates
      mono: [
        "var(--font-mono)",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace",
      ],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.375rem" }],
      base: ["1rem", { lineHeight: "1.6rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.375rem", { lineHeight: "1.9rem" }],
      "2xl": ["1.75rem", { lineHeight: "2.25rem" }],
      "3xl": ["2.25rem", { lineHeight: "2.75rem" }],
      "4xl": ["3rem", { lineHeight: "3.4rem" }],
      "5xl": ["4rem", { lineHeight: "1.05" }],
      "6xl": ["5.25rem", { lineHeight: "1.02" }],
    },
    extend: {
      letterSpacing: {
        wide: "0.02em",
      },
      maxWidth: {
        content: "72ch", // body copy line length < 80 chars
      },
      boxShadow: {
        // subtle, ink-tinted — not a generic soft grey
        card: "0 1px 0 rgba(20,33,61,0.06), 0 10px 30px -12px rgba(20,33,61,0.25)",
        lift: "0 2px 0 rgba(20,33,61,0.08), 0 20px 44px -16px rgba(20,33,61,0.35)",
      },
      backgroundImage: {
        // faint contour / graticule texture for dark surfaces
        "contour-dark":
          "repeating-linear-gradient(0deg, rgba(236,230,214,0.04) 0 1px, transparent 1px 40px)",
        "contour-light":
          "repeating-linear-gradient(0deg, rgba(29,53,87,0.05) 0 1px, transparent 1px 40px)",
      },
      transitionTimingFunction: {
        chart: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        draw: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;