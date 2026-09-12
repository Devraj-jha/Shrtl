export type Range = 7 | 30 | 90;

/** Clamp a requested range into supported buckets. */
export function normalizeRange(value: string | null): Range {
  const n = Number(value);
  if (n === 7 || n === 30 || n === 90) return n;
  return 30;
}

/** Number of days ago for the range's window start. */
export function sinceDate(days: Range): Date {
  return new Date(Date.now() - days * 86400000);
}

/** Bucket [timestamp,...] into per-day counts keyed by ISO date (UTC-safe). */
export function bucketByDay(
  timestamps: Date[],
  days: Range
): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ts of timestamps) {
    const key = ts.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  // Fill all days in the window so the line chart has no gaps.
  const out: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return out;
}

/** Reduce a [label,count,topN] breakdown, folding minor rows into 'Other'. */
export function top(
  rows: { value: string | null; count: number }[],
  topN: number,
  fallback = "Other"
): { value: string; count: number }[] {
  const labelled = rows.map((r) => ({ value: r.value ?? fallback, count: r.count }));
  labelled.sort((a, b) => b.count - a.count);
  const head = labelled.slice(0, topN);
  const rest = labelled.slice(topN);
  const otherCount = rest.reduce((sum, r) => sum + r.count, 0);
  if (otherCount > 0) head.push({ value: "Other", count: otherCount });
  return head;
}