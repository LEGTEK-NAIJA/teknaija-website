/**
 * AdireGround
 * --------------------------------------------------------------------------
 * A still SVG "ground" inspired by Yoruba indigo-resist (adire eleko / oniko).
 * Used as the hero background — never decorative wallpaper. Concentric
 * circles in a deterministic 8 × 5 grid with broken outer rings and short
 * resist marks. Renders with `mix-blend-mode: screen` over the indigo so the
 * ochre / clay strokes feel like dye lifted by wax.
 *
 * Pure server-rendered SVG — zero JS, zero runtime cost.
 */

type Props = {
  className?: string;
};

const COLS = 8;
const ROWS = 5;
const CELL = 200;
const W = COLS * CELL;
const H = ROWS * CELL;

// Tiny deterministic PRNG so the layout is identical SSR ↔ client.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Cell = {
  cx: number;
  cy: number;
  rings: number[];
  breakStart: number;
  breakArc: number;
  marks: { angle: number; length: number }[];
};

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const seed = r * 13 + c * 7 + 1;
      const ringCount = 3 + Math.floor(rand(seed) * 2);
      const baseR = 24 + rand(seed + 1) * 8;
      const step = 14 + rand(seed + 2) * 6;
      const rings = Array.from({ length: ringCount }, (_, i) => baseR + i * step);
      const marks = Array.from({ length: 4 }, (_, i) => ({
        angle: i * 90 + rand(seed + 10 + i) * 30,
        length: 6 + rand(seed + 20 + i) * 6,
      }));
      cells.push({
        cx: c * CELL + CELL / 2,
        cy: r * CELL + CELL / 2,
        rings,
        breakStart: rand(seed + 3) * 360,
        breakArc: 40 + rand(seed + 4) * 60,
        marks,
      });
    }
  }
  return cells;
}

const CELLS = buildCells();

// Build a path-string for an arc that omits a wedge between [start, start+arc].
function ringPath(cx: number, cy: number, r: number, start: number, arc: number) {
  const a1 = ((start + arc) * Math.PI) / 180;
  const a2 = ((start + 360) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  const sweep = 360 - arc > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${sweep} 1 ${x2.toFixed(
    2
  )} ${y2.toFixed(2)}`;
}

export function AdireGround({ className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "screen", opacity: 0.55 }}
      >
        <defs>
          {/* Soft fade so the hero text always wins the contrast fight. */}
          <radialGradient id="tn-adire-fade" cx="50%" cy="55%" r="75%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
          <mask id="tn-adire-mask">
            <rect width={W} height={H} fill="white" />
            <rect width={W} height={H} fill="url(#tn-adire-fade)" />
          </mask>
        </defs>

        <g
          mask="url(#tn-adire-mask)"
          stroke="var(--ochre)"
          fill="none"
          strokeLinecap="round"
        >
          {CELLS.map((cell, i) => (
            <g key={i}>
              {cell.rings.map((r, idx) => {
                const isOutermost = idx === cell.rings.length - 1;
                return isOutermost ? (
                  <path
                    key={idx}
                    d={ringPath(cell.cx, cell.cy, r, cell.breakStart, cell.breakArc)}
                    strokeWidth={1}
                    opacity={0.45 - idx * 0.05}
                  />
                ) : (
                  <circle
                    key={idx}
                    cx={cell.cx}
                    cy={cell.cy}
                    r={r}
                    strokeWidth={1}
                    opacity={0.55 - idx * 0.08}
                  />
                );
              })}

              {/* Tiny resist marks radiating from the centre — the "dot work" */}
              {cell.marks.map((m, j) => {
                const a = (m.angle * Math.PI) / 180;
                const r1 = 4;
                const r2 = 4 + m.length;
                return (
                  <line
                    key={j}
                    x1={cell.cx + r1 * Math.cos(a)}
                    y1={cell.cy + r1 * Math.sin(a)}
                    x2={cell.cx + r2 * Math.cos(a)}
                    y2={cell.cy + r2 * Math.sin(a)}
                    stroke="var(--clay)"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                );
              })}
            </g>
          ))}
        </g>

        {/* A second register: long broken horizontals — the resist seams */}
        <g stroke="var(--ochre)" opacity={0.18} mask="url(#tn-adire-mask)">
          {Array.from({ length: ROWS - 1 }, (_, i) => {
            const y = (i + 1) * CELL;
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={W * 0.32}
                  y2={y}
                  strokeWidth={0.75}
                  strokeDasharray="2 6"
                />
                <line
                  x1={W * 0.42}
                  y1={y}
                  x2={W}
                  y2={y}
                  strokeWidth={0.75}
                  strokeDasharray="2 6"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
