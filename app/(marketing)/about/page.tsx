import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeritageImage } from "@/components/marketing/HeritageImage";
import { fetchTeam } from "@/lib/content/queries";
import type { TeamMemberRow } from "@/lib/content/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description:
    "TEK NAIJA LTD (RC 9181824) — a Lagos-headquartered technology firm. We hold a portfolio of owned software (LEGTEK NAIJA, LITIGATEIQ) and build software for the Nigerian institutions that need it built — courts, exporters, chambers.",
};

const FOUNDING_LEADERSHIP_FALLBACK: TeamMemberRow[] = [
  {
    name: "Sanctus Ojonimi Ejeh",
    role: "Managing Director / Founder",
    bio: "Founder of TEK NAIJA and the architect of the firm's posture. Trained in law and built in software; spent the years before TEK NAIJA writing the systems that he later refused to keep proprietary to a single client. Holds 100% PSC of the company and writes most of what is published on the desk.",
    headshot: null,
  },
  {
    name: "Joseph Ugbede Ejeh",
    role: "Director",
    bio: "Director with operational responsibility for the firm's commerce and trade engagements. The first to read a contract and the last to leave a deployment window. Carries the relationships with banking and clearing partners who keep cross-border trade actually moving.",
    headshot: null,
  },
  {
    name: "Benedict Ojimaojo Ukwenya",
    role: "Director",
    bio: "Director with focus on institutional engagements and governance. The internal voice that asks, in any new commission, whether we can build it well enough that we would still be proud of it in a decade. Almost always wins that argument.",
    headshot: null,
  },
];

