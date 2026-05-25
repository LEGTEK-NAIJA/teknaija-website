import { createBrowserClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

export type DeleteResult =
  | { ok: true; deleted: boolean }
  | { ok: false; error: string };

/**
 * Extract the storage path from a public URL like:
 *   https://<ref>.supabase.co/storage/v1/object/public/post-images/2026/1234567890-photo.jpg
 */
export function extractPostImagePath(url: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0];
}

export async function deletePostImage(url: string): Promise<DeleteResult> {
  const path = extractPostImagePath(url);
  if (!path) {
    return { ok: true, deleted: false };
  }
  const supabase = createBrowserClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true, deleted: true };
}
