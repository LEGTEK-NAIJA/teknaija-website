import type { Metadata } from "next";
import Link from "next/link";
import { HeritageImage } from "@/components/marketing/HeritageImage";
import { fetchPublishedPosts } from "@/lib/content/queries";
import { formatPublishDate } from "@/lib/content/format";

export const metadata: Metadata = {
  title: "Insights — TEK NAIJA",
  description:
    "Notes from the desk: writing on Nigerian dispute resolution, sovereign software, and the slow internet — by the team at TEK NAIJA.",
};

export default async function InsightsIndexPage() {
  const posts = await fetchPublishedPosts();

  return (
    <>
      <Header count={posts.length} />

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <ol
          className="
            mx-auto w-full max-w-[1440px]
            px-5 sm:px-8 lg:px-14
            pb-32
          "
        >
          {posts.map((post) => {
            if (!post.slug || !post.title) return null;
            const { display, isoDay } = formatPublishDate(post.published_at);
            return (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="
                    group grid grid-cols-12 items-baseline gap-x-6 gap-y-3
                    border-t border-border-subtle py-10 lg:py-14
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
                    <h2
                      className="
                        font-serif text-[1.75rem] sm:text-[2rem] leading-[1.15]
                        text-foreground
                        transition-all duration-200 ease-out
                        group-hover:-translate-y-1 group-hover:text-terracotta
                      "
                    >
                      <span className="bg-[length:0%_1px] bg-gradient-to-r from-terracotta to-terracotta bg-no-repeat bg-left-bottom transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
                        {post.title}
                      </span>
                    </h2>
                    {post.dek && (
                      <p className="mt-3 max-w-[60ch] font-sans text-foreground-muted leading-[1.65]">
                        {post.dek}
                      </p>
                    )}
                  </div>

                  <p
                    className="
                      col-span-12 md:col-span-3 md:text-right
                      font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted
                    "
                  >
                    Read →
                  </p>
                </Link>
              </li>
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
      <HeritageImage
        src="/fabric_pattern.jpeg"
        positionClassName="absolute left-1/2 -translate-x-1/2 top-0 h-full w-screen max-w-none -z-10"
        opacity={0.07}
        blendMode="luminosity"
        maskImage="linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, transparent 100%)"
        sizes="100vw"
        objectPosition="center"
      />
      <p className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ochre">
        <span aria-hidden className="mr-3 inline-block h-px w-8 align-middle bg-ochre" />
        Insights
      </p>

      <h1
        className="
          mt-6 font-serif font-optical-display
          text-[clamp(2.75rem,8vw,6rem)]
          leading-[0.96] tracking-[-0.014em]
          text-foreground max-w-[18ch]
        "
      >
        Notes from the desk.
      </h1>

      <p className="mt-8 max-w-[60ch] font-sans text-foreground-muted leading-[1.65] text-[1.05rem]">
        Writing from the practice — on Nigerian dispute-resolution
        architecture, on building for the slow internet, on the question of
        sovereignty in software. Published when there is something to say,
        not on a calendar.
      </p>

      <p className="mt-10 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-foreground-muted flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{count} {count === 1 ? "entry" : "entries"}</span>
        <span aria-hidden className="text-ochre">—</span>
        <span>Updated as published</span>
      </p>
    </header>
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
          // Desk in build
        </p>
        <p className="mt-6 max-w-[55ch] font-serif text-[1.5rem] leading-[1.4] text-foreground italic">
          The first essays are with their editors. They will be set down here
          when they are ready, not a moment before.
        </p>
      </div>
    </div>
  );
}
