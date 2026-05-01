import Image from "next/image";

/**
 * Ejubejuailo
 * --------------------------------------------------------------------------
 * Iyoba (Queen Mother) pendant mask of Benin — Queen Idia. A heritage
 * marker, not a decoration; a sovereign image the practice publicly stands
 * beside.
 *
 * Composition rules (set by the design):
 *   • Anchored bottom-right of the hero; translated up slightly on the Y axis
 *     so more of the figure reads in frame while the headline column stays left.
 *   • The full mask is visible (object-fit: contain, object-position:
 *     right bottom). No cropping at the top, bottom, or right.
 *   • A horizontal mask dissolves the LEFT edge so the headline column
 *     reads cleanly; the right and bottom edges are fully visible.
 *   • mix-blend-mode: screen (in globals.css) — greys merge into the ink
 *     ground; ivory / warm tones stay legible against the hero.
 *   • Static opacity 0.65 — present without crowding headline space.
 *
 * Delivered through next/image so the optimizer serves AVIF / WebP at the
 * actual rendered size.
 */

type Props = {
  className?: string;
};

// Softer horizontal dissolve into the headline column — wide transparent
// span so typography stays left; blend completes mid-panel (55vw strip).
const MASK_H =
  "linear-gradient(to right, transparent 0%, transparent 22%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 70%, black 82%)";
// Fades top / bottom of the photograph into the indigo ground.
const MASK_V =
  "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)";

export function Ejubejuailo({ className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      data-heritage="ejubejuailo-iyoba"
      className={`
        ejubejuailo
        pointer-events-none absolute
        right-0 bottom-0
        w-[55vw] h-[90%]
        origin-bottom
        -translate-y-[min(14vh,12rem)]
        ${className}
      `}
      style={{
        WebkitMaskImage: MASK_H,
        maskImage: MASK_H,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: MASK_V,
          maskImage: MASK_V,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <Image
          src="/ejubejuailo.jpg"
          alt=""
          fill
          sizes="55vw"
          priority
          className="
          object-contain object-right-bottom
          select-none
        "
        />
        {/* Edge feather into page ink — photograph uses screen blend on .ejubejuailo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, transparent 60%, rgb(11 14 26) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent 60%, rgb(11 14 26) 100%)",
          }}
        />
      </div>
    </div>
  );
}
