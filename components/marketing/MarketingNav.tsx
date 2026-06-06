"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

const RC_NUMBER = "RC 9181824";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MarketingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="
        sticky top-0 z-40 w-full
        bg-background/85 backdrop-blur-md
        border-b border-transparent
        data-[scrolled]:border-border-subtle
        transition-colors duration-300
      "
    >
      <a
        href="#main"
        className="
          sr-only focus-visible:not-sr-only
          focus-visible:absolute focus-visible:left-4 focus-visible:top-3
          focus-visible:z-50 focus-visible:rounded
          focus-visible:bg-terracotta focus-visible:px-3 focus-visible:py-2
          focus-visible:text-ivory focus-visible:font-mono focus-visible:text-xs
        "
      >
        Skip to content
      </a>

      <div
        className="
          mx-auto flex w-full max-w-[1440px]
          items-baseline justify-between gap-6
          px-5 py-5 sm:px-8 lg:px-14 lg:py-7
        "
      >
        <Wordmark />

        <nav
          aria-label="Primary"
          className="hidden lg:flex items-baseline gap-9"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              current={isCurrent(pathname, item.href)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <BeginConversation />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="marketing-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="
            xs:hidden inline-flex h-10 w-10 items-center justify-center
            rounded border border-border-subtle text-foreground
            transition-colors hover:border-terracotta
          "
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <MenuGlyph open={open} />
        </button>
      </div>

      <nav
        aria-label="Primary, inline"
        className="
          hidden xs:flex lg:hidden
          mx-auto w-full max-w-[1440px]
          items-center justify-between gap-4
          px-3 xs:px-5 sm:px-8 pb-4 pt-1
          border-t border-border-subtle/40
        "
      >
        <div className="flex items-baseline gap-3 xs:gap-4 sm:gap-6 flex-wrap">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              className="
                group relative font-sans text-[0.85rem] tracking-wide
                text-foreground-muted hover:text-foreground
                transition-colors flex items-baseline gap-1.5
                shrink-0
              "
              data-current={isCurrent(pathname, item.href) || undefined}
            >
              <span className="font-mono text-[0.6rem] text-foreground-muted/70 tracking-[0.1em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
              <span
                aria-hidden
                className="
                  pointer-events-none absolute -bottom-1.5 left-0 h-px
                  w-full origin-left scale-x-0 bg-terracotta
                  transition-transform duration-300 ease-out
                  group-hover:scale-x-100
                  group-data-[current]:scale-x-100 group-data-[current]:bg-terracotta
                "
              />
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="
            shrink-0 inline-flex items-center gap-2
            font-sans text-[0.8rem] tracking-wide text-foreground
            border border-border-subtle rounded
            px-3 py-1.5
            transition-colors hover:border-terracotta hover:text-terracotta
          "
        >
          <span>Begin a conversation</span>
          <span aria-hidden>→</span>
        </Link>
      </nav>

      <MobileSheet open={open} pathname={pathname} onClose={() => setOpen(false)} />
    </header>
  );
}

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="TEK NAIJA — home"
      className="
        group inline-flex items-center gap-3 sm:gap-4
        whitespace-nowrap focus-visible:outline-none
        py-0.5 pr-1 sm:pr-2
      "
    >
      <Image
        src="/tek-naija-monogram.png"
        alt="TEK NAIJA"
        width={200}
        height={200}
        priority
        sizes="40px"
        className="h-[22px] sm:h-[26px] w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <span
        aria-label="Registration number"
        className="
          hidden xs:inline font-mono text-foreground-muted
          text-[0.7rem] tracking-[0.12em] uppercase leading-none
        "
      >
        {RC_NUMBER}
      </span>
    </Link>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="
        group relative font-sans text-[0.9rem] tracking-wide
        text-foreground-muted hover:text-foreground
        transition-colors
      "
      data-current={current || undefined}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="
          pointer-events-none absolute -bottom-1.5 left-0 h-px
          w-full origin-left scale-x-0 bg-terracotta
          transition-transform duration-300 ease-out
          group-hover:scale-x-100
          group-data-[current]:scale-x-100 group-data-[current]:bg-terracotta
        "
      />
    </Link>
  );
}

function BeginConversation({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/contact"
      className={`
        group inline-flex items-baseline gap-2
        font-sans text-[0.9rem] tracking-wide text-foreground
        transition-colors hover:text-terracotta
        ${className}
      `}
    >
      <span>Begin a conversation</span>
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
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
      className="text-current"
    >
      <line
        x1="3"
        y1={open ? "10" : "6"}
        x2="17"
        y2={open ? "10" : "6"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 200ms ease, y1 200ms ease, y2 200ms ease",
        }}
      />
      <line
        x1="3"
        y1={open ? "10" : "14"}
        x2="17"
        y2={open ? "10" : "14"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transform: open ? "rotate(-45deg)" : "none",
          transition: "transform 200ms ease",
        }}
      />
    </svg>
  );
}

function MobileSheet({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        data-open={open || undefined}
        className="
          xs:hidden fixed inset-0 top-0 z-[60]
          bg-black/60 backdrop-blur-sm
          opacity-0 pointer-events-none
          data-[open]:opacity-100 data-[open]:pointer-events-auto
          transition-opacity duration-200
        "
      />

      <div
        id="marketing-mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-open={open || undefined}
        style={{ backgroundColor: "#060814" }}
        className="
          xs:hidden fixed top-0 right-0 z-[70]
          h-[100dvh] w-[85%] max-w-sm
          border-l border-ochre/30
          shadow-2xl
          translate-x-full pointer-events-none
          data-[open]:translate-x-0 data-[open]:pointer-events-auto
          transition-transform duration-300 ease-out
          flex flex-col
        "
      >
        <div className="flex justify-end px-5 pt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded border border-ochre/40 text-foreground
              transition-colors hover:border-terracotta
            "
          >
            <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
              <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobile primary"
          className="
            flex-1 min-h-0 overflow-y-auto
            flex flex-col justify-between gap-10
            px-6 pb-10 pt-6
          "
        >
          <ul className="flex flex-col gap-5">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  onClick={onClose}
                  className="
                    block font-serif text-[1.75rem] leading-tight
                    text-foreground hover:text-terracotta transition-colors
                    aria-[current=page]:text-terracotta
                  "
                >
                  <span className="font-mono text-foreground-muted text-[0.65rem] mr-3 align-middle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-border-subtle pt-6 shrink-0">
            <BeginConversation className="text-base" />
            <p className="mt-5 font-mono text-xs text-foreground-muted leading-relaxed">
              5 Bauchi Link Street, Apapa
              <br />
              Lagos, Nigeria
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
