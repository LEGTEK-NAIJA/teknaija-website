import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HeritageImage } from "@/components/marketing/HeritageImage";
import {
  fetchProjectBySlug,
  fetchProjectSlugs,
} from "@/lib/content/queries";
import { asLabelValueList } from "@/lib/content/format";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await fetchProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project?.title) {
    return { title: { absolute: "Case study — TEK NAIJA" } };
  }
  const description =
    (project.body ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160) || undefined;

  return {
    title: { absolute: `${project.title} — TEK NAIJA` },
    description,
    openGraph: {
      title: project.title ?? undefined,
      description,
      images: [
        {
          url: `https://teknaija.legtek.ng/api/og?title=${encodeURIComponent(project.title ?? "TEK NAIJA")}&eyebrow=${encodeURIComponent("WORK · TEK NAIJA")}&subtitle=${encodeURIComponent(description ?? "")}`,
          width: 1200,
          height: 630,
          alt: project.title ?? "TEK NAIJA case study",
        },
      ],
    },
  };
}

export default async function ProjectCasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();

  const stack = asLabelValueList(project.stack);
  const outcomes = asLabelValueList(project.outcomes);
  const gallery = Array.isArray(project.gallery_images)
    ? (project.gallery_images.filter(
        (g): g is string => typeof g === "string"
      ) as string[])
    : [];

  return (
    <article>
      <Cover
        title={project.title ?? "Untitled"}
        sector={project.sector ?? null}
        status={project.status ?? null}
        cover={project.cover_image ?? null}
      />
      <Brief body={project.body ?? ""} />
      {stack.length > 0 && <StackPanel stack={stack} />}
      {outcomes.length > 0 && <Outcomes outcomes={outcomes} />}
      {gallery.length > 0 && <Gallery title={project.title ?? ""} images={gallery} />}
      <FooterCTA />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Cover                                                                       */
/* -------------------------------------------------------------------------- */

function displayStatus(status: string | null): string {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "live") return "Live · production";
  if (s === "active") return "Active · trading";
  if (s === "private_beta") return "Private beta · cohort";
  if (s === "forthcoming") return "In development";
  if (s === "archived") return "Archived";
  return status;
}

function Cover({
  title,
  sector,
  status,
  cover,
}: {
  title: string;
  sector: string | null;
  status: string | null;
  cover: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <section
      aria-label={`${title} — cover`}
      className="
        relative isolate overflow-hidden
        min-h-[80dvh]
        flex items-end
        bg-ink-deep
      "
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div aria-hidden className="absolute inset-0">
          <CoverArt />
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      <div
        className="
          relative z-10
          mx-auto w-full max-w-[1440px]
          px-5 sm:px-8 lg:px-14
          pb-12 lg:pb-20
          flex flex-col gap-8
        "
      >
        <div className="font-mono text-[0.7rem] sm:text-[0.75rem] tracking-[0.18em] uppercase text-foreground-muted flex flex-wrap items-center gap-x-3 gap-y-1">
          {sector && <span>{sector}</span>}
          {sector && <span aria-hidden className="text-ochre">—</span>}
          <span>{year}</span>
          {status && (
            <>
              <span aria-hidden className="text-ochre">—</span>
              <span className="text-foreground">{displayStatus(status)}</span>
            </>
          )}
        </div>

        <h1
          className="
            font-serif font-optical-display
            text-[clamp(2.75rem,11vw,8rem)]
            leading-[0.92] tracking-[-0.018em]
            text-foreground max-w-[16ch]
          "
        >
          {title}
        </h1>
      </div>
    </section>
  );
}

function CoverArt() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="cover-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0e1430" />
          <stop offset="100%" stopColor="#060814" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#cover-bg)" />
      <g stroke="#d9a441" strokeOpacity="0.2">
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={(i / 23) * 1600} y1="0" x2={(i / 23) * 1600} y2="900" strokeWidth="0.7" />
        ))}
      </g>
      <g fill="#c8553d" opacity="0.45">
        <circle cx="1100" cy="540" r="220" />
      </g>
      <g fill="none" stroke="#d9a441" strokeOpacity="0.6">
        <circle cx="1100" cy="540" r="220" />
        <circle cx="1100" cy="540" r="172" />
        <circle cx="1100" cy="540" r="124" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Brief                                                                       */
/* -------------------------------------------------------------------------- */

