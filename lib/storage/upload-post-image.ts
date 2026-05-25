import { createBrowserClient } from "@/lib/supabase/client";

const BUCKET = "post-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string };

export async function uploadPostImage(file: File): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) {
    return {
      ok: false,
      error: `Unsupported type: ${file.type}. Use JPEG, PNG, WebP, GIF, or AVIF.`,
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 5 MB.`,
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  const path = `${new Date().getFullYear()}/${Date.now()}-${base}.${ext}`;

  const supabase = createBrowserClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, path };
}
