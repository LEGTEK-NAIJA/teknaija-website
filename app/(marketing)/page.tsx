import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AdireGround } from "@/components/motifs/AdireGround";
import { AsoOkeDivider } from "@/components/motifs/AsoOkeDivider";
import { Ejubejuailo } from "@/components/motifs/Ejubejuailo";
import { CaseRow } from "@/components/marketing/CaseRow";
import {
  TestimonialCarousel,
  type Testimonial,
} from "@/components/marketing/TestimonialCarousel";

export const metadata: Metadata = {
  title:
    "TEK NAIJA — We build the systems Nigeria runs on.",
  description:
    "TEK NAIJA is a Lagos-headquartered technology holding company shipping sovereign-grade software for justice, commerce, and the institutions of a continent in motion.",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function delayStyle(ms: number): CSSProperties {
  return { ["--anim-delay" as string]: `${ms}ms` } as CSSProperties;
}

const HEADLINE_WORDS = ["We", "build", "the", "systems", "Nigeria", "runs", "on."];
const STAGGER_MS = 60;
const HEADLINE_TAIL_MS =
  STAGGER_MS * (HEADLINE_WORDS.length - 1); // last word starts to enter
const UNDERLINE_DELAY_MS = HEADLINE_TAIL_MS + 700; // after last word lands
const SUBHEAD_DELAY_MS = HEADLINE_TAIL_MS + 200;
const FOOTNOTE_DELAY_MS = HEADLINE_TAIL_MS + 600;

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      <Hero />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <SelectedWork />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <CapabilitiesPreview />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <Voices />
      <AsoOkeDivider className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14" />
      <FromTheDesk />
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
      {/*
        Layer order matters — DOM order = paint order (no explicit z-index on
        any of these so each child remains in the section's stacking context
        and its blend mode resolves against the cumulative backdrop):
          1. Ejubejuailo  — luminosity-blended mask
          2. Indigo wash  — #0B0E1A at 35% to unify the canvas
          3. AdireGround  — circles flow over the entire width on top
      */}
      <Ejubejuailo />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/35"
      />
      <AdireGround />

      {/* Editorial grid: headline bleeds 1 column into the gutter */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-[1440px]
          flex-1 flex flex-col justify-center
          px-5 sm:px-8 lg:px-14
          pt-12 pb-32
        "
      >
        <div className="grid grid-cols-12 gap-x-6">
          <p
            className="
              col-span-12 lg:col-span-9 lg:col-start-2 lg:-ml-[8.333%]
              anim-fade
              font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre
              mb-8 lg:mb-12
            "
            style={delayStyle(0)}
          >
            <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
            A Lagos technology holding company
          </p>

          <h1
            className="
              col-span-12 lg:col-span-10 lg:col-start-2 lg:-ml-[8.333%]
              font-serif font-optical-display
              text-foreground
              text-[clamp(2.75rem,12vw,9rem)]
              leading-[0.92] tracking-[-0.015em]
            "
          >
            <span className="block">
              {HEADLINE_WORDS.map((word, i) => {
                const isAccent = word === "Nigeria";
                return (
                  <RisingWord key={i} delayMs={i * STAGGER_MS} accent={isAccent}>
                    {word}
                  </RisingWord>
                );
              })}
            </span>
          </h1>

          <p
            className="
              col-span-12 lg:col-span-7 lg:col-start-2 lg:-ml-[8.333%]
              anim-rise
              mt-12 lg:mt-16
              font-sans text-foreground-muted
              text-[1.05rem] sm:text-[1.18rem] lg:text-[1.25rem]
              leading-[1.6] max-w-subhead
            "
            style={delayStyle(SUBHEAD_DELAY_MS)}
          >
            Like Adire — every thread placed with intent. Like Achi — every
            layer built to last. We are a Lagos technology company shipping
            software infrastructure for justice, commerce, and the
            institutions a continent is still building. Precise. Permanent.
            Nigerian.
          </p>
        </div>
      </div>

      {/* Bottom of viewport — the "infrastructure tell" */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-[1440px]
          px-5 sm:px-8 lg:px-14
          pb-8 lg:pb-12
          anim-fade
        "
        style={delayStyle(FOOTNOTE_DELAY_MS)}
      >
        <p
          className="
            font-mono text-[0.7rem] sm:text-[0.75rem]
            tracking-[0.18em] uppercase text-foreground-muted
            flex flex-wrap items-center gap-x-3 gap-y-1
          "
        >
          <span>Incorporated 08.01.2026</span>
          <span aria-hidden className="text-ochre">—</span>
          <span>Lagos, Nigeria</span>
          <span aria-hidden className="text-ochre">—</span>
          <span>Active across 4 sectors</span>
        </p>
      </div>
    </section>
  );
}

function RisingWord({
  children,
  delayMs,
  accent,
}: {
  children: React.ReactNode;
  delayMs: number;
  accent?: boolean;
}) {
  return (
    <span
      className="inline-block overflow-hidden align-baseline mr-[0.25em] last:mr-0"
      style={{ paddingBottom: "0.08em" }}
    >
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

function SelectedWork() {
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
      <header className="grid grid-cols-12 gap-x-6 mb-16 lg:mb-24">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Selected work
        </p>
        <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0">
          <h2
            id="work-heading"
            className="
              font-serif font-optical-display leading-[1.02]
              text-[clamp(2rem,4.4vw,3.5rem)] tracking-[-0.01em]
              text-foreground max-w-[20ch]
            "
          >
            The proof is what we ship.
          </h2>
          <p className="mt-6 max-w-[52ch] font-sans text-foreground-muted leading-[1.65]">
            Three engagements that describe the bar of the practice — one in
            production, one in trade, one in build. The portfolio is small on
            purpose; the work is not.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-24 lg:gap-40">
        <CaseRow
          index={1}
          sector="JUSTICE INFRASTRUCTURE"
          title="LEGTEK NAIJA"
          scriptSubtitle="Èkó / sovereign dispute resolution"
          status="Live"
          href="/work/legtek-naija"
          variant="justice"
          body="A digital architecture for the resolution of disputes. Nineteen procedural parts, one hundred and two articles, real-time transcription via Gemini Live, and a multi-role case management system spanning Party, Counsel, Neutral, Case Manager, and Financial Administrator. Built so that arbitration in Nigeria can convene in a hearing room or a browser tab — without losing the gravity of either."
          meta={[
            { label: "Sector", value: "Justice & Regulatory" },
            { label: "Status", value: "Live · legtek.ng" },
            { label: "Procedural parts", value: "19" },
            { label: "Articles", value: "102" },
          ]}
        />

        <CaseRow
          index={2}
          sector="TRADE & COMMERCE"
          title="STK INDUSTRIES"
          scriptSubtitle="Apapa / Felixstowe trade lane"
          status="Active"
          href="/work/stk-industries"
          variant="commerce"
          reverse
          body="Trade infrastructure for Nigerian agricultural commodities — baking essentials, poultry, yam to the United Kingdom. The platform handles the full cycle: KYC and counterparty verification, request-for-quote, payment rails, and the export documentation that customs in two jurisdictions actually want to see. Inventory is reconciled at SKU level; margins are visible from origin to wharf."
          meta={[
            { label: "Sector", value: "Commerce & Export" },
            { label: "Status", value: "Active · trading" },
            { label: "Trade lane", value: "NG → UK" },
            { label: "Catalogue", value: "Multi-SKU" },
          ]}
        />

        <CaseRow
          index={3}
          sector="LEGAL INTELLIGENCE"
          title="LITIGATEIQ"
          scriptSubtitle="Forthcoming / private beta"
          status="Forthcoming"
          href="/work/litigateiq"
          variant="forthcoming"
          body="An evidentiary intelligence layer for Nigerian litigation. Document review at the volume contemporary commercial cases now demand, precedent retrieval against the Nigerian Weekly Law Reports, and submission-grade citation tooling built around how lead counsel actually work in chambers. Currently in private development with anchor firms in Lagos and Abuja."
          meta={[
            { label: "Sector", value: "Legal AI" },
            { label: "Status", value: "Private beta" },
            { label: "Cohort", value: "Lagos / Abuja" },
            { label: "Release", value: "TBA" },
          ]}
        />
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
          <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre mb-6">
            What we build
          </p>
          <h2
            id="capabilities-heading"
            className="
              font-serif font-optical-display
              text-[clamp(2.25rem,4.6vw,4rem)]
              leading-[1.02] tracking-[-0.012em]
              text-foreground max-w-[14ch]
            "
          >
            Four practices.{" "}
            <span className="block italic text-foreground-muted">
              One standard.
            </span>
          </h2>

          <p className="mt-8 max-w-[40ch] font-sans text-foreground-muted leading-[1.65]">
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
                    text-[1.5rem] sm:text-[1.75rem] leading-none
                    pt-1
                  "
                >
                  {p.roman}.
                </span>
                <div className="col-span-10 sm:col-span-11 grid grid-cols-12 gap-x-6 gap-y-3">
                  <h3
                    className="
                      col-span-12 md:col-span-5
                      font-serif text-[1.4rem] sm:text-[1.55rem]
                      leading-[1.2] text-foreground
                      transition-colors group-hover:text-terracotta
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

// TODO(CLAUDE.md §7): Replace with real, named testimonials from clients.
// Seeded with abstracted institutional roles (no fabricated identities)
// pending attribution sign-off from anchor partners.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "TEK NAIJA built us infrastructure that survives a power cut and a public hearing in the same week. That is the bar in this market, and they meet it.",
    author: "Senior Counsel",
    role: "Commercial Practice",
    org: "Lagos chambers",
  },
  {
    quote:
      "They write code the way good lawyers write submissions: with discipline, with citations, and with the discipline of knowing what to leave out.",
    author: "Director",
    role: "Regulatory Affairs",
    org: "Federal partner",
  },
  {
    quote:
      "Nigerian software has had a credibility deficit for a decade. This is the team closing it.",
    author: "Managing Partner",
    role: "Investment Office",
    org: "West Africa",
  },
];

function Voices() {
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
      <div className="grid grid-cols-12 gap-x-6">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Voices
        </p>
        <h2 id="voices-heading" className="sr-only">
          What clients say
        </h2>

        <div className="col-span-12 lg:col-span-9 mt-8 lg:mt-0 relative pb-20 lg:pb-0">
          <TestimonialCarousel items={TESTIMONIALS} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 5 — From the desk (Insights preview)                                */
/* -------------------------------------------------------------------------- */

// TODO(CLAUDE.md §7): Replace with live posts from the Supabase `posts` table
// once the CMS lands. Slugs follow the literal /insights/[slug] route.
const RECENT_POSTS = [
  {
    slug: "nigerian-dispute-resolution-architecture",
    title: "Why Nigerian dispute resolution needs its own architecture",
    dek: "The case for treating procedural rules as a system specification — and why most platforms get this exactly backwards.",
    date: "April 22, 2026",
    dateISO: "2026-04-22",
    author: "Sanctus Ojonimi Ejeh",
  },
  {
    slug: "building-for-the-slow-internet",
    title: "Building for the slow internet",
    dek: "Performance budgets are a Lagos question before they are a Vercel question. A note on the discipline of building for everywhere.",
    date: "March 15, 2026",
    dateISO: "2026-03-15",
    author: "Joseph Ugbede Ejeh",
  },
  {
    slug: "on-sovereignty-and-software",
    title: "On sovereignty and software",
    dek: "If the institutions of a continent in motion are going to run on software, the software has to be built for them — not adapted to them.",
    date: "February 8, 2026",
    dateISO: "2026-02-08",
    author: "Sanctus Ojonimi Ejeh",
  },
] as const;

function FromTheDesk() {
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
      <header className="grid grid-cols-12 gap-x-6 mb-16 lg:mb-20">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          From the desk
        </p>
        <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="desk-heading"
            className="
              font-serif font-optical-display leading-[1.02]
              text-[clamp(2rem,4.4vw,3.5rem)] tracking-[-0.01em]
              text-foreground max-w-[20ch]
            "
          >
            Notes from the practice.
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
      </header>

      <ol className="flex flex-col">
        {RECENT_POSTS.map((post) => (
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
                dateTime={post.dateISO}
                className="
                  col-span-12 md:col-span-2
                  font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted
                "
              >
                {post.date}
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
                  {post.dek}
                </p>
              </div>

              <p
                className="
                  col-span-12 md:col-span-3 md:text-right
                  font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted
                "
              >
                {post.author}
              </p>
            </Link>
          </li>
        ))}
        <li className="border-t border-border-subtle" aria-hidden />
      </ol>
    </section>
  );
}
