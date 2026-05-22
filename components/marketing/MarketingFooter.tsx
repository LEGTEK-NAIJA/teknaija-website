import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL_ITEMS = [
  { href: "/status", label: "Status" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="
        relative mt-32 border-t border-border-subtle
        bg-ink-deep text-foreground
      "
    >
      <div
        className="
          mx-auto w-full max-w-[1440px]
          px-5 sm:px-8 lg:px-14
          pt-16 lg:pt-24 pb-10
        "
      >
        <div
          className="
            grid grid-cols-1 gap-14
            md:grid-cols-2 md:gap-16
            lg:grid-cols-3 lg:gap-20
          "
        >
          <IdentityColumn />
          <NavigationColumn />
          <PullQuoteColumn />
        </div>

        <div
          className="
            mt-16 lg:mt-24 pt-6
            border-t border-border-subtle
            flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
            font-mono text-[0.7rem] tracking-[0.08em] uppercase
            text-foreground-muted
          "
        >
          <p>© {year} TEK NAIJA LTD. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            {LEGAL_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function IdentityColumn() {
  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/"
        aria-label="TEK NAIJA — home"
        className="inline-flex flex-col gap-3 w-fit"
      >
        <Image
          src="/tek-naija-logo-clean.png"
          alt=""
          width={336}
          height={56}
          className="h-[56px] w-auto object-contain mix-blend-screen"
          sizes="336px"
          priority={false}
        />
        <span
          className="
            font-serif text-[1.4rem] uppercase tracking-[0.18em]
            text-foreground
          "
          style={{ fontVariantCaps: "all-small-caps" }}
        >
          TEK NAIJA
        </span>
      </Link>

      <p className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-foreground-muted">
        RC 9181824
        <br />
        Incorporated 08.01.2026
      </p>

      <address className="not-italic font-sans text-sm leading-relaxed text-foreground-muted max-w-[28ch]">
        5 Bauchi Link Street
        <br />
        Apapa, Lagos
        <br />
        Federal Republic of Nigeria
      </address>
    </div>
  );
}

function NavigationColumn() {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-foreground-muted">
        Site
      </p>
      <ul className="flex flex-col gap-3">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
                group inline-flex items-baseline gap-3
                font-serif text-lg text-foreground
                transition-colors hover:text-terracotta
              "
            >
              <span>{item.label}</span>
              <span
                aria-hidden
                className="
                  inline-block opacity-0 -translate-x-1
                  transition-all duration-300 ease-out
                  group-hover:opacity-100 group-hover:translate-x-0
                  text-ochre
                "
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PullQuoteColumn() {
  return (
    <figure className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
      <p className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-foreground-muted">
        From the founder
      </p>

      <blockquote
        className="
          font-serif italic
          text-[1.5rem] leading-[1.25] sm:text-[1.75rem]
          text-foreground
          max-w-[34ch]
        "
      >
        <span aria-hidden className="mr-1 text-terracotta">“</span>
        We build for the next century, not the next quarter.
        <span aria-hidden className="ml-1 text-terracotta">”</span>
      </blockquote>

      <figcaption className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-foreground-muted">
        Sanctus Ojonimi Ejeh
        <span aria-hidden className="mx-2 text-ochre">/</span>
        Managing Director
      </figcaption>
    </figure>
  );
}
