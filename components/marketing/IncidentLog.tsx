export type Incident = {
  id: string;
  system_id: string | null;
  title: string;
  body: string | null;
  severity: "investigating" | "identified" | "monitoring" | "resolved";
  started_at: string;
  resolved_at: string | null;
};

const SEVERITY_LABEL: Record<Incident["severity"], string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

const SEVERITY_TONE: Record<Incident["severity"], string> = {
  investigating: "text-terracotta",
  identified: "text-ochre",
  monitoring: "text-ochre",
  resolved: "text-moss",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDuration(start: string, end: string | null) {
  const startMs = new Date(start).getTime();
  const endMs = end ? new Date(end).getTime() : Date.now();
  const mins = Math.floor((endMs - startMs) / 60_000);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hours}h ${rem}m` : `${hours}h`;
}

export function IncidentLog({ incidents }: { incidents: Incident[] }) {
  return (
    <section aria-labelledby="incidents-heading">
      <header className="grid grid-cols-12 gap-x-6 mb-8">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Incident log
        </p>
        <div className="col-span-12 lg:col-span-9 mt-2 lg:mt-0">
          <h2 id="incidents-heading" className="font-serif font-optical-display text-[clamp(1.75rem,3.6vw,2.8rem)] leading-[1.05] tracking-[-0.01em] text-foreground">
            What broke, when, and what we did.
          </h2>
        </div>
      </header>

      <div className="border-t border-border-subtle">
        {incidents.length === 0 ? (
          <p className="py-12 font-mono text-sm text-foreground-muted">
            No incidents in the recorded period. The page will list them here when they occur.
          </p>
        ) : (
          <ol>
            {incidents.map((inc) => (
              <li key={inc.id} className="grid grid-cols-12 gap-x-6 gap-y-3 border-b border-border-subtle py-8">
                <time dateTime={inc.started_at} className="col-span-12 md:col-span-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
                  {formatDate(inc.started_at)}
                </time>
                <div className="col-span-12 md:col-span-7">
                  <p className={`font-mono text-[0.68rem] tracking-[0.2em] uppercase ${SEVERITY_TONE[inc.severity]}`}>
                    {SEVERITY_LABEL[inc.severity]}
                  </p>
                  <h3 className="mt-2 font-serif text-[1.25rem] leading-[1.2] text-foreground">{inc.title}</h3>
                  {inc.body && (
                    <p className="mt-3 font-sans text-sm leading-relaxed text-foreground-muted max-w-[60ch]">{inc.body}</p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right font-mono text-[0.7rem] tracking-[0.15em] uppercase text-foreground-muted">
                  <p>
                    <span className="text-foreground/40">duration</span>{" "}
                    <span className="text-foreground">{formatDuration(inc.started_at, inc.resolved_at)}</span>
                  </p>
                  {inc.resolved_at && (
                    <p className="mt-1">
                      <span className="text-foreground/40">resolved</span>{" "}
                      <span className="text-foreground">{formatDate(inc.resolved_at)}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
