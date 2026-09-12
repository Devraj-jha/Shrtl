"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Analytics = {
  id: string;
  days: number;
  summary: { total: number };
  series: { date: string; count: number }[];
  referrers: { value: string; count: number }[];
  countries: { value: string; count: number }[];
  devices: { value: string; count: number }[];
};

type Range = 7 | 30 | 90;
const RANGES: Range[] = [7, 30, 90];

export function RouteView({ linkId, canExport }: { linkId: string; canExport: boolean }) {
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/links/${linkId}/analytics?range=${range}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error?.message ?? "Couldn't read the route.");
        if (active) setData(body);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [linkId, range]);

  function exportCsv() {
    if (!data) return;
    const lines: string[] = [];
    lines.push("date,sightings");
    for (const row of data.series) lines.push(`${row.date},${row.count}`);
    lines.push("", "referrer,sightings");
    for (const row of data.referrers) lines.push(`${row.value},${row.count}`);
    lines.push("", "country,sightings");
    for (const row of data.countries) lines.push(`${row.value},${row.count}`);
    lines.push("", "device,sightings");
    for (const row of data.devices) lines.push(`${row.value},${row.count}`);

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waypoint-${linkId}-${range}d.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Range controls */}
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Report range" className="inline-flex rounded-md border border-grid-line bg-white/30 p-0.5">
          {RANGES.map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={range === d}
              onClick={() => setRange(d)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                range === d ? "bg-ink-deep text-paper" : "text-text-muted hover:text-ink-deep"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
        {canExport && (
          <button
            onClick={exportCsv}
            disabled={!data || loading}
            className="rounded-md border border-brass/50 px-3 py-1.5 text-xs font-semibold text-brass disabled:opacity-50"
          >
            Export CSV
          </button>
        )}
      </div>

      {loading && <p className="py-16 text-center text-sm text-text-muted">Reading the route…</p>}
      {!loading && error && (
        <p className="py-16 text-center text-sm text-coral" role="alert">
          {error}
        </p>
      )}
      {!loading && data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <Stat label="Sightings" value={data.summary.total.toLocaleString()} />
            <Stat label="Range" value={`last ${data.days} days`} />
            <Stat label="Top country" value={data.countries[0]?.value ?? "—"} />
            <Stat label="Top device" value={data.devices[0]?.value ?? "—"} />
          </div>

          <section className="mt-8">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
              Sightings over time
            </h2>
            <div className="h-64 rounded-lg border border-grid-line bg-white/30 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="routeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B08D57" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#B08D57" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#D9D2BE" strokeDasharray="3 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                    tickFormatter={(d: string) => d.slice(5)}
                    stroke="#8496B0"
                    interval="preserveStartEnd"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#8496B0" width={40} />
                  <Tooltip
                    contentStyle={{
                      background: "#14213D",
                      border: "none",
                      borderRadius: 8,
                      color: "#ECE6D6",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#B08D57"
                    strokeWidth={2}
                    fill="url(#routeFill)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#E76F51", stroke: "#FFFFFF" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Breakdown title="Routes in" rows={data.referrers} total={data.summary.total} />
            <Breakdown title="Countries" rows={data.countries} total={data.summary.total} />
            <Breakdown title="Devices" rows={data.devices} total={data.summary.total} />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-grid-line bg-white/30 px-4 py-3">
      <p className="text-[11px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 truncate text-xl font-display text-ink-deep">{value}</p>
    </div>
  );
}

function Breakdown({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { value: string; count: number }[];
  total: number;
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">{title}</h2>
      <ul className="space-y-2">
        {rows.map((r) => {
          const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
          return (
            <li key={r.value}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-ink-deep">{r.value}</span>
                <span className="shrink-0 font-mono text-xs text-text-muted">
                  {r.count} <span className="text-text-faint">· {pct}%</span>
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded bg-grid-faint">
                <div
                  className="h-full rounded bg-brass"
                  style={{ width: `${Math.round((r.count / max) * 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}