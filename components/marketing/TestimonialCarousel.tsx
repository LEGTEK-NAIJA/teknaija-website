"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  org: string;
};

const ROTATE_MS = 8000;
const FADE_MS = 600;

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const target = (next + items.length) % items.length;
      if (target === index) return;
      setVisible(false);
      window.setTimeout(() => {
        setIndex(target);
        setVisible(true);
      }, FADE_MS);
    },
    [index, items.length]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    if (pausedRef.current) return;
    timerRef.current = setTimeout(() => goTo(index + 1), ROTATE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, items.length, goTo]);

  if (items.length === 0) return null;

  const t = items[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pausedRef.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        timerRef.current = setTimeout(() => goTo(index + 1), ROTATE_MS);
      }}
    >
      <div
        aria-live="polite"
        className="transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
          transitionTimingFunction: "var(--ease-rise)",
        }}
        key={index}
      >
        <blockquote className="font-serif font-optical-display text-foreground max-w-[24ch] sm:max-w-[28ch]">
          <span aria-hidden className="text-terracotta mr-1">
            “
          </span>
          <span className="text-[clamp(1.75rem,4.4vw,3rem)] leading-[1.1]">
            {t.quote}
          </span>
          <span aria-hidden className="text-terracotta ml-1">
            ”
          </span>
        </blockquote>

        <figcaption
          className="
            mt-8 font-mono text-[0.75rem] tracking-[0.18em] uppercase
            text-foreground-muted
          "
        >
          <span className="text-foreground">{t.author}</span>
          <span aria-hidden className="mx-2 text-ochre">
            /
          </span>
          {t.role}
          <span aria-hidden className="mx-2 text-ochre">
            ·
          </span>
          {t.org}
        </figcaption>
      </div>

      {items.length > 1 && (
        <div
          className="
            mt-12 flex items-center justify-between gap-6
            lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:justify-end
          "
        >
          <p
            className="
              font-mono text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted
              lg:hidden
            "
          >
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>

          <div className="flex items-center gap-3">
            <p
              className="
                hidden lg:block
                font-mono text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted
                mr-4
              "
            >
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>

            <CarouselButton
              label="Previous voice"
              onClick={() => goTo(index - 1)}
            >
              ←
            </CarouselButton>
            <CarouselButton label="Next voice" onClick={() => goTo(index + 1)}>
              →
            </CarouselButton>
          </div>
        </div>
      )}
    </div>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="
        inline-flex h-10 w-10 items-center justify-center
        border border-border-subtle text-foreground-muted
        transition-colors duration-200
        hover:border-ochre hover:text-foreground
      "
    >
      <span aria-hidden className="font-mono text-base">
        {children}
      </span>
    </button>
  );
}
