import type { Metadata } from "next";
import Link from "next/link";
import { HeritageImage } from "@/components/marketing/HeritageImage";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Four practices, one standard. Justice & regulatory technology, commerce & trade platforms, institutional software, and applied AI infrastructure.",
};

type Practice = {
  roman: string;
  id: string;
  title: string;
  kicker: string;
  paragraphs: string[];
  outputs: string[];
  clients: string;
};

const PRACTICES: Practice[] = [
  {
    roman: "I",
    id: "justice",
    title: "Justice & Regulatory Technology",
    kicker:
      "Procedural systems for the practice of law in a federal jurisdiction.",
    paragraphs: [
      "We build the software that the resolution of disputes actually runs on. Procedural rules treated as a system specification, not as a marketing brochure. Hearing-room infrastructure that survives a public proceeding and a power cut in the same week. Multi-role case management with the role definitions written by people who have sat in chambers; not invented in a sprint planning meeting.",
      "Our work in this practice begins from the assumption that a serious legal system in Nigeria deserves serious software, and that the gap between those two facts is closed by sitting with arbitrators, counsel, and case managers until you understand what they are actually doing. Then you write the platform that does it.",
    ],
    outputs: [
      "End-to-end arbitration platforms (party, neutral, counsel, case manager, financial administrator).",
      "Real-time hearing infrastructure with transcription, role gating, and submission-grade exhibit management.",
      "Procedural-rule engines: machine-readable expression of articles, parts, schedules.",
    ],
    clients:
      "Arbitral institutions, dispute-resolution centres, regulators, and the chambers and firms that work with them.",
  },
  {
    roman: "II",
    id: "commerce",
    title: "Commerce & Trade Platforms",
    kicker:
      "Marketplaces and B2B trade rails built for Nigerian commercial reality.",
    paragraphs: [
      "We build trade software that respects two facts at once: the way Nigerian commerce actually moves, and the standards foreign customs actually require. KYC and counterparty verification that hold up to scrutiny. Request-for-quote and payment rails that work when the bank rails do not. Export documentation that customs in two jurisdictions are willing to stamp.",
      "Inventory is reconciled at SKU level. Margins are visible from origin to wharf. Operators can do their job without leaving the platform; auditors can read the trail without asking for a spreadsheet. The discipline here is the same as in the justice practice — documentation as infrastructure.",
    ],
    outputs: [
      "Multi-party B2B marketplaces with KYC, RFQ, and reconciled payment flows.",
      "Export operations consoles: documentation pipelines, customs interfaces, route management.",
      "Inventory and merchandising platforms with SKU-grade financial reporting.",
    ],
    clients:
      "Trading houses, agricultural exporters, holding companies, and the banks and clearing partners that finance them.",
  },
  {
    roman: "III",
    id: "institutional",
    title: "Institutional Software & Workflow Systems",
    kicker:
      "Internal platforms for institutions that have outgrown their spreadsheets.",
    paragraphs: [
      "Most Nigerian institutions of any consequence still run on spreadsheets and goodwill. Our institutional practice exists for the moment when that is no longer enough — when an organisation has the work to justify a system, the appetite to commission one, and a leadership team patient enough to let it be built properly.",
      "These engagements are slower and quieter than the others. They produce internal tools, regulatory consoles, board-level dashboards, and the unglamorous workflow systems that, once installed, simply work — and continue to work for a decade. We treat them as the infrastructure they are.",
    ],
    outputs: [
      "Operational consoles for ministries, regulators, and statutory bodies.",
      "Holding-company portfolio dashboards with subsidiary-level operational depth.",
      "Bespoke workflow systems: case intake, approvals, reporting, audit trails.",
    ],
    clients:
      "Federal and state institutions, holding companies, regulated financial entities, and large family enterprises.",
  },
  {
    roman: "IV",
    id: "ai",
    title: "Applied AI & Data Infrastructure",
    kicker:
      "Retrieval, transcription, and the data plumbing AI silently depends on.",
    paragraphs: [
      "We use AI where it earns its keep: real-time transcription of multi-speaker hearings, retrieval against the Nigerian Weekly Law Reports, document review at the volume contemporary commercial cases now demand, and intake summarisation that does not lose the substance of the matter. We do not use it to write our own copy.",
      "Underneath every applied AI feature in our portfolio is a data infrastructure we built ourselves: ingest, normalisation, storage, embeddings, evaluation harnesses, observability. The model is the visible part. The pipeline is the work.",
    ],
    outputs: [
      "Retrieval-augmented systems for legal research, regulatory compliance, and submission drafting.",
      "Real-time speech infrastructure (transcription, role attribution, transcript governance).",
      "Document-understanding pipelines: ingest, classification, extraction, evaluation.",
    ],
    clients:
      "Law firms and chambers, financial institutions, regulators, and the technology teams inside larger enterprises.",
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <Header />
      <Index />
      {PRACTICES.map((p, i) => (
        <PracticeSection
          key={p.id}
          practice={p}
          isLast={i === PRACTICES.length - 1}
          decoration={
            p.id === "ai" ? (
              <HeritageImage
                src="/fabric_6.avif"
                positionClassName="absolute inset-0 -z-10"
                opacity={0.06}
                blendMode="screen"
                maskImage="radial-gradient(ellipse 75% 65% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)"
                sizes="100vw"
              />
            ) : null
          }
        />
      ))}
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
      <HeritageImage
        src="/Tusk.jpeg"
        positionClassName="absolute left-1/2 -translate-x-1/2 top-0 h-full w-screen max-w-none -z-10"
        opacity={0.10}
        blendMode="luminosity"
        maskImage="radial-gradient(ellipse 70% 45% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 70%, transparent 100%)"
        sizes="100vw"
        objectPosition="center"
      />
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
        Capabilities
      </p>

      <h1
        className="
          mt-6 font-serif font-optical-display
          text-[clamp(2.75rem,8vw,6.5rem)]
          leading-[0.96] tracking-[-0.014em]
          text-foreground max-w-[16ch]
        "
      >
        Four practices.{" "}
        <span className="block italic text-foreground-muted">
          One standard.
        </span>
      </h1>

      <p className="mt-10 max-w-[60ch] font-sans text-foreground-muted leading-[1.65] text-[1.05rem]">
        We are organised as four practices because the work asks us to be — not
        because four sounds tidy on a slide. Each is run as if it were the
        firm: lead engineers, internal review, written standards. The list
        below is the whole list.
      </p>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Anchored index                                                              */
/* -------------------------------------------------------------------------- */

function Index() {
  return (
    <nav
      aria-label="Practice index"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pb-20 lg:pb-32
      "
    >
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PRACTICES.map((p) => (
          <li key={p.id}>
            <Link
              href={`#${p.id}`}
              className="
                group flex items-baseline gap-4
                border-t border-border-subtle py-6
                font-mono text-[0.75rem] tracking-[0.18em] uppercase
                text-foreground-muted
                transition-colors hover:text-foreground
              "
            >
              <span className="font-serif italic not-uppercase text-ochre text-base tracking-normal">
                {p.roman}.
              </span>
              <span className="leading-[1.4]">{p.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Section per practice                                                        */
/* -------------------------------------------------------------------------- */

function PracticeSection({
  practice,
  isLast,
  decoration,
}: {
  practice: Practice;
  isLast: boolean;
  decoration?: React.ReactNode;
}) {
  return (
    <section
      id={practice.id}
      aria-labelledby={`${practice.id}-heading`}
      className="
        relative scroll-mt-24
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        py-24 lg:py-40
        border-t border-border-subtle
      "
    >
      {decoration}
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-baseline gap-6">
            <span
              aria-hidden
              className="
                font-serif italic text-ochre
                text-[clamp(3rem,5vw,4.5rem)] leading-none
              "
            >
              {practice.roman}.
            </span>
            <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-foreground-muted">
              Practice {practice.roman}
            </p>
          </div>

          <h2
            id={`${practice.id}-heading`}
            className="
              mt-8 font-serif font-optical-display
              text-[clamp(2rem,4.4vw,3.25rem)]
              leading-[1.05] tracking-[-0.012em]
              text-foreground max-w-[18ch]
            "
          >
            {practice.title}
          </h2>

          <p className="mt-6 max-w-[40ch] font-serif italic text-foreground-muted text-[1.15rem] leading-[1.5]">
            {practice.kicker}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:pl-10 flex flex-col gap-6">
          {practice.paragraphs.map((para, i) => (
            <p
              key={i}
              className="
                font-sans text-foreground-muted leading-[1.7]
                text-[1.05rem] sm:text-[1.1rem]
                max-w-prose
              "
            >
              {para}
            </p>
          ))}

          <div className="mt-8 border-t border-border-subtle pt-6">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ochre mb-4">
              Representative outputs
            </p>
            <ol className="flex flex-col">
              {practice.outputs.map((output, i) => (
                <li
                  key={i}
                  className="
                    flex gap-4 border-t border-border-subtle py-4
                    font-sans text-[0.95rem] leading-[1.6] text-foreground
                  "
                >
                  <span aria-hidden className="font-mono text-ochre text-[0.75rem] mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{output}</span>
                </li>
              ))}
              <li className="border-t border-border-subtle" aria-hidden />
            </ol>
          </div>

          <p className="mt-4 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted leading-[1.6]">
            Clients —{" "}
            <span className="text-foreground normal-case tracking-normal font-sans text-[0.95rem]">
              {practice.clients}
            </span>
          </p>
        </div>
      </div>

      {!isLast && (
        <p
          aria-hidden
          className="mt-20 lg:mt-32 text-center font-serif italic text-foreground-muted/60"
        >
          *
        </p>
      )}
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
        <h2
          className="
            col-span-12 lg:col-span-9
            font-serif font-optical-display italic
            text-[clamp(2rem,5vw,3.75rem)]
            leading-[1.05] tracking-[-0.012em]
            text-foreground max-w-[22ch]
          "
        >
          If your institution has work in any of these registers — write.
        </h2>
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
