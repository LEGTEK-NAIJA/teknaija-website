import Image from "next/image";
import Link from "next/link";
import { NsibidiGlyph } from "@/components/motifs/NsibidiGlyph";
import { StackRibbon } from "@/components/marketing/StackRibbon";

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
  status: "Live" | "Forthcoming" | "Active" | "Private Beta";
  href: string;
  body: string;
  variant: CaseVariant;
  reverse?: boolean;
  meta?: { label: string; value: string }[];
  stack?: string[];
  coverImage?: string | null;
};

/**
 * CaseRow — a single editorial spread on the homepage's Selected Work.
 * Image left 60%, metadata right 40%. Reverses on alternating rows so the
 * page reads with rhythm rather than as a stack.
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
  stack,
  coverImage,
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
        <CaseImage
          variant={variant}
          title={title}
          status={status}
          coverImage={coverImage ?? null}
        />
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

        <h3
          className="font-serif font-optical-display leading-[0.9]"
          style={{ fontWeight: 500 }}
        >
          <span className="block text-[clamp(2.75rem,5.8vw,4.75rem)] tracking-[-0.028em] text-foreground">
            {title}
          </span>
          {scriptSubtitle && (
            <span className="accent-script mt-3 block text-foreground-muted text-[clamp(1.25rem,1.8vw,1.6rem)]">
              {scriptSubtitle}
            </span>
          )}
        </h3>

        <p className="font-sans text-[1.02rem] leading-[1.65] text-foreground-muted max-w-[44ch]">
          {body}
        </p>

        <StackRibbon items={stack ?? []} />

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
  coverImage,
}: {
  variant: CaseVariant;
  title: string;
  status: CaseRowProps["status"];
  coverImage: string | null;
}) {
  const shotSrc =
    coverImage ||
    (variant === "justice"
      ? "/LEGTEK_NAIJA_SCREENSHOT.png"
      : variant === "commerce"
        ? "/STK_Screenshot.png"
        : null);

  return (
    <figure
      className="
        group relative aspect-[4/3] w-full overflow-hidden
        border border-ochre/60
        bg-ink-deep
      "
    >
      <div className="absolute inset-0">
        {shotSrc ? (
          <Image
            src={shotSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="
              object-cover object-[center_15%]
              [filter:saturate(0.72)_brightness(0.82)_contrast(1.06)]
              transition-[filter] duration-700
              group-hover:[filter:saturate(0.85)_brightness(0.92)_contrast(1.04)]
            "
            priority={false}
          />
        ) : (
          <ForthcomingArt />
        )}
      </div>

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t from-ink-deep/85 via-ink-deep/35 to-ink-deep/15
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 mix-blend-multiply
          bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgba(11,14,26,0.55)_100%)]
        "
      />

      {/* Top-right Nsibidi corner mark — traces in on hover */}
      <div
        aria-hidden="true"
        className="
          absolute top-4 right-4 z-10
          text-ochre/70 opacity-0 transition-opacity duration-700
          group-hover:opacity-100
        "
      >
        <NsibidiGlyph variant="knot" size={48} trigger="hover" />
      </div>

      {/* Bottom-left mono caption — the "infrastructure tell" on each frame */}
      <figcaption
        className="
          absolute bottom-4 left-4 z-10 flex items-center gap-3
          font-mono text-[0.65rem] tracking-[0.18em] uppercase text-foreground-muted
        "
      >
        <span
          aria-hidden
          className={`
            inline-block h-1.5 w-1.5 rounded-full
            ${
              status === "Live"
                ? "bg-moss"
                : status === "Active"
                  ? "bg-ochre"
                  : status === "Private Beta"
                    ? "bg-ochre"
                    : "bg-terracotta"
            }
          `}
        />
        {status === "Live"
          ? "Live · production"
          : status === "Active"
            ? "Active · trading"
            : status === "Private Beta"
              ? "Private beta · cohort"
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
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Forthcoming placeholder — sparse blueprint until the case ships publicly.  */

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
