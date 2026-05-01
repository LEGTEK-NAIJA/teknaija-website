/**
 * AsoOkeDivider
 * --------------------------------------------------------------------------
 * A horizontal "selvedge" strip inspired by Aso-oke weaving (Yoruba narrow-loom).
 * Rendered as a tileable SVG that drifts slowly with `.anim-aso-drift`
 * (240px tile, 24s loop). Stops drifting under prefers-reduced-motion.
 *
 * Used between major page sections per CLAUDE.md §1.
 */

type Props = {
  className?: string;
  height?: number;
};

const TILE = 240;

export function AsoOkeDivider({ className = "", height = 24 }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Top + bottom hairlines — the loom selvedge */}
      <div className="absolute inset-x-0 top-0 h-px bg-border-subtle" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border-subtle" />

      {/* Drifting weave; doubled so the tail re-enters seamlessly */}
      <div
        className="anim-aso-drift absolute inset-y-0 left-0 flex"
        style={{ width: TILE * 2 + "px" }}
      >
        <Tile />
        <Tile />
      </div>
    </div>
  );
}

function Tile() {
  return (
    <svg
      viewBox={`0 0 ${TILE} 24`}
      width={TILE}
      height={24}
      preserveAspectRatio="none"
      className="block shrink-0"
      style={{ width: TILE, height: "100%" }}
    >
      {/* Warp threads — vertical ticks in ochre */}
      {Array.from({ length: TILE / 6 }, (_, i) => (
        <line
          key={`w-${i}`}
          x1={i * 6 + 1}
          y1={4}
          x2={i * 6 + 1}
          y2={20}
          stroke="var(--ochre)"
          strokeWidth={0.6}
          opacity={0.35}
        />
      ))}

      {/* Weft block: a band of indigo with terracotta + clay accents */}
      <rect x={0} y={9} width={TILE} height={6} fill="var(--indigo)" opacity={0.55} />
      <rect x={0} y={11} width={TILE} height={2} fill="var(--terracotta)" opacity={0.85} />

      {/* Float pattern: short clay dashes simulating extra-weft floats */}
      {Array.from({ length: TILE / 30 }, (_, i) => (
        <rect
          key={`f-${i}`}
          x={i * 30 + 6}
          y={9}
          width={10}
          height={6}
          fill="var(--clay)"
          opacity={0.55}
        />
      ))}
    </svg>
  );
}