function Brief({ body }: { body: string }) {
  if (!body.trim()) return null;
  return (
    <section
      aria-label="The brief"
      className="
        relative
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pt-24 lg:pt-40
      "
    >
      <div className="grid grid-cols-12 gap-x-6">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          The brief
        </p>
        <div
          className="
            col-span-12 lg:col-span-9 mt-6 lg:mt-0
            font-serif text-foreground leading-[1.55]
            text-[1.2rem] sm:text-[1.35rem]
            max-w-prose
            [&>*+*]:mt-6
            [&_h2]:font-serif [&_h2]:text-[2rem] [&_h2]:mt-12 [&_h2]:mb-3
            [&_h3]:font-serif [&_h3]:text-[1.5rem] [&_h3]:mt-10 [&_h3]:mb-2 [&_h3]:text-foreground
            [&_p]:font-serif
            [&_strong]:text-foreground
            [&_em]:italic
            [&_a]:text-foreground [&_a]:underline [&_a]:decoration-ochre/60 [&_a]:underline-offset-4 hover:[&_a]:decoration-terracotta
            [&_code]:font-mono [&_code]:text-[0.95em] [&_code]:text-ochre
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Stack panel — JetBrains Mono on indigo                                      */
/* -------------------------------------------------------------------------- */

function StackPanel({ stack }: { stack: { label: string; value: string }[] }) {
  return (
    <section
      aria-labelledby="stack-heading"
      className="
        relative mt-24 lg:mt-40
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
      "
    >
      <div className="grid grid-cols-12 gap-x-6 mb-10">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Architecture
        </p>
        <h2
          id="stack-heading"
          className="
            col-span-12 lg:col-span-9 mt-4 lg:mt-0
            font-serif font-optical-display
            text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.012em]
            text-foreground max-w-[24ch]
          "
        >
          The stack, set down honestly.
        </h2>
      </div>

      <div className="relative isolate bg-indigo border-y border-ochre/60">
        <HeritageImage
          src="/fabric_3.avif"
          positionClassName="absolute inset-0 -z-10"
          opacity={0.08}
          blendMode="luminosity"
          maskImage="radial-gradient(ellipse 80% 70% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, transparent 100%)"
          sizes="100vw"
          objectPosition="center"
        />
        <dl
          className="
            mx-auto max-w-[1440px]
            px-5 sm:px-8 lg:px-14
            py-10 lg:py-14
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            divide-y sm:divide-y-0 sm:divide-x divide-ochre/30
          "
        >
          {stack.map((s, i) => (
            <div
              key={s.label + i}
              className="
                py-5 sm:py-2
                sm:px-6 first:sm:pl-0 last:sm:pr-0
                flex flex-col gap-2
              "
            >
              <dt className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ochre">
                {s.label}
              </dt>
              <dd className="font-mono text-[0.95rem] leading-[1.5] text-ivory break-words">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Outcomes — three large stats                                                */
/* -------------------------------------------------------------------------- */

function Outcomes({
  outcomes,
}: {
  outcomes: { label: string; value: string }[];
}) {
  return (
    <section
      aria-labelledby="outcomes-heading"
      className="
        relative mt-24 lg:mt-40
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
      "
    >
      <HeritageImage
        src="/fabric_1.avif"
        positionClassName="absolute left-1/2 -translate-x-1/2 top-0 h-full w-screen max-w-none -z-10"
        opacity={0.06}
        blendMode="luminosity"
        maskImage="radial-gradient(ellipse 75% 65% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, transparent 100%)"
        sizes="100vw"
      />
      <div className="grid grid-cols-12 gap-x-6 mb-12 lg:mb-16">
        <p className="col-span-12 lg:col-span-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
          Outcomes
        </p>
        <h2
          id="outcomes-heading"
          className="
            col-span-12 lg:col-span-9 mt-4 lg:mt-0
            font-serif font-optical-display
            text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.012em]
            text-foreground max-w-[24ch]
          "
        >
          What it changed.
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-10 border-t border-border-subtle pt-12 lg:pt-16">
        {outcomes.slice(0, 3).map((o, i) => (
          <li key={o.label + i} className="flex flex-col gap-4">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted">
              {o.label}
            </p>
            <p
              className="
                font-serif font-optical-display
                text-[clamp(3rem,7vw,5.5rem)]
                leading-[0.9] tracking-[-0.02em]
                text-foreground
              "
            >
              {o.value}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery                                                                     */
/* -------------------------------------------------------------------------- */

function Gallery({ title, images }: { title: string; images: string[] }) {
  return (
    <section
      aria-label={`${title} — gallery`}
      className="
        relative mt-24 lg:mt-40
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
      "
    >
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre mb-10">
        Gallery
      </p>
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {images.slice(0, 6).map((src, i) => {
          const span =
            i % 5 === 0 ? "col-span-12 lg:col-span-8 aspect-[16/9]" :
            i % 5 === 1 ? "col-span-12 lg:col-span-4 aspect-[3/4]" :
            i % 5 === 2 ? "col-span-6 lg:col-span-4 aspect-[4/3]" :
            i % 5 === 3 ? "col-span-6 lg:col-span-4 aspect-[4/3]" :
            "col-span-12 lg:col-span-4 aspect-[4/3]";
          return (
            <figure
              key={src + i}
              className={`relative overflow-hidden border border-ochre/40 bg-ink-deep ${span}`}
            >
              <Image src={src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </figure>
          );
        })}
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
        relative mt-32 lg:mt-48
        mx-auto w-full max-w-[1440px]
        px-5 sm:px-8 lg:px-14
        pb-24 lg:pb-40
      "
    >
      <div className="border-t border-border-subtle pt-16 lg:pt-24 grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-9">
          <h2
            className="
              font-serif font-optical-display italic
              text-[clamp(2rem,5vw,3.75rem)]
              leading-[1.05] tracking-[-0.012em]
              text-foreground max-w-[22ch]
            "
          >
            Want this kind of work for your institution?
          </h2>
          <p className="mt-6 max-w-[52ch] font-sans text-foreground-muted leading-[1.65]">
            We pick a small number of engagements each year, and we pick them
            on the question — not the budget. Begin a conversation; we will
            answer in person.
          </p>
        </div>
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
