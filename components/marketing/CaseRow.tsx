import Link from "next/link";

export type CaseSector =
  | "JUSTICE INFRASTRUCTURE"
  | "TRADE & COMMERCE"
  | "LEGAL INTELLIGENCE";

export type CaseVariant = "justice" | "commerce" | "forthcoming";

export type CaseRowProps = {
  index: number;
  sector: CaseSector;
  title: string;
  scriptSubtitle?: string;
  status: "Live" | "Forthcoming" | "Active";
  href: string;
  body: string;
  variant: CaseVariant;
  reverse?: boolean;
  meta?: { label: string; value: string }[];
};

/**
 * CaseRow — a single editorial spread on the homepage's Selected Work.
 * Image left 60%, metadata right 40%. Reverses on alternating rows so the
 * page reads with rhythm rather than as a stack.
 *
 * NOTE: Image area uses a stylised SVG placeholder until production
 * screenshots are supplied (CLAUDE.md §7).
 */
export function CaseRow({
  index,
  sector,
  title,
  scriptSubtitle,
  status,
  href,
  body,
  variant,
  reverse = false,
  meta,
}: CaseRowProps) {
  const projectLabel = `PROJECT ${String(index).padStart(2, "0")} — ${sector}`;

  return (
    <article
      className={`
        grid grid-cols-1 gap-10 lg:gap-16 items-center
        lg:grid-cols-12
      `}
    >
      <div
        className={`
          relative lg:col-span-7
          ${reverse ? "lg:order-2" : "lg:order-1"}
        `}
      >
        <CaseImage variant={variant} title={title} status={status} />
      </div>

      <div
        className={`
          lg:col-span-5 flex flex-col gap-6
          ${reverse ? "lg:order-1 lg:pr-6" : "lg:order-2 lg:pl-6"}
        `}
      >
        <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ochre">
          {projectLabel}
        </p>

        <h3 className="font-serif font-optical-display leading-[0.95]">
          <span className="block text-[clamp(2.4rem,5vw,4rem)] text-foreground">
            {title}
          </span>
          {scriptSubtitle && (
            <span className="accent-script mt-3 block text-foreground-muted text-[1.25rem]">
              {scriptSubtitle}
            </span>
          )}
        </h3>

        <p className="font-sans text-[1.02rem] leading-[1.65] text-foreground-muted max-w-[44ch]">
          {body}
        </p>

        {meta && meta.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border-subtle pt-5">
            {meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <dt className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-foreground-muted">
                  {m.label}
                </dt>
                <dd className="font-mono text-sm text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-2">
          {status === "Forthcoming" ? (
            <span
              aria-label="Status"
              className="
                inline-flex items-center gap-2
                font-mono text-[0.7rem] tracking-[0.18em] uppercase
                text-foreground-muted
              "
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-ochre"
              />
              Forthcoming · in development
            </span>
          ) : (
            <Link
              href={href}
              className="
                group inline-flex items-baseline gap-2
                font-sans text-[0.95rem] tracking-wide text-foreground
                transition-colors hover:text-terracotta
              "
            >
              <span
                className="
                  border-b border-ochre/60 pb-0.5
                  transition-colors group-hover:border-terracotta
                "
              >
                Read the case
              </span>
              <span
                aria-hidden
                className="
                  inline-block translate-x-0
                  transition-transform duration-300 ease-out
                  group-hover:translate-x-1.5
                "
              >
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

function CaseImage({
  variant,
  title,
  status,
}: {
  variant: CaseVariant;
  title: string;
  status: CaseRowProps["status"];
}) {
  return (
    <figure
      className="
        relative aspect-[4/3] w-full overflow-hidden
        border border-ochre/60
        bg-ink-deep
      "
    >
      <div className="absolute inset-0">
        {variant === "justice" && <JusticeArt />}
        {variant === "commerce" && <CommerceArt />}
        {variant === "forthcoming" && <ForthcomingArt />}
      </div>

      {/* Top-left mono caption — the "infrastructure tell" on each frame */}
      <figcaption
        className="
          absolute left-4 top-4 z-10 flex items-center gap-3
          font-mono text-[0.65rem] tracking-[0.18em] uppercase text-foreground-muted
        "
      >
        <span
          aria-hidden
          className={`
            inline-block h-1.5 w-1.5 rounded-full
            ${status === "Live" ? "bg-moss" : status === "Active" ? "bg-ochre" : "bg-terracotta"}
          `}
        />
        {status === "Live"
          ? "Live · production"
          : status === "Active"
            ? "Active · trading"
            : "In development"}
      </figcaption>

      {/* Bottom-right project signature */}
      <span
        aria-hidden
        className="
          absolute bottom-4 right-4 z-10
          font-mono text-[0.6rem] tracking-[0.2em] uppercase text-foreground-muted/70
        "
      >
        {title}
      </span>

      {/* Awaiting imagery whisper — TODO: replace with production screenshots */}
      <span
        aria-hidden
        className="
          absolute bottom-4 left-4 z-10
          font-mono text-[0.55rem] tracking-[0.22em] uppercase text-foreground-muted/50
        "
      >
        // imagery pending
      </span>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Per-case stylised art — replaced with real product mockups in due course.  */

function JusticeArt() {
  // A hearing-room window: arched indigo bay, floor lines receding to a vanishing point.
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="jx-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0e1430" />
          <stop offset="100%" stopColor="#060814" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#jx-bg)" />

      {/* Floor perspective lines */}
      <g stroke="#d9a441" strokeOpacity="0.18">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={400}
            y1={420}
            x2={(i / 11) * 800}
            y2={600}
            strokeWidth="0.7"
          />
        ))}
        <line x1="0" y1="420" x2="800" y2="420" strokeWidth="1" />
      </g>

      {/* Three arches: counsel · bench · counsel */}
      <g stroke="#d9a441" fill="none">
        <path
          d="M 120 420 L 120 220 Q 120 130 220 130 Q 320 130 320 220 L 320 420"
          strokeWidth="1.4"
          opacity="0.85"
        />
        <path
          d="M 320 420 L 320 180 Q 320 80 400 80 Q 480 80 480 180 L 480 420"
          strokeWidth="1.6"
          opacity="1"
        />
        <path
          d="M 480 420 L 480 220 Q 480 130 580 130 Q 680 130 680 220 L 680 420"
          strokeWidth="1.4"
          opacity="0.85"
        />
      </g>

      {/* Bench seal — terracotta circle with concentric procedural rings */}
      <g transform="translate(400, 250)">
        <circle r="56" fill="#c8553d" opacity="0.9" />
        <circle r="56" fill="none" stroke="#f4efe6" strokeOpacity="0.4" />
        <circle r="42" fill="none" stroke="#f4efe6" strokeOpacity="0.5" />
        <circle r="28" fill="none" stroke="#f4efe6" strokeOpacity="0.7" />
        <text
          y="6"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#f4efe6"
        >
          XIX · CII
        </text>
      </g>

      {/* Caption strip — mock procedural badge */}
      <g transform="translate(0, 470)">
        <line x1="60" y1="0" x2="740" y2="0" stroke="#d9a441" strokeOpacity="0.4" />
        <text
          x="60"
          y="28"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="13"
          letterSpacing="3"
          fill="#f4efe6"
          fillOpacity="0.85"
        >
          PART XIV · ARTICLE 71 · HEARING ROOM 03
        </text>
        <text
          x="60"
          y="56"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#f4efe6"
          fillOpacity="0.55"
        >
          TRANSCRIPT · LIVE · ROLES (7) PRESENT
        </text>
        <text
          x="740"
          y="28"
          textAnchor="end"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#d9a441"
        >
          02:14:08
        </text>
      </g>
    </svg>
  );
}

function CommerceArt() {
  // A trade ledger: stacked SKU bars in ochre, clay, terracotta — the ports of Lagos in shorthand.
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="cx-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0c1024" />
          <stop offset="100%" stopColor="#060814" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#cx-bg)" />

      {/* Grid */}
      <g stroke="#d9a441" strokeOpacity="0.12">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i / 8) * 800} y1="0" x2={(i / 8) * 800} y2="600" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i / 6) * 600} x2="800" y2={(i / 6) * 600} />
        ))}
      </g>

      {/* Stacked container bars */}
      <g>
        {[
          { y: 100, w: 540, fill: "#c8553d", opacity: 0.85, label: "BAKING ESSENTIALS" },
          { y: 160, w: 420, fill: "#d9a441", opacity: 0.85, label: "POULTRY" },
          { y: 220, w: 600, fill: "#8b4a2b", opacity: 0.9, label: "YAM · UK BOUND" },
          { y: 280, w: 360, fill: "#2a3270", opacity: 0.95, label: "ANCILLARY" },
          { y: 340, w: 480, fill: "#c8553d", opacity: 0.5, label: "PIPELINE" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={80} y={b.y} width={b.w} height={28} fill={b.fill} opacity={b.opacity} />
            <text
              x={88}
              y={b.y + 19}
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize="11"
              letterSpacing="2.4"
              fill="#f4efe6"
              fillOpacity="0.95"
            >
              {b.label}
            </text>
            <text
              x={80 + b.w + 14}
              y={b.y + 19}
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
              fontSize="11"
              letterSpacing="1.6"
              fill="#f4efe6"
              fillOpacity="0.55"
            >
              {Math.round(b.w / 6)} SKU
            </text>
          </g>
        ))}
      </g>

      {/* Footer ledger row */}
      <g transform="translate(0, 470)">
        <line x1="60" y1="0" x2="740" y2="0" stroke="#d9a441" strokeOpacity="0.4" />
        <text
          x="60"
          y="28"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="13"
          letterSpacing="3"
          fill="#f4efe6"
          fillOpacity="0.85"
        >
          RFQ · KYC · PAYMENT · DOCS
        </text>
        <text
          x="60"
          y="56"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#f4efe6"
          fillOpacity="0.55"
        >
          APAPA → FELIXSTOWE · 17 OPEN ORDERS
        </text>
        <text
          x="740"
          y="28"
          textAnchor="end"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#d9a441"
        >
          NGN ▲ 3.2%
        </text>
      </g>
    </svg>
  );
}

