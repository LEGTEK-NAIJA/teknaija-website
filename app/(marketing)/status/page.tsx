import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SystemRow, type SystemMetric } from "@/components/marketing/SystemRow";
import { IncidentLog, type Incident } from "@/components/marketing/IncidentLog";
import { UptimeLegend } from "@/components/marketing/UptimeLegend";

export const metadata: Metadata = {
  title: "Status",
  description: "Live operational status of the systems TEK NAIJA builds and runs. Updated every five minutes.",
  openGraph: {
    images: [
      {
        url: `https://teknaija.legtek.ng/api/og?title=${encodeURIComponent("Live infrastructure status.")}&eyebrow=${encodeURIComponent("STATUS")}&subtitle=${encodeURIComponent("Real-time visibility into every TEK NAIJA system in production.")}`,
        width: 1200,
        height: 630,
        alt: "TEK NAIJA — Live infrastructure status",
      },
    ],
  },
};

export const revalidate = 60;

type CheckRow = { system_id: string; status: string; checked_at: string };

const COMPOSITE_ORDER = ["operational", "degraded", "partial_outage", "major_outage", "maintenance"] as const;

function compositeStatus(systems: SystemMetric[]) {
  const live = systems.filter((s) => s.monitored && !s.in_development);
  let worst: (typeof COMPOSITE_ORDER)[number] = "operational";
  for (const s of live) {
    const current = s.current_status as (typeof COMPOSITE_ORDER)[number];
    if (COMPOSITE_ORDER.indexOf(current) > COMPOSITE_ORDER.indexOf(worst)) {
      worst = current;
    }
  }
  return worst;
}

function compositeMessage(status: string) {
  switch (status) {
    case "operational": return "All systems operational.";
    case "degraded": return "Some systems are responding more slowly than usual.";
    case "partial_outage": return "Partial outage on one or more systems.";
    case "major_outage": return "Major outage in progress. The team is responding.";
    default: return "Operational status is being computed.";
  }
}

function buildHistoryStrips(systems: SystemMetric[], checks: CheckRow[]): Map<string, string[]> {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const result = new Map<string, string[]>();
  for (const s of systems) {
    const daily: string[] = new Array(90).fill("unknown");
    const mine = checks.filter((c) => c.system_id === s.id);
    for (const c of mine) {
      const ageDays = Math.floor((now - new Date(c.checked_at).getTime()) / DAY_MS);
      if (ageDays < 0 || ageDays >= 90) continue;
      const slot = 89 - ageDays;
      const incoming = c.status;
      const existing = daily[slot];
      if (existing === "unknown" || COMPOSITE_ORDER.indexOf(incoming as never) > COMPOSITE_ORDER.indexOf(existing as never)) {
        daily[slot] = incoming;
      }
    }
    result.set(s.id, daily);
  }
  return result;
}

async function fetchStatusData() {
  const supabase = await createSupabaseServerClient();
  const [systemsRes, checksRes, incidentsRes] = await Promise.all([
    supabase.from("status_systems_with_metrics").select("id, slug, name, description, category, current_status, current_response_ms, last_checked_at, uptime_90d, avg_response_ms, monitored, in_development"),
    supabase.from("status_checks").select("system_id, status, checked_at").gte("checked_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()).order("checked_at", { ascending: false }).limit(10000),
    supabase.from("status_incidents").select("id, system_id, title, body, severity, started_at, resolved_at").eq("published", true).order("started_at", { ascending: false }).limit(10),
  ]);
  return {
    systems: (systemsRes.data as SystemMetric[] | null) ?? [],
    checks: (checksRes.data as CheckRow[] | null) ?? [],
    incidents: (incidentsRes.data as Incident[] | null) ?? [],
  };
}

export default async function StatusPage() {
  const { systems, checks, incidents } = await fetchStatusData();
  const composite = compositeStatus(systems);
  const history = buildHistoryStrips(systems, checks);

  return (
    <div className="bg-ink text-foreground">
      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 pt-20 lg:pt-28 pb-12">
        <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">System status</p>
        <h1 className="mt-6 font-serif font-optical-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.015em] text-foreground max-w-[18ch]">
          The work, in production.
        </h1>
        <p className="mt-6 max-w-[58ch] font-sans text-foreground-muted leading-[1.65]">
          We publish the operational status of the systems we run. Every five minutes a probe asks each one whether it is well. The answer goes here unedited.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <CompositeBanner status={composite} message={compositeMessage(composite)} />
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 py-16 lg:py-24">
        <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-foreground-muted mb-8">
          90-day history — most recent on the right
        </p>
        <div className="border-t border-border-subtle">
          {systems.length === 0 ? (
            <p className="py-12 font-mono text-sm text-foreground-muted">
              No systems registered. The page will populate once the pinger has run.
            </p>
          ) : (
            systems.map((s) => <SystemRow key={s.id} metric={s} history={history.get(s.id) ?? []} />)
          )}
        </div>
        <UptimeLegend />
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 pb-24 lg:pb-32">
        <IncidentLog incidents={incidents} />
      </section>
    </div>
  );
}

function CompositeBanner({ status, message }: { status: string; message: string }) {
  const tone =
    status === "operational"
      ? { ring: "ring-status-ok/40", dot: "bg-status-ok", text: "text-status-ok" }
      : status === "degraded"
        ? { ring: "ring-status-warn/50", dot: "bg-status-warn", text: "text-status-warn" }
        : { ring: "ring-status-down/60", dot: "bg-status-down", text: "text-status-down" };

  return (
    <div className={`flex items-center gap-5 rounded-none border-l-2 border-l-current ${tone.text} bg-surface-sunken/40 backdrop-blur-sm py-5 px-6 lg:px-8 ring-1 ring-inset ${tone.ring}`}>
      <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
        <span className={`absolute inset-0 rounded-full ${tone.dot} opacity-70 motion-safe:animate-ping`} aria-hidden />
        <span className={`relative inline-block h-2.5 w-2.5 rounded-full ${tone.dot}`} />
      </span>
      <p className="font-serif text-[1.4rem] sm:text-[1.6rem] leading-tight text-foreground">{message}</p>
    </div>
  );
}
