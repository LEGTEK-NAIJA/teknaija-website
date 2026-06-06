const LEGEND = [
  { label: "Operational", tone: "bg-status-ok/85" },
  { label: "Degraded", tone: "bg-status-warn/85" },
  { label: "Partial outage", tone: "bg-status-down/70" },
  { label: "Major outage", tone: "bg-status-down" },
  { label: "In development", tone: "bg-indigo/70" },
  { label: "No data", tone: "bg-foreground/10" },
] as const;

export function UptimeLegend() {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-foreground-muted">
      {LEGEND.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 ${l.tone}`} aria-hidden />
          {l.label}
        </span>
      ))}
    </div>
  );
}
