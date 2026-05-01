import Image from "next/image";

/**
 * Ejubejuailo
 * --------------------------------------------------------------------------
 * The Iyoba (Queen Mother) pendant mask of Benin, deployed as the
 * atmospheric register of the hero — never a logo, never a decoration; a
 * sovereign image the practice publicly stands beside.
 *
 * Composition rules (set by the design):
 *   • Wrapper sized to the image's native aspect (1483 × 2000) at full
 *     hero height, anchored to the right edge, then translated 45% of its
 *     own width off-screen. ~55% of the face remains visible.
 *   • A two-axis mask dissolves the LEFT edge into the text column
 *     (transparent → opaque over 40%) and the BOTTOM edge into the
 *     section seam (opaque → transparent over the lower 20%).
 *   • mix-blend-mode: luminosity (in globals.css) collapses the
 *     photograph's chroma into the indigo ground; the form is preserved,
 *     the colour belongs to the canvas.
 *   • Static opacity 0.55 — no scroll choreography. The composition is
 *     one atmospheric whole, not a progressive reveal.
 *
 * Delivered through next/image so the optimizer serves AVIF / WebP at the
 * actual rendered size.
 */

type Props = {
  className?: string;
};

// Two stacked gradients composited via `mask-composite: intersect` —
// the image is opaque only where BOTH gradients are opaque.
// 1) horizontal: transparent on the left for the first 40%, opaque after.
// 2) vertical: opaque for the top 80%, fading to transparent for the
//    bottom 20% so the mask dissolves into the section seam.
const FADE_MASK = `linear-gradient(to right, transparent 0%, black 40%), linear-gradient(to bottom, black 80%, transparent 100%)`;

export function Ejubejuailo({ className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      data-heritage="ejubejuailo-iyoba"
      className={`
        ejubejuailo
        pointer-events-none absolute
        top-0 right-0
        h-full aspect-[1483/2000]
        translate-x-[45%]
        ${className}
      `}
      style={{
        WebkitMaskImage: FADE_MASK,
        maskImage: FADE_MASK,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <Image
        src="/ejubejuailo.jpg"
        alt=""
        fill
        sizes="60vw"
        priority
        className="
          object-cover object-center
          select-none
        "
      />
    </div>
  );
}