function ForthcomingArt() {
  // A sparse blueprint grid with a single bright node — work in progress.
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="fx-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#080b1c" />
          <stop offset="100%" stopColor="#040611" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#fx-bg)" />

      <g stroke="#d9a441" strokeOpacity="0.15">
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={`v${i}`} x1={(i / 16) * 800} y1="0" x2={(i / 16) * 800} y2="600" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i / 12) * 600} x2="800" y2={(i / 12) * 600} />
        ))}
      </g>

      {/* Citation lattice — short orthogonal connectors */}
      <g stroke="#f4efe6" strokeOpacity="0.45" fill="none" strokeLinecap="square">
        <path d="M 120 200 L 220 200 L 220 280 L 360 280" strokeWidth="1" />
        <path d="M 220 280 L 220 360 L 460 360" strokeWidth="1" />
        <path d="M 360 280 L 360 200 L 540 200" strokeWidth="1" />
        <path d="M 540 200 L 660 200" strokeWidth="1" />
        <path d="M 460 360 L 660 360" strokeWidth="1" />
      </g>

      {/* Nodes */}
      <g fill="#d9a441" fillOpacity="0.85">
        {[
          [120, 200],
          [220, 280],
          [360, 280],
          [220, 360],
          [460, 360],
          [540, 200],
          [660, 200],
          [660, 360],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" />
        ))}
        <circle cx={460} cy={360} r="10" fill="#c8553d" />
      </g>

      <text
        x="400"
        y="500"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize="36"
        fontStyle="italic"
        fill="#f4efe6"
        fillOpacity="0.7"
      >
        building.
      </text>

      <g transform="translate(0, 540)">
        <line x1="60" y1="0" x2="740" y2="0" stroke="#d9a441" strokeOpacity="0.35" />
        <text
          x="60"
          y="28"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2.6"
          fill="#f4efe6"
          fillOpacity="0.55"
        >
          EVIDENTIARY GRAPH · PRIVATE BETA · LAGOS / ABUJA
        </text>
      </g>
    </svg>
  );
}
