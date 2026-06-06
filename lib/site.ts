// Single source of truth for the public site origin.
// Override per-environment via NEXT_PUBLIC_SITE_URL (set this at domain cutover).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://teknaija.legtek.ng";

// Bare host (no scheme), for display.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
