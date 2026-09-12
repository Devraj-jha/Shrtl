"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Copies the short URL to the clipboard and confirms with transient feedback. */
export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for restricted iframes / old browsers.
      const el = document.createElement("textarea");
      el.value = value;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        "rounded-md border border-brass/40 px-2.5 py-1 font-mono text-xs no-underline transition",
        copied
          ? "bg-brass text-ink-deep"
          : "text-brass hover:bg-brass/15",
        className
      )}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}