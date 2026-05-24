import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  fetchPostBySlug,
  fetchPostSlugs,
  fetchPublishedPosts,
} from "@/lib/content/queries";
import { formatPublishDate } from "@/lib/content/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await fetchPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post?.title) {
    return { title: { absolute: "Insight — TEK NAIJA" } };
  }
  return {
    title: { absolute: `${post.title} — TEK NAIJA` },
    description: post.dek?.trim() || undefined,
    openGraph: {
      title: post.title ?? undefined,
      description: post.dek ?? undefined,
      images: [
        {
          url: `https://teknaija.legtek.ng/api/og?title=${encodeURIComponent(post.title ?? "TEK NAIJA")}&eyebrow=${encodeURIComponent("INSIGHTS · TEK NAIJA")}&subtitle=${encodeURIComponent(post.dek ?? "")}`,
          width: 1200,
          height: 630,
          alt: post.title ?? "TEK NAIJA insight",
        },
      ],
    },
  };
}

export default async function InsightPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const { display, isoDay } = formatPublishDate(post.published_at);
  const all = await fetchPublishedPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
      <PostHeader
        title={post.title ?? ""}
        dek={post.dek ?? ""}
        display={display}
        isoDay={isoDay}
      />

      <Body markdown={post.body ?? ""} />

      <PostFooter display={display} isoDay={isoDay} />

      {others.length > 0 && <ContinueReading posts={others} />}

      <FooterCTA />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

function PostHeader({
  title,
  dek,
  display,
  isoDay,
}: {
  title: string;
  dek: string;
  display: string;
  isoDay: string;
}) {
  return (
    <header className="pt-24 lg:pt-40 pb-12 lg:pb-20 max-w-[68ch]">
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <Link href="/insights" className="hover:text-foreground transition-colors">
          ← Insights
        </Link>
      </p>

      <h1
        className="
          mt-8 font-serif font-optical-display
          text-[clamp(2.25rem,6vw,4.5rem)]
          leading-[1.05] tracking-[-0.012em]
          text-foreground
        "
      >
        {title}
      </h1>

      {dek && (
        <p className="mt-6 font-serif italic text-[1.25rem] sm:text-[1.4rem] leading-[1.4] text-foreground-muted">
          {dek}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
        {display && (
          <time dateTime={isoDay || undefined}>{display}</time>
        )}
        {display && <span aria-hidden className="text-ochre">—</span>}
        <span>TEK NAIJA</span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Body                                                                        */
/* -------------------------------------------------------------------------- */

function Body({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return (
      <p className="font-serif italic text-foreground-muted py-16">
        This essay is being set; it will appear here once final.
      </p>
    );
  }

  return (
    <div
      className="
        mx-auto max-w-prose
        font-serif text-foreground
        text-[1.15rem] sm:text-[1.25rem] leading-[1.65]
        py-12 lg:py-20
        [&>*+*]:mt-7
        [&_h2]:font-serif [&_h2]:text-[1.85rem] [&_h2]:leading-[1.2] [&_h2]:mt-16 [&_h2]:mb-2 [&_h2]:text-foreground
        [&_h3]:font-serif [&_h3]:text-[1.4rem] [&_h3]:leading-[1.25] [&_h3]:mt-12 [&_h3]:mb-2 [&_h3]:text-foreground
        [&_p]:font-serif
        [&_strong]:text-foreground [&_strong]:font-semibold
        [&_em]:italic
        [&_a]:text-foreground [&_a]:underline [&_a]:decoration-ochre/70 [&_a]:underline-offset-4 hover:[&_a]:decoration-terracotta
        [&_ul]:list-none [&_ul]:pl-0 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.85em] [&_ul>li]:before:h-px [&_ul>li]:before:w-3 [&_ul>li]:before:bg-ochre
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:marker:text-ochre [&_ol]:marker:font-mono
        [&_blockquote]:border-l-2 [&_blockquote]:border-terracotta [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-foreground
        [&_pre]:bg-indigo [&_pre]:border-y [&_pre]:border-ochre/40 [&_pre]:px-6 [&_pre]:py-5 [&_pre]:font-mono [&_pre]:text-[0.95rem] [&_pre]:text-ivory [&_pre]:overflow-x-auto [&_pre]:rounded-none
        [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ochre
        [&_pre_code]:text-ivory
        [&_hr]:my-12 [&_hr]:border-border-subtle
        [&_img]:w-full [&_img]:my-10 [&_img]:border [&_img]:border-ochre/40
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Post footer (date / colophon)                                              */
/* -------------------------------------------------------------------------- */

function PostFooter({
  display,
  isoDay,
}: {
  display: string;
  isoDay: string;
}) {
  return (
    <footer className="border-t border-border-subtle py-10 max-w-prose mx-auto flex flex-wrap items-baseline justify-between gap-4 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
      <span>
        TEK NAIJA
        {display && (
          <>
            <span aria-hidden className="mx-2 text-ochre">/</span>
            <time dateTime={isoDay || undefined}>{display}</time>
          </>
        )}
      </span>
      <Link
        href="/insights"
        className="hover:text-foreground transition-colors"
      >
        ← Back to all insights
      </Link>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Continue reading                                                            */
/* -------------------------------------------------------------------------- */

function ContinueReading({
  posts,
}: {
  posts: { slug: string | null; title: string | null; dek: string | null; published_at: string | null }[];
}) {
  return (
    <section
      aria-label="Continue reading"
      className="
        relative
        mt-16 lg:mt-24 pt-12 lg:pt-20
        border-t border-border-subtle
      "
    >
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre mb-10">
        Continue reading
      </p>
      <ol className="flex flex-col">
        {posts.map((p) => {
          if (!p.slug || !p.title) return null;
          const { display, isoDay } = formatPublishDate(p.published_at);
          return (
            <li key={p.slug}>
              <Link
                href={`/insights/${p.slug}`}
                className="
                  group grid grid-cols-12 items-baseline gap-x-6 gap-y-3
                  border-t border-border-subtle py-8 lg:py-10
                "
              >
                <time
                  dateTime={isoDay || undefined}
                  className="col-span-12 md:col-span-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted"
                >
                  {display || "—"}
                </time>
                <h3 className="col-span-12 md:col-span-7 font-serif text-[1.5rem] leading-[1.2] text-foreground transition-colors group-hover:text-terracotta">
                  {p.title}
                </h3>
                <p className="col-span-12 md:col-span-3 md:text-right font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted">
                  Read →
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

/* -------------------------------------------------------------------------- */
/* Footer CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FooterCTA() {
  return (
    <section
      aria-label="Begin a conversation"
      className="
        relative mt-24 lg:mt-32
        py-20 lg:py-28
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
          If this is the kind of thinking you want behind your institution's
          software — write.
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
