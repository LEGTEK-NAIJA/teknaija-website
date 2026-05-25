"use client";

import { createBrowserClient } from "@/lib/supabase/client";

export type DeleteResult =
  | { ok: true; deleted: boolean }
  | { ok: false; error: string };

export function extractImagePath(url: string, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0];
}

export async function deleteImage(
  url: string,
  bucket: string
): Promise<DeleteResult> {
  const path = extractImagePath(url, bucket);
  if (!path) return { ok: true, deleted: false };
  const supabase = createBrowserClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true, deleted: true };
}
