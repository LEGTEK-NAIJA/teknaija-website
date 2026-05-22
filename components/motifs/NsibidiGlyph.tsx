import type { CSSProperties } from "react";

/**
 * Nsibidi-inspired corner glyph that traces in on mount or on parent hover.
 * Pure geometric forms — Nsibidi ideographs reduced to their structural essence.
 *
 * Pass `delay` to stagger multiple instances. `variant` picks one of three
 * forms. `trigger` controls when it draws: "load" or "hover".
 */
export function NsibidiGlyph({
  variant = "knot",
  size = 72,
  delay = 0,
  trigger = "load",
  className = "",
}: {
  variant?: "knot" | "compass" | "lattice";
  size?: number;
  delay?: number;
  trigger?: "load" | "hover";
  className?: string;
}) {
  const paths = {
    knot: (
      <>
        <path d="M 12 36 Q 36 12, 60 36 Q 36 60, 12 36 Z" />
        <path d="M 36 12 L 36 60" />
        <line x1="12" y1="36" x2="60" y2="36" />
      </>
    ),
    compass: (
      <>
        <line x1="36" y1="6" x2="36" y2="66" />
        <line x1="6" y1="36" x2="66" y2="36" />
        <path d="M 16 16 L 56 56" />
        <path d="M 56 16 L 16 56" />
        <circle cx="36" cy="36" r="6" />
      </>
    ),
    lattice: (
      <>
        <path d="M 10 22 L 30 10 L 50 22 L 50 50 L 30 62 L 10 50 Z" />
        <line x1="30" y1="10" x2="30" y2="62" />
        <path d="M 10 22 L 50 50" />
        <path d="M 50 22 L 10 50" />
      </>
    ),
  };

  const baseCls =
    trigger === "load"
      ? "anim-glyph-trace"
      : "[&_path]:transition-[stroke-dashoffset] [&_line]:transition-[stroke-dashoffset] " +
        "[&_path]:duration-[1.6s] [&_line]:duration-[1.6s] " +
        "group-hover:[&_path]:stroke-dashoffset-0 group-hover:[&_line]:stroke-dashoffset-0";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 72"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      className={`${baseCls} ${className}`}
      style={{ ["--anim-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {paths[variant]}
    </svg>
  );
}
