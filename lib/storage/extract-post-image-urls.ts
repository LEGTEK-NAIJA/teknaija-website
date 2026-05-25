const BUCKET = "post-images";

/**
 * Returns storage paths (e.g. "2026/123-photo.jpg") for every post-images URL in `text`.
 */
export function extractPostImagePaths(
  text: string | null | undefined
): Set<string> {
  const paths = new Set<string>();
  if (!text) return paths;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`${escaped}([^\\s)"']+)`, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const path = match[1].split("?")[0];
    if (path) paths.add(path);
  }
  return paths;
}
