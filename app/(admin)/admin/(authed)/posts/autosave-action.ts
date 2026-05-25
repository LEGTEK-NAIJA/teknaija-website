"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/auth";
import { deletePostImagesServer } from "@/lib/storage/delete-post-images-server";
import { extractPostImagePath } from "@/lib/storage/delete-post-image";
import { extractPostImagePaths } from "@/lib/storage/extract-post-image-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PostAutosaveSchema, type PostFormValues } from "./schema";

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function resolveAutosaveSlug(slug: string, title: string): string {
  const trimmed = slug.trim();
  return trimmed.length > 0 ? trimmed : slugFromTitle(title);
}

function toPublishedAtIso(input: string | undefined | null) {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00Z`).toISOString();
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toCoverImageUrl(input: string | undefined | null) {
  const trimmed = (input ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export type AutosaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function autosaveCreatePostAction(
  values: PostFormValues
): Promise<AutosaveResult> {
  await requireAdminSession();

  const parsed = PostAutosaveSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed.",
    };
  }

  const slug = resolveAutosaveSlug(parsed.data.slug, parsed.data.title);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      slug,
      title: parsed.data.title,
      dek: parsed.data.dek || null,
      body: parsed.data.body,
      author_name: parsed.data.author_name || null,
      status: parsed.data.status,
      published_at: toPublishedAtIso(parsed.data.published_at),
      cover_image: toCoverImageUrl(parsed.data.cover_image),
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[admin/posts.autosave.create]", error);
    return { ok: false, error: error?.message ?? "Insert failed." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin");
  return { ok: true, id: data.id };
}

export async function autosaveUpdatePostAction(
  id: string,
  values: PostFormValues
): Promise<AutosaveResult> {
  await requireAdminSession();

  const parsed = PostAutosaveSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed.",
    };
  }

  const slug = resolveAutosaveSlug(parsed.data.slug, parsed.data.title);

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("body, cover_image")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("posts")
    .update({
      slug,
      title: parsed.data.title,
      dek: parsed.data.dek || null,
      body: parsed.data.body,
      author_name: parsed.data.author_name || null,
      status: parsed.data.status,
      published_at: toPublishedAtIso(parsed.data.published_at),
      cover_image: toCoverImageUrl(parsed.data.cover_image),
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/posts.autosave.update]", { id, error });
    return { ok: false, error: error.message };
  }

  if (existing) {
    const coverUrl = toCoverImageUrl(parsed.data.cover_image);
    const oldPaths = new Set<string>([
      ...extractPostImagePaths(existing.body ?? ""),
      ...(existing.cover_image
        ? [extractPostImagePath(existing.cover_image)].filter(
            (p): p is string => !!p
          )
        : []),
    ]);
    const newPaths = new Set<string>([
      ...extractPostImagePaths(parsed.data.body ?? ""),
      ...(coverUrl
        ? [extractPostImagePath(coverUrl)].filter((p): p is string => !!p)
        : []),
    ]);
    const orphans = [...oldPaths].filter((p) => !newPaths.has(p));
    if (orphans.length) void deletePostImagesServer(orphans);
  }

  revalidatePath("/admin/posts");
  return { ok: true, id };
}
