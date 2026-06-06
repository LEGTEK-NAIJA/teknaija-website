export type SystemMetric = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  current_status: string;
  current_response_ms: number | null;
  last_checked_at: string | null;
  uptime_90d: number | null;
  avg_response_ms: number | null;
  monitored: boolean;
  in_development: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  operational: "Operational",
  degraded: "Degraded",
  partial_outage: "Partial outage",
  major_outage: "Major outage",
  maintenance: "In development",
};

const STATUS_TONE: Record<string, string> = {
  operational: "text-status-ok",
  degraded: "text-status-warn",
  partial_outage: "text-status-down",
  major_outage: "text-status-down",
  maintenance: "text-ivory/60",
};

const CATEGORY_LABEL: Record<string, string> = {
  flagship: "Flagship",
  portfolio: "Portfolio",
  infrastructure: "Infrastructure",
  internal: "Internal",
};

function formatUptime(ratio: number | null, monitored: boolean) {
  if (!monitored) return "—";
  if (ratio === null || ratio === undefined) return "—";
  return `${(ratio * 100).toFixed(2)}%`;
}

function formatLastChecked(iso: string | null) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function SystemRow({
  metric,
  history,
}: {
  metric: SystemMetric;
  history: string[];
}) {
  const tone = STATUS_TONE[metric.current_status] ?? "text-ivory/60";
  const label = STATUS_LABEL[metric.current_status] ?? metric.current_status;
  const category = CATEGORY_LABEL[metric.category] ?? metric.category;

  return (
    <article
      id={metric.slug}
      className="grid grid-cols-12 gap-x-6 gap-y-5 border-b border-border-subtle py-8 lg:py-10 scroll-mt-24"
    >
      <div className="col-span-12 lg:col-span-4">
        <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-foreground-muted mb-2">
          {category} · {metric.slug}
        </p>
        <h2 className="font-serif text-[1.4rem] sm:text-[1.55rem] leading-[1.15] text-foreground">
          {metric.name}
        </h2>
        {metric.description && (
          <p className="mt-2 font-sans text-sm leading-relaxed text-foreground-muted max-w-[44ch]">
            {metric.description}
          </p>
        )}
      </div>

      <div className="col-span-12 lg:col-span-5">
        {metric.in_development ? (
          <div className="flex h-9 items-center justify-center border border-dashed border-border-subtle">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted">
              Not yet in production — monitoring begins at launch
            </span>
          </div>
        ) : (
          <HistoryStrip days={history} />
        )}
        {!metric.in_development && (
          <p className="mt-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-foreground-muted flex items-center justify-between">
            <span>90 days ago</span>
            <span>today</span>
          </p>
        )}
      </div>

      <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
        <p className={`font-mono text-[0.75rem] tracking-[0.18em] uppercase ${tone}`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-2 align-middle" />
          {label}
        </p>
        <dl className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-foreground-muted space-y-1">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-foreground/40">uptime 90d</dt>
            <dd className="text-foreground">{formatUptime(metric.uptime_90d, metric.monitored)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-foreground/40">avg response</dt>
            <dd className="text-foreground">{metric.avg_response_ms ? `${metric.avg_response_ms}ms` : "—"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-foreground/40">last checked</dt>
            <dd className="text-foreground">{metric.monitored ? formatLastChecked(metric.last_checked_at) : "—"}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function HistoryStrip({ days }: { days: string[] }) {
  const padded = days.length >= 90 ? days : [...new Array(90 - days.length).fill("unknown"), ...days];
  return (
    <div className="flex h-9 items-stretch gap-[2px]" role="img" aria-label="90 day status history">
      {padded.map((status, i) => (
        <span key={i} title={status === "unknown" ? "no data" : status} className={`flex-1 transition-opacity ${cellTone(status)}`} />
      ))}
    </div>
  );
}

function cellTone(status: string) {
  switch (status) {
    case "operational": return "bg-status-ok/85 hover:bg-status-ok";
    case "degraded": return "bg-status-warn/85 hover:bg-status-warn";
    case "partial_outage": return "bg-status-down/70 hover:bg-status-down";
    case "major_outage": return "bg-status-down hover:bg-status-down";
    case "maintenance": return "bg-indigo/70 hover:bg-indigo";
    default: return "bg-foreground/8 hover:bg-foreground/15";
  }
}
