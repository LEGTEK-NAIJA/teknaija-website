import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdireGround } from "@/components/motifs/AdireGround";
import { AsoOkeDivider } from "@/components/motifs/AsoOkeDivider";
import { Ejubejuailo } from "@/components/motifs/Ejubejuailo";
import { NsibidiGlyph } from "@/components/motifs/NsibidiGlyph";
import { CaseRow } from "@/components/marketing/CaseRow";
import type { CaseSector, CaseVariant } from "@/components/marketing/CaseRow";
import { HeritageImage } from "@/components/marketing/HeritageImage";
import {
  TestimonialCarousel,
  type Testimonial,
} from "@/components/marketing/TestimonialCarousel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/* Supabase row shapes (minimal — matches CLAUDE.md CMS tables).              */
/* -------------------------------------------------------------------------- */

type TestimonialRow = {
  quote: string;
  author_name: string | null;
  author_role: string | null;
  author_org: string | null;
};

type PostRow = {
  slug: string;
  title: string | null;
  dek: string | null;
  published_at: string | null;
};

type ProjectRow = {
  slug: string | null;
  title: string | null;
  sector: string | null;
  status: string | null;
  body: string | null;
  outcomes?: unknown;
  stack?: unknown;
  cover_image: string | null;
};

async function fetchHomepageData() {
  const supabase = await createSupabaseServerClient();

  const [testimonialsRes, postsRes, projectsRes] = await Promise.all([
    supabase
      .from("testimonials")
      .select("quote, author_name, author_role, author_org")
      .eq("active", true)
      .order("id", { ascending: true }),
    supabase
      .from("posts")
      .select("slug, title, dek, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("projects")
      .select("slug, title, sector, status, body, outcomes, stack, cover_image")
      .eq("featured", true)
      .order("display_order", { ascending: true }),
  ]);

  // Diagnostic — visible in terminal during `npm run dev` and in Vercel function logs.

  const testimonials: TestimonialRow[] = testimonialsRes.error
    ? []
    : (testimonialsRes.data as TestimonialRow[]) ?? [];

  const posts: PostRow[] = postsRes.error ? [] : (postsRes.data as PostRow[]) ?? [];

  const projects: ProjectRow[] = projectsRes.error
    ? []
    : (projectsRes.data as ProjectRow[]) ?? [];

  return {
    testimonials: testimonials.map(
      (t): Testimonial => ({
        quote: t.quote ?? "",
        author: t.author_name ?? "",
        role: t.author_role ?? "",
        org: t.author_org ?? "",
      })
    ),
    posts,
    projects,
  };
}

function toCaseSector(raw: string | null | undefined): CaseSector {
  const t = raw ?? "";
  if (
    /justice|regulatory|litigation|arbitration|dispute|hearing|court|procedural/i.test(
      t
    )
  ) {
    return "JUSTICE INFRASTRUCTURE";
  }
  if (/commerce|trade|export|supply|bakery|poultry|agric/i.test(t)) {
    return "TRADE & COMMERCE";
  }
  return "LEGAL INTELLIGENCE";
}

function toCaseVariant(
  slug: string | null | undefined,
  status: string | null | undefined
): CaseVariant {
  const st = (status ?? "").toLowerCase();
  if (st === "forthcoming" || st === "private_beta") return "forthcoming";
  const sl = (slug ?? "").toLowerCase();
  if (sl.includes("stk") || sl.includes("trade") || sl.includes("commerce")) {
    return "commerce";
  }
  return "justice";
}

function toCaseDisplayStatus(
  status: string | null | undefined
): "Live" | "Forthcoming" | "Active" | "Private Beta" {
  const s = (status ?? "").toLowerCase();
  if (s === "forthcoming") return "Forthcoming";
  if (s === "private_beta") return "Private Beta";
  if (s === "archived") return "Active";
  return "Live";
}

function stackToList(stack: unknown): string[] {
  if (!Array.isArray(stack)) return [];
  return stack.filter((x): x is string => typeof x === "string");
}

function outcomesToMeta(
  outcomes: unknown
): { label: string; value: string }[] | undefined {
  if (!outcomes) return undefined;
  if (!Array.isArray(outcomes)) return undefined;
  const pairs = outcomes.filter(
    (x): x is { label: string; value: string } =>
      Boolean(x) &&
      typeof x === "object" &&
      "label" in x &&
      "value" in x &&
      typeof (x as { label: unknown }).label === "string" &&
      typeof (x as { value: unknown }).value === "string"
  );
  return pairs.length > 0 ? pairs : undefined;
}

function formatPublishDate(
  iso: string | null | undefined
): { display: string; isoDay: string } {
  if (!iso) return { display: "", isoDay: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()))
    return { display: iso, isoDay: iso.slice(0, 10) };
  return {
    display: d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    isoDay: d.toISOString().slice(0, 10),
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function delayStyle(ms: number): CSSProperties {
  return { ["--anim-delay" as string]: `${ms}ms` } as CSSProperties;
}

const HEADLINE_LINE_1 = ["We", "build", "the", "systems"] as const;
const HEADLINE_LINE_2 = ["Nigeria", "runs", "on."] as const;
const HEADLINE_WORD_COUNT =
  HEADLINE_LINE_1.length + HEADLINE_LINE_2.length;
const STAGGER_MS = 60;
const HEADLINE_TAIL_MS =
  STAGGER_MS * (HEADLINE_WORD_COUNT - 1); // last word starts to enter
const UNDERLINE_DELAY_MS = HEADLINE_TAIL_MS + 700; // after last word lands
const SUBHEAD_DELAY_MS = HEADLINE_TAIL_MS + 200;
const FOOTNOTE_DELAY_MS = HEADLINE_TAIL_MS + 600;

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default async function HomePage() {
  const { testimonials, posts, projects } = await fetchHomepageData();

  // TEMP DEBUG — remove once data flow is verified.

  return (
    <>
      <Hero />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <SelectedWork projects={projects} />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <ByTheNumbers />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <CapabilitiesPreview />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <Voices testimonials={testimonials} />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <FromTheDesk posts={posts} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 1 — Hero                                                            */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="
        relative isolate overflow-hidden
        min-h-[100dvh]
        flex flex-col
        bg-ink
      "
    >
      {/* Background stack — slow-panning Ejube + Adire + indigo wash */}
      <div className="absolute inset-0 anim-slow-pan">
        <Ejubejuailo />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/40"
      />
      <AdireGround />

      {/* Indigo radial vignette over right half */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0 right-0 w-1/2 z-[5]
        "
        style={{
          background:
            "radial-gradient(ellipse at right center, transparent 28%, #0B0E1A 78%)",
        }}
      />

      {/* Top-right Nsibidi compass — drawn in as a heritage tell */}
      <div
        aria-hidden="true"
        className="absolute right-8 top-32 z-[11] hidden md:block text-ochre/55"
      >
        <NsibidiGlyph variant="compass" size={96} delay={1400} />
      </div>

      {/* Bottom-left Nsibidi lattice — second tell */}
      <div
        aria-hidden="true"
        className="absolute left-8 bottom-32 z-[11] hidden lg:block text-terracotta/50"
      >
        <NsibidiGlyph variant="lattice" size={84} delay={1800} />
      </div>

      {/* Content column */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-[1440px]
          flex flex-1 flex-col min-h-0 min-w-0
          px-5 sm:px-8 lg:px-14
          -mt-7 sm:-mt-9 lg:-mt-12
          pb-12 pt-0
        "
      >
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <Link
            href="/"
            aria-label="TEK NAIJA LTD"
            className="
              isolate z-[15] relative
              block w-fit shrink-0
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ink
            "
          >
            <Image
              src="/legtek-naija-emblem.png"
              alt="TEK NAIJA"
              width={600}
              height={600}
              className="
                block h-[clamp(120px,18vw,220px)] w-auto max-w-full
                object-contain object-left
              "
              sizes="(min-width: 1024px) 220px, 40vw"
              priority
            />
          </Link>

          {/* Eyebrow — a small editorial marker above the headline */}
          <p
            className="
              relative z-[15]
              -mt-6 mb-4
              shrink-0
              font-mono text-[0.7rem] sm:text-[0.78rem] tracking-[0.32em] uppercase
              text-ochre
              anim-fade
            "
            style={delayStyle(200)}
          >
            <span className="inline-block w-8 h-px align-middle bg-ochre mr-3" />
            Issue 01 · The Founding Brief
          </p>

          <h1
            className="
              relative z-[15]
              mb-8
              w-full max-w-[min(100%,98vw)] lg:max-w-none
              shrink-0
              font-serif font-optical-display
              text-foreground
              text-[clamp(2.5rem,8.8vw,7.75rem)]
              leading-[0.9] tracking-[-0.038em]
              anim-fade
            "
            style={{ ...delayStyle(0), lineHeight: 0.9, fontWeight: 500 }}
          >
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.2em] lg:flex-nowrap lg:gap-x-[0.28em] lg:whitespace-nowrap">
              {HEADLINE_LINE_1.map((word, idx) => {
                const delayMs = idx * STAGGER_MS;
                return (
                  <RisingWord key={word + idx} delayMs={delayMs} useParentGap>
                    {word}
                  </RisingWord>
                );
              })}
            </span>
            <span className="mt-[0.06em] flex min-w-0 flex-wrap items-baseline gap-x-[0.2em] lg:flex-nowrap lg:gap-x-[0.28em] lg:whitespace-nowrap">
              {HEADLINE_LINE_2.map((word, idx) => {
                const i = HEADLINE_LINE_1.length + idx;
                const isAccent = word === "Nigeria";
                const delayMs = i * STAGGER_MS;
                return (
                  <RisingWord
                    key={word + idx}
                    delayMs={delayMs}
                    accent={isAccent}
                    useParentGap
                  >
                    {word}
                  </RisingWord>
                );
              })}
            </span>
          </h1>

          {/* Yoruba accent — a single italic line that pulls the cultural register */}
          <p
            className="
              relative z-[15]
              mb-6 shrink-0
              accent-script text-foreground-muted
              text-[clamp(1.1rem,2vw,1.5rem)]
              anim-veil-rise
            "
            style={delayStyle(SUBHEAD_DELAY_MS - 100)}
          >
            Ìmọ̀-ẹ̀rọ tí ó dúró ní ìpìlẹ̀.
            <span className="text-foreground/45"> · </span>
            Technology that holds the foundation.
          </p>

          <p
            className="
              relative z-[15]
              mb-0 max-w-[min(52ch,92vw)] lg:max-w-[min(52ch,min(92vw,45vw))]
              shrink-0
              font-sans text-[1.15rem] leading-[1.6] text-ivory/80
              anim-rise
            "
            style={delayStyle(SUBHEAD_DELAY_MS)}
          >
            A Lagos-headquartered technology firm. We hold a portfolio of
            software we own, and we build software for the Nigerian
            institutions that need it built — courts, exporters, chambers.
          </p>

          <div className="min-h-4 flex-1 shrink-0" aria-hidden />

          {/* Footnote — split into editorial chips with subtle dividers */}
          <p
            className="
              relative z-[15]
              shrink-0
              flex flex-wrap items-center gap-x-3 gap-y-1
              font-mono text-[0.7rem] sm:text-[0.75rem]
              uppercase tracking-[0.18em] text-foreground-muted
              anim-fade
            "
            style={delayStyle(FOOTNOTE_DELAY_MS)}
          >
            <span>Incorporated 08.01.2026</span>
            <span aria-hidden className="text-ochre">—</span>
            <span>Lagos, Nigeria</span>
            <span aria-hidden className="text-ochre">—</span>
            <span>Active across 4 sectors</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function RisingWord({
  children,
  delayMs,
  accent,
  useParentGap,
}: {
  children: React.ReactNode;
  delayMs: number;
  accent?: boolean;
  useParentGap?: boolean;
}) {
  const outerCls = useParentGap
    ? "inline-block overflow-hidden align-baseline"
    : "inline-block overflow-hidden align-baseline mr-[0.25em] last:mr-0";

  return (
    <span className={outerCls} style={{ paddingBottom: "0.08em" }}>
      <span className="inline-block anim-rise" style={delayStyle(delayMs)}>
        {accent ? (
          <span className="relative inline-block">
            {children}
            <span
              aria-hidden
              className="
                anim-underline
                absolute left-0 right-0
                bg-terracotta
              "
              style={{
                ...delayStyle(UNDERLINE_DELAY_MS),
                bottom: "-0.04em",
                height: "0.075em",
              }}
            />
          </span>
        ) : (
          children
        )}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 2 — Selected Work                                                   */
/* -------------------------------------------------------------------------- */

function SelectedWork({ projects }: { projects: ProjectRow[] }) {
  const rows = projects.filter((p): p is ProjectRow & { slug: string; title: string } =>
    Boolean(p.slug && p.title)
  );

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pt-24 lg:pt-40
      "
    >
      <header className="grid grid-cols-12 gap-x-6 mb-20 lg:mb-32">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <p className="font-mono text-[0.7rem] tracking-[0.32em] uppercase text-ochre flex items-center gap-3">
            <span aria-hidden className="inline-block w-8 h-px bg-ochre" />
            § 002
          </p>
          <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-foreground-muted">
            Selected work
          </p>
        </div>
        <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0">
          <h2
            id="work-heading"
            className="
              font-serif font-optical-display leading-[0.92]
              text-[clamp(2.75rem,7vw,6rem)] tracking-[-0.028em]
              text-foreground max-w-[22ch]
            "
            style={{ fontWeight: 500 }}
          >
            The proof <span className="italic text-foreground-muted">is what</span> we ship.
          </h2>
          <p className="mt-8 max-w-[52ch] font-sans text-[1.05rem] text-foreground-muted leading-[1.65]">
            Three engagements that describe the bar of the practice — one in
            production, one in trade, one in build. The portfolio is small on
            purpose; the work is not.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-24 lg:gap-40">
        {rows.map((project, idx) => {
          const subtitleMap: Record<string, string> = {
            "legtek-naija": "Ìdájọ́ — Justice as system",
            "stk-industries": "Ìṣòwò — Built for STK Industries Ltd",
            litigateiq: "NLIS — Intelligence over precedent",
          };
          const subtitle = subtitleMap[project.slug ?? ""];
          return (
            <CaseRow
              key={project.slug}
              index={idx + 1}
              sector={toCaseSector(project.sector)}
              title={project.title}
              scriptSubtitle={subtitle}
              status={toCaseDisplayStatus(project.status)}
              href={`/work/${project.slug}`}
              variant={toCaseVariant(project.slug, project.status)}
              reverse={idx % 2 === 1}
              body={(project.body ?? "").trim()}
              stack={stackToList(project.stack)}
              meta={outcomesToMeta(project.outcomes)}
              coverImage={project.cover_image ?? null}
            />
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 2b — By the numbers                                                 */
/* -------------------------------------------------------------------------- */

function ByTheNumbers() {
  const stats = [
    {
      value: "19",
      label: "Procedural parts",
      detail: "shipped in LEGTEK NAIJA's rule engine",
      delay: 0,
    },
    {
      value: "102",
      label: "Articles",
      detail: "encoded in the dispute resolution corpus",
      delay: 120,
    },
    {
      value: "100%",
      label: "PSC ownership",
      detail: "founder-aligned, no external dilution",
      delay: 240,
    },
    {
      value: "4",
      label: "Active sectors",
      detail: "justice · commerce · institutional · AI",
      delay: 360,
    },
  ];

  return (
    <section
      aria-labelledby="numbers-heading"
      className="
        relative isolate overflow-hidden
        bg-ink-deep
        py-24 lg:py-40
      "
    >
      {/* Faint Adire-style radial pattern, contained to this section */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-screen pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 600"
      >
        {Array.from({ length: 10 }).map((_, idx) => (
          <circle
            key={idx}
            cx="600"
            cy="300"
            r={40 + idx * 55}
            fill="none"
            stroke="#F4EFE6"
            strokeWidth="0.8"
            strokeDasharray={idx % 2 ? "6 14" : "20 6"}
          />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <header className="grid grid-cols-12 gap-x-6 mb-16 lg:mb-24">
          <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
            By the numbers
          </p>
          <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0">
            <h2
              id="numbers-heading"
              className="
                font-serif font-optical-display leading-[0.98]
                text-[clamp(2.25rem,5.2vw,4.5rem)] tracking-[-0.022em]
                text-foreground max-w-[22ch]
              "
            >
              The receipts of a young
              <span className="block italic text-foreground-muted">institution.</span>
            </h2>
          </div>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-10">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-3 group">
              <dt
                className="
                  font-serif font-optical-display
                  text-[clamp(4rem,9vw,8rem)] leading-[0.85]
                  text-foreground
                  anim-counter
                "
                style={{
                  ["--anim-delay" as string]: `${s.delay}ms`,
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 144',
                } as CSSProperties}
              >
                {s.value}
              </dt>
              <dd className="flex flex-col gap-1 border-t border-ochre/30 pt-4">
                <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
                  {s.label}
                </span>
                <span className="font-sans text-sm leading-[1.5] text-foreground-muted">
                  {s.detail}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 3 — Capabilities preview                                            */
/* -------------------------------------------------------------------------- */

const PRACTICES = [
  {
    roman: "I",
    href: "/capabilities#justice",
    title: "Justice & Regulatory Technology",
    blurb:
      "Procedural systems, hearing-room infrastructure, and the workflow software that the practice of law in a federal jurisdiction quietly depends on.",
  },
  {
    roman: "II",
    href: "/capabilities#commerce",
    title: "Commerce & Trade Platforms",
    blurb:
      "Marketplaces, B2B trade rails, and export-grade operational tooling — built for Nigerian commercial reality and the standards of foreign customs.",
  },
  {
    roman: "III",
    href: "/capabilities#workflow",
    title: "Institutional Software & Workflow Systems",
    blurb:
      "Internal platforms for ministries, regulators, holding companies, and any institution that has outgrown its spreadsheets and not yet found its replacement.",
  },
  {
    roman: "IV",
    href: "/capabilities#ai",
    title: "Applied AI & Data Infrastructure",
    blurb:
      "Retrieval, transcription, document understanding, and the unglamorous data plumbing that makes any of it actually work in production.",
  },
] as const;

function CapabilitiesPreview() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-24 lg:py-40
      "
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="font-mono text-[0.7rem] tracking-[0.32em] uppercase text-ochre mb-6 flex items-center gap-3">
            <span aria-hidden className="inline-block w-8 h-px bg-ochre" />
            § 003 — Practice
          </p>
          <h2
            id="capabilities-heading"
            className="
              font-serif font-optical-display
              text-[clamp(2.75rem,6vw,5.25rem)]
              leading-[0.95] tracking-[-0.028em]
              text-foreground max-w-[14ch]
            "
            style={{ fontWeight: 500 }}
          >
            Four practices.{" "}
            <span className="block italic text-foreground-muted">
              One standard.
            </span>
          </h2>

          <p className="mt-10 max-w-[40ch] font-sans text-[1.05rem] text-foreground-muted leading-[1.65]">
            We are organised as four practices because the work asks us to be —
            not because four sounds tidy on a slide. Each is run as if it were
            the firm.
          </p>
        </div>

        <ol className="col-span-12 lg:col-span-7 flex flex-col">
          {PRACTICES.map((p, i) => (
            <li key={p.roman}>
              <Link
                href={p.href}
                className="
                  group grid grid-cols-12 items-start gap-x-6
                  border-t border-border-subtle py-7
                  transition-colors hover:bg-surface-sunken/40
                  -mx-5 sm:-mx-8 lg:-mx-14
                  px-5 sm:px-8 lg:px-14
                "
              >
                <span
                  aria-hidden
                  className="
                    col-span-2 sm:col-span-1
                    font-serif italic text-ochre
                    text-[clamp(2.5rem,3.5vw,3.25rem)] leading-none
                    pt-1
                  "
                  style={{ fontWeight: 400 }}
                >
                  {p.roman}.
                </span>
                <div className="col-span-10 sm:col-span-11 grid grid-cols-12 gap-x-6 gap-y-3">
                  <h3
                    className="
                      col-span-12 md:col-span-5
                      font-serif text-[clamp(1.55rem,2.2vw,2rem)]
                      leading-[1.15] tracking-[-0.012em] text-foreground
                      transition-colors duration-500 group-hover:text-terracotta
                    "
                  >
                    {p.title}
                  </h3>
                  <p
                    className="
                      col-span-12 md:col-span-6 md:col-start-7
                      font-sans text-[0.95rem] leading-[1.65]
                      text-foreground-muted
                    "
                  >
                    {p.blurb}
                  </p>
                </div>
              </Link>
              {i === PRACTICES.length - 1 && (
                <div className="border-t border-border-subtle" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 4 — Voices                                                          */
/* -------------------------------------------------------------------------- */

function Voices({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section
      aria-labelledby="voices-heading"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-24 lg:py-40
      "
    >
      <HeritageImage
        src="/Cowry.jpeg"
        positionClassName="absolute right-0 top-1/2 -translate-y-1/2 w-[45vw] h-[85vh] max-h-[900px] -z-10"
        opacity={0.2}
        blendMode="screen"
        maskImage="radial-gradient(ellipse at right center, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)"
        sizes="45vw"
        objectPosition="right center"
        objectFit="contain"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Voices
        </p>
        <h2 id="voices-heading" className="sr-only">
          What clients say
        </h2>

        <div className="col-span-12 lg:col-span-9 mt-8 lg:mt-0 relative pb-20 lg:pb-0">
          <TestimonialCarousel items={testimonials} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 5 — From the desk (Insights preview)                                */
/* -------------------------------------------------------------------------- */

function FromTheDesk({ posts }: { posts: PostRow[] }) {
  const rows = posts.filter(
    (p): p is PostRow & { slug: string; title: string } =>
      Boolean(p.slug && p.title)
  );

  return (
    <section
      aria-labelledby="desk-heading"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-24 lg:py-40
      "
    >
      <header className="relative mb-16 lg:mb-20">
        <HeritageImage
          src="/fabric_7.avif"
          positionClassName="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-screen max-w-none -z-10"
          opacity={0.05}
          blendMode="screen"
          maskImage="radial-gradient(ellipse 70% 60% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)"
          sizes="100vw"
        />
        <div className="relative z-10 grid grid-cols-12 gap-x-6">
          <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
            From the desk
          </p>
          <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2
              id="desk-heading"
              className="
                font-serif font-optical-display leading-[0.95]
                text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.028em]
                text-foreground max-w-[20ch]
              "
              style={{ fontWeight: 500 }}
            >
              Notes <span className="italic text-foreground-muted">from the</span> practice.
            </h2>
            <Link
              href="/insights"
              className="
                group inline-flex items-baseline gap-2
                font-sans text-[0.9rem] tracking-wide text-foreground
                transition-colors hover:text-terracotta
                self-start lg:self-end
              "
            >
              <span className="border-b border-ochre/60 pb-0.5 transition-colors group-hover:border-terracotta">
                All insights
              </span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <ol className="flex flex-col">
        {rows.map((post) => {
          const { display, isoDay } = formatPublishDate(post.published_at);

          return (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                className="
                  group grid grid-cols-12 items-baseline gap-x-6 gap-y-3
                  border-t border-border-subtle py-8 lg:py-10
                  transition-colors
                "
              >
                <time
                  dateTime={isoDay || undefined}
                  className="
                    col-span-12 md:col-span-2
                    font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted
                  "
                >
                  {display || "—"}
                </time>

                <div className="col-span-12 md:col-span-7">
                  <h3
                    className="
                      font-serif text-[1.5rem] sm:text-[1.75rem] leading-[1.2]
                      text-foreground
                      transition-all duration-200 ease-out
                      group-hover:-translate-y-1 group-hover:text-terracotta
                    "
                  >
                    <span className="bg-[length:0%_1px] bg-gradient-to-r from-terracotta to-terracotta bg-no-repeat bg-left-bottom transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
                      {post.title}
                    </span>
                  </h3>
                  <p className="mt-3 font-sans text-foreground-muted leading-[1.6] max-w-[52ch]">
                    {(post.dek ?? "").trim()}
                  </p>
                </div>

                <p
                  className="
                    col-span-12 md:col-span-3 md:text-right
                    font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted
                  "
                >
                  —
                </p>
              </Link>
            </li>
          );
        })}
        <li className="border-t border-border-subtle" aria-hidden />
      </ol>
    </section>
  );
}
