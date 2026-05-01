import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * HeritageImage — atmospheric heritage layer.
 *
 * Imagery is felt, not displayed: rendered behind page content, dissolved
 * into the indigo ground via low opacity, mix-blend-mode, and a CSS mask
 * gradient that softens edges to nothing.
 *
 * Stacking: each call site decides its own z-index by including a `z-*`
 * (or `-z-*`) utility in `positionClassName`. The marketing <main> is
 * `isolate` (a stacking context), so a `-z-10` wrapper paints between
 * page background and static text content within main; a hero whose own
 * box already has an opaque background may instead want a positive or
 * default z so the layer sits above other atmospheric layers.
 */

type BlendMode =
  | "normal"
  | "luminosity"
  | "screen"
  | "multiply"
  | "overlay"
  | "soft-light"
  | "color-dodge"
  | "color-burn";

type MaskComposite = "add" | "subtract" | "intersect" | "exclude";

const WEBKIT_COMPOSITE: Record<MaskComposite, string> = {
  add: "source-over",
  subtract: "source-out",
  intersect: "source-in",
  exclude: "xor",
};

type Props = {
  src: string;
  /** Tailwind classes that determine wrapper position + size (must be `fixed` or `absolute`). */
  positionClassName: string;
  opacity: number;
  blendMode: BlendMode;
  /** CSS mask-image string (one or more gradients, comma separated). */
  maskImage?: string;
  /** When passing multiple mask layers, pick how they combine. */
  maskComposite?: MaskComposite;
  /** Required: passed through to next/image to size the source. */
  sizes: string;
  /** object-position value (e.g. "right bottom"). Defaults to "center". */
  objectPosition?: string;
  /** Defaults to cover; use contain when the art should letterbox inside the frame. */
  objectFit?: "cover" | "contain";
};

export function HeritageImage({
  src,
  positionClassName,
  opacity,
  blendMode,
  maskImage,
  maskComposite,
  sizes,
  objectPosition = "center",
  objectFit = "cover",
}: Props) {
  const style: CSSProperties = {
    opacity,
    mixBlendMode: blendMode,
    ...(maskImage
      ? {
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          ...(maskComposite
            ? {
                maskComposite,
                WebkitMaskComposite: WEBKIT_COMPOSITE[maskComposite],
              }
            : {}),
        }
      : {}),
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${positionClassName}`}
      style={style}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={false}
        sizes={sizes}
        className={objectFit === "contain" ? "object-contain" : "object-cover"}
        style={{ objectPosition }}
      />
    </div>
  );
}
