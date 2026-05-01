/**
 * AchiStrip
 * --------------------------------------------------------------------------
 * The Achi — an Igala ancestral textile carried as a permanent vertical
 * register on the left edge of every marketing page. Five colour bands in a
 * fixed sequence (ochre · forest · ivory · ink · yellow), repeating top to
 * bottom. This is a heritage marker, not decoration: it stays put, ignores
 * the cursor, and does not participate in layout.
 *
 * - Hidden below md (the strip is a desktop register).
 * - position: fixed; left: 0; full viewport height; ~12px wide.
 * - z-index above page chrome so it remains visible across all states.
 * - pointer-events: none so it never intercepts clicks or focus.
 */

const BAND_PX = 16;
const BANDS = [
  "#D9A441", // ochre
  "#2D6A4F", // forest green
  "#F4EFE6", // ivory
  "#0B0E1A", // deep black (ink)
  "#E8C547", // yellow
] as const;

const CYCLE_PX = BAND_PX * BANDS.length;

const GRADIENT = `repeating-linear-gradient(
  to bottom,
  ${BANDS.map((c, i) => {
    const start = i * BAND_PX;
    const end = (i + 1) * BAND_PX;
    return `${c} ${start}px ${end}px`;
  }).join(",\n  ")},
  ${BANDS[0]} ${CYCLE_PX}px
)`;

export function AchiStrip() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      data-heritage="achi-igala"
      className="
        hidden md:block
        pointer-events-none select-none
        fixed left-0 top-0 z-50
        h-dvh w-3
      "
      style={{
        backgroundImage: GRADIENT,
        backgroundRepeat: "repeat-y",
        backgroundSize: `100% ${CYCLE_PX}px`,
      }}
    />
  );
}
