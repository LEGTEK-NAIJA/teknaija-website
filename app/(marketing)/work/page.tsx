import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeritageImage } from "@/components/marketing/HeritageImage";
import { fetchAllProjects } from "@/lib/content/queries";
import { projectIndexLabel } from "@/lib/content/format";

export const metadata: Metadata = {
  title: "Work — TEK NAIJA",
  description:
    "Selected engagements from TEK NAIJA: a small portfolio, deliberately so. Each entry is a system in production or in build.",
};

const SECTOR_FALLBACK = "Engagement";

export default async function WorkIndexPage() {
  const projects = await fetchAllProjects();

  return (
    <>
      {/* Second Benin bronze — fixed lower-left, peeks across the page as
          you scroll. Mask fades right + top so it dissolves into the ground. */}
      <HeritageImage
        src="/yoruba_art.jpeg"
        positionClassName="fixed bottom-0 left-0 h-[55vh] w-[34vw] max-w-[460px] min-w-[220px] -z-10"
        opacity={0.10}
        blendMode="luminosity"
        maskImage="linear-gradient(to bottom left, transparent 0%, transparent 18%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.95) 80%)"
        sizes="(min-width: 1024px) 460px, 34vw"
        objectPosition="left bottom"
      />
      <Header count={projects.length} />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <ol
          className="
            mx-auto w-full max-w-[1440px]
            px-5 sm:px-8 lg:px-14
            pb-32
            group/list
          "
        >
          {projects.map((project, idx) => {
            if (!project.slug || !project.title) return null;
            return (
              <ProjectRow
                key={project.slug}
                index={idx}
                slug={project.slug}
                title={project.title}
                sector={project.sector ?? SECTOR_FALLBACK}
                status={project.status ?? null}
                cover={project.cover_image ?? null}
                summary={project.body ?? ""}
              />
            );
          })}
          <li className="border-t border-border-subtle" aria-hidden />
        </ol>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

function Header({ count }: { count: number }) {
  return (
    <header
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pt-24 lg:pt-40 pb-16 lg:pb-24
      "
    >
      {/* Benin bronze (Iyoba head) — right of hero, large, atmospheric. */}
      <HeritageImage
        src="/yoruba_art1.jpeg"
        positionClassName="absolute right-0 top-0 h-full w-[55%] max-w-[680px] -z-10"
        opacity={0.18}
        blendMode="luminosity"
        maskImage="linear-gradient(to top right, transparent 0%, transparent 18%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.95) 78%)"
        sizes="(min-width: 1280px) 680px, 55vw"
        objectPosition="center right"
      />
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
        Portfolio
      </p>

      <h1
        className="
          mt-6 font-serif font-optical-display
          text-[clamp(2.5rem,7vw,5.5rem)]
          leading-[0.98] tracking-[-0.012em]
          text-foreground max-w-[18ch]
        "
      >
        Selected work, in full.
      </h1>

      <p className="mt-8 max-w-[60ch] font-sans text-foreground-muted leading-[1.65] text-[1.05rem]">
        A short, deliberate list. Justice infrastructure that has gone live in
        Lagos. Trade rails between Nigerian commodities and foreign customs. A
        few more in build, kept private until they ship. Hover any row to read
        it; click to enter the case.
      </p>

      <p className="mt-10 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{count} {count === 1 ? "entry" : "entries"}</span>
        <span aria-hidden className="text-ochre">—</span>
        <span>Last updated 2026</span>
      </p>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Single row                                                                  */
/* -------------------------------------------------------------------------- */

function ProjectRow({
  index,
  slug,
  title,
  sector,
  status,
  cover,
  summary,
}: {
  index: number;
  slug: string;
  title: string;
  sector: string;
  status: string | null;
  cover: string | null;
  summary: string;
}) {
  const statusLabel = (status ?? "").toLowerCase();
  const statusDisplay =
    statusLabel === "live"
      ? "Live · production"
      : statusLabel === "forthcoming"
        ? "In development"
        : statusLabel === "archived"
          ? "Archived"
          : statusLabel
            ? statusLabel
            : "Active";

  // Trim body to a single editorial line preview.
  const preview = summary
    .replace(/\s+/g, " ")
    .trim()
    .split(". ")
    .slice(0, 2)
    .join(". ");

  return (
    <li>
      <Link
        href={`/work/${slug}`}
        className="
          group/row
          grid grid-cols-12 items-stretch gap-x-6 gap-y-6
          border-t border-border-subtle
          py-10 lg:py-14
          transition-opacity duration-300 ease-out
          motion-reduce:transition-none
          [@media(hover:hover)]:group-hover/list:opacity-40
          hover:!opacity-100
        "
      >
        <div className="col-span-12 lg:col-span-7 relative">
          <CoverFrame title={title} slug={slug} cover={cover} />
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 lg:py-3">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ochre">
            {`PROJECT ${projectIndexLabel(index)} — ${sector.toUpperCase()}`}
          </p>

          <h2
            className="
              font-serif font-optical-display leading-[0.98]
              text-[clamp(2rem,4.6vw,3.25rem)]
              text-foreground
              transition-colors duration-300
              [@media(hover:hover)]:group-hover/row:text-terracotta
            "
          >
            {title}
          </h2>

          {preview && (
            <p className="font-sans text-foreground-muted leading-[1.6] text-[1rem] max-w-[44ch]">
              {preview}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-4">
            <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
              {statusDisplay}
            </span>
            <span
              className="
                inline-flex items-baseline gap-2
                font-sans text-[0.85rem] tracking-wide text-foreground
                transition-colors group-hover/row:text-terracotta
              "
            >
              <span className="border-b border-ochre/60 pb-0.5 transition-colors group-hover/row:border-terracotta">
                Open the case
              </span>
              <span
                aria-hidden
                className="
                  inline-block transition-transform duration-300 ease-out
                  group-hover/row:translate-x-1.5
                "
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

function CoverFrame({
  title,
  slug,
  cover,
}: {
  title: string;
  slug: string;
  cover: string | null;
}) {
  const resolved =
    cover ??
    (/legtek/i.test(slug)
      ? "/LEGTEK_NAIJA_SCREENSHOT.png"
      : /stk/i.test(slug)
        ? "/STK_Screenshot.png"
        : null);

  return (
    <figure className="relative aspect-[4/3] w-full overflow-hidden border border-ochre/60 bg-ink-deep">
      {resolved ? (
        <Image
          src={resolved}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className={
            resolved === "/LEGTEK_NAIJA_SCREENSHOT.png" ||
            resolved === "/STK_Screenshot.png"
              ? "object-cover object-[center_15%]"
              : "object-cover object-top"
          }
          priority={false}
        />
      ) : (
        <Placeholder title={title} />
      )}
      <span
        aria-hidden
        className="
          absolute bottom-3 right-3
          font-mono text-[0.6rem] tracking-[0.22em] uppercase text-foreground-muted/70
        "
      >
        {title}
      </span>
    </figure>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id={`pl-${title}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0e1430" />
          <stop offset="100%" stopColor="#060814" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#pl-${title})`} />
      <g stroke="#d9a441" strokeOpacity="0.18">
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 75}
            x2="800"
            y2={i * 75}
            strokeWidth="0.6"
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 80}
            y1="0"
            x2={i * 80}
            y2="600"
            strokeWidth="0.6"
          />
        ))}
      </g>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontStyle="italic"
        fontSize="44"
        fill="#f4efe6"
        fillOpacity="0.7"
      >
        {title}
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                       */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div
      className="
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14 pb-32
      "
    >
      <div className="border-t border-border-subtle py-20 lg:py-32">
        <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-foreground-muted">
          // Portfolio in build
        </p>
        <p className="mt-6 max-w-[55ch] font-serif text-[1.5rem] leading-[1.4] text-foreground italic">
          The portfolio is coming online piece by piece. The work that is live
          is at <Link href="/" className="border-b border-ochre/60 pb-0.5 hover:border-terracotta">our front door</Link>; the rest will arrive here as it earns the right
          to be shown.
        </p>
      </div>
    </div>
  );
}