export default async function AboutPage() {
  const team = await fetchTeam();
  const leadership = team.length > 0 ? team : FOUNDING_LEADERSHIP_FALLBACK;

  return (
    <>
      <Header />
      <Thesis />
      <Leadership members={leadership} sourcedFromCMS={team.length > 0} />
      <Record />
      <FooterCTA />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

function Header() {
  return (
    <header
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pt-24 lg:pt-40 pb-20 lg:pb-32
      "
    >
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
        About
      </p>

      <h1
        className="
          mt-6 font-serif font-optical-display
          text-[clamp(2.75rem,8vw,6.5rem)]
          leading-[0.96] tracking-[-0.014em]
          text-foreground max-w-[20ch]
        "
      >
        Built in Lagos, for the long horizon.
      </h1>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* I — Thesis                                                                  */
/* -------------------------------------------------------------------------- */

function Thesis() {
  return (
    <section
      aria-labelledby="thesis-heading"
      className="
        relative scroll-mt-24
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-20 lg:py-28
        border-t border-border-subtle
      "
    >
      <HeritageImage
        src="/female-figure-igala-nigeria.jpg"
        positionClassName="absolute right-0 top-0 h-full w-[55%] max-w-[620px] -z-10"
        opacity={0.18}
        blendMode="luminosity"
        maskImage="linear-gradient(to right, transparent 0%, transparent 8%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%), linear-gradient(to top, transparent 0%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,1) 100%)"
        maskComposite="intersect"
        sizes="(min-width: 1280px) 620px, 55vw"
        objectPosition="center top"
      />
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-3">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ochre">
            <span className="font-serif italic not-uppercase tracking-normal text-base text-ochre">
              I.
            </span>{" "}
            <span className="ml-3">Thesis</span>
          </p>
          <h2
            id="thesis-heading"
            className="mt-6 font-serif text-[1.75rem] leading-[1.15] text-foreground max-w-[18ch]"
          >
            Why TEK NAIJA exists.
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-9 lg:pl-10 max-w-prose">
          <p
            className="
              font-serif text-foreground leading-[1.55]
              text-[1.2rem] sm:text-[1.3rem]
              [&::first-letter]:float-left [&::first-letter]:mr-3
              [&::first-letter]:font-serif [&::first-letter]:font-bold
              [&::first-letter]:text-terracotta
              [&::first-letter]:text-[5.5rem] sm:[&::first-letter]:text-[6.5rem]
              [&::first-letter]:leading-[0.85]
              [&::first-letter]:mt-1
            "
          >
            Nigeria does not, on the whole, have a software credibility
            problem; it has a software seriousness problem. There is no
            shortage of capable engineers and no shortage of demanding
            institutions. What has been missing — for most of the last decade —
            is a firm that takes the work seriously enough to run it like a
            firm. To write standards. To pick its commissions. To refuse the
            ones it should refuse. To carry the names of the people who built
            the system on the system itself.
          </p>

          <p className="mt-6 font-sans text-foreground-muted leading-[1.7] text-[1.05rem]">
            TEK NAIJA was incorporated on the 8th of January, 2026, under the
            Companies and Allied Matters Act, 2020, with that gap as its
            opening statement. The principal activity is, in the language of
            the Federal registry, "Software Development and Solutions." In our
            own language: the digital infrastructure that institutions choose
            to run on. Our flagship — LEGTEK NAIJA — is the proof of method:
            nineteen procedural parts, one hundred and two articles, real-time
            transcription, multi-role hearing-room infrastructure, deployed
            and live. STK Industries, our trade arm, is the proof in another
            register: agricultural commodities moving from Apapa to
            Felixstowe, with documentation customs in two jurisdictions are
            willing to stamp.
          </p>

          <p className="mt-6 font-sans text-foreground-muted leading-[1.7] text-[1.05rem]">
            We are headquartered in Lagos. Our team is roughly ten in-house;
            several hundred operate virtually across the federation. Our work
            spans four practices — justice, commerce, institutional, AI — and
            we treat each as if it were the firm. We were not founded to
            chase a generation of products; we were founded to ship
            infrastructure that outlives the cycle that produced it.
          </p>

          <p className="mt-6 font-sans text-foreground-muted leading-[1.7] text-[1.05rem]">
            That is the thesis. Everything else on this page is the record
            against which to measure it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* II — Leadership                                                             */
/* -------------------------------------------------------------------------- */

function Leadership({
  members,
  sourcedFromCMS,
}: {
  members: TeamMemberRow[];
  sourcedFromCMS: boolean;
}) {
  return (
    <section
      aria-labelledby="leadership-heading"
      className="
        relative scroll-mt-24
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-20 lg:py-28
        border-t border-border-subtle
      "
    >
      {/* Aso-oke / Ankara wash behind the masthead — full bleed, soft. */}
      <HeritageImage
        src="/fabric_5.jpg"
        positionClassName="absolute left-1/2 -translate-x-1/2 top-0 h-full w-screen max-w-none -z-10"
        opacity={0.05}
        blendMode="luminosity"
        maskImage="radial-gradient(ellipse 75% 60% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)"
        sizes="100vw"
      />
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-3">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ochre">
            <span className="font-serif italic not-uppercase tracking-normal text-base text-ochre">
              II.
            </span>{" "}
            <span className="ml-3">Leadership</span>
          </p>
          <h2
            id="leadership-heading"
            className="mt-6 font-serif text-[1.75rem] leading-[1.15] text-foreground max-w-[18ch]"
          >
            The masthead.
          </h2>
        </div>

        <ol className="col-span-12 lg:col-span-9 lg:pl-10 flex flex-col">
          {members.map((m, i) => {
            if (!m.name) return null;
            return (
              <li key={m.name + i}>
                <article
                  className="
                    grid grid-cols-12 gap-x-6 gap-y-6
                    border-t border-border-subtle py-10 lg:py-12
                  "
                >
                  <div className="col-span-12 md:col-span-3">
                    <Headshot src={m.headshot ?? null} name={m.name} />
                  </div>
                  <div className="col-span-12 md:col-span-9 flex flex-col gap-3">
                    <h3 className="font-serif text-[1.75rem] sm:text-[2rem] leading-[1.05] text-foreground">
                      {m.name}
                    </h3>
                    {m.role && (
                      <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ochre">
                        {m.role}
                      </p>
                    )}
                    {m.bio && (
                      <p className="mt-2 max-w-[60ch] font-sans text-foreground-muted leading-[1.7]">
                        {m.bio}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
          <li className="border-t border-border-subtle" aria-hidden />
        </ol>
      </div>

      {!sourcedFromCMS && (
        <p className="mt-10 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted/70">
          // Founding leadership shown until the team_members table is
          populated.
        </p>
      )}
    </section>
  );
}

function Headshot({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <figure
        className="
          relative aspect-square w-full max-w-[220px]
          overflow-hidden border border-ochre/60 bg-ink-deep
          [&_img]:[filter:grayscale(100%)_contrast(1.05)_sepia(0)]
        "
      >
        <Image src={src} alt="" fill sizes="220px" className="object-cover mix-blend-luminosity" />
        <span aria-hidden className="absolute inset-0 bg-indigo/30 mix-blend-multiply" />
      </figure>
    );
  }
  // Initial monogram placeholder (no fabricated portrait)
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      aria-hidden
      className="
        relative aspect-square w-full max-w-[220px]
        border border-ochre/60 bg-indigo
        flex items-center justify-center
      "
    >
      <span className="font-serif font-optical-display text-[clamp(3rem,8vw,4.5rem)] text-ivory">
        {initials || "—"}
      </span>
      <span
        aria-hidden
        className="absolute bottom-2 right-3 font-mono text-[0.55rem] tracking-[0.22em] uppercase text-foreground-muted/70"
      >
        // headshot pending
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* III — Record                                                                */
/* -------------------------------------------------------------------------- */

function Record() {
  const items: { label: string; value: string }[] = [
    { label: "Registered name", value: "TEK NAIJA LIMITED" },
    { label: "RC number", value: "9181824" },
    { label: "Date of incorporation", value: "8 January 2026" },
    { label: "Principal activity", value: "Software Development and Solutions" },
    { label: "Registered office", value: "5 Bauchi Link Street, Apapa, Lagos" },
    { label: "Jurisdiction", value: "Federal Republic of Nigeria" },
    { label: "Statute", value: "CAMA 2020" },
  ];

  return (
    <section
      aria-labelledby="record-heading"
      className="
        relative scroll-mt-24
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-20 lg:py-28
        border-t border-border-subtle
      "
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-3">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ochre">
            <span className="font-serif italic not-uppercase tracking-normal text-base text-ochre">
              III.
            </span>{" "}
            <span className="ml-3">Record</span>
          </p>
          <h2
            id="record-heading"
            className="mt-6 font-serif text-[1.75rem] leading-[1.15] text-foreground max-w-[18ch]"
          >
            The registration, set down honestly.
          </h2>
          <p className="mt-6 max-w-[36ch] font-sans text-foreground-muted leading-[1.65]">
            We publish the record because the record is the trust signal. If
            it does not stand up, nothing else we say should.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-9 lg:pl-10">
          <dl className="grid grid-cols-1 sm:grid-cols-2 border-t border-border-subtle">
            {items.map((it) => (
              <div
                key={it.label}
                className="
                  border-b border-border-subtle py-6 sm:px-6 first:sm:pl-0
                  flex flex-col gap-2
                "
              >
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ochre">
                  {it.label}
                </dt>
                <dd className="font-mono text-[1rem] text-foreground">
                  {it.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FooterCTA() {
  return (
    <section
      aria-label="Begin a conversation"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-24 lg:py-40
        border-t border-border-subtle
      "
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        <p
          className="
            col-span-12 lg:col-span-9
            font-serif italic
            text-[clamp(1.5rem,3vw,2.25rem)]
            leading-[1.4] text-foreground max-w-[40ch]
          "
        >
          “We build from Nigerian reality outward — not from a foreign template inward.”
          <span className="block mt-3 not-italic font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
            Sanctus Ojonimi Ejeh
            <span aria-hidden className="mx-2 text-ochre">/</span>
            Managing Director
          </span>
        </p>
        <div className="col-span-12 lg:col-span-3 flex lg:justify-end items-end">
          <Link
            href="/contact"
            className="
              group inline-flex items-baseline gap-2
              font-sans text-[1rem] tracking-wide text-foreground
              transition-colors hover:text-terracotta
            "
          >
            <span className="border-b border-ochre/60 pb-1 transition-colors group-hover:border-terracotta">
              Begin a conversation
            </span>
            <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
