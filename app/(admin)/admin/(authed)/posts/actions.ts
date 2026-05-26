"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { recordAuditEvent } from "@/lib/admin/audit";
import { requireAdminSession } from "@/lib/admin/auth";
import { deletePostImagesServer } from "@/lib/storage/delete-post-images-server";
import { extractPostImagePaths } from "@/lib/storage/extract-post-image-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PostFormSchema, type PostFormValues } from "./schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidatePostRoutes(slug?: string) {
  revalidatePath("/admin/posts");
  revalidatePath("/admin");
  revalidatePath("/insights");
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/insights/${slug}`);
}

function toPublishedAtIso(input: string | undefined | null) {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  // <input type="date"> emits YYYY-MM-DD. Promote to UTC ISO at midnight.
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

export async function createPostAction(
  values: PostFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = PostFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed for post.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      slug: parsed.data.slug,
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

  if (error) {
    console.error("[admin/posts.create]", error);
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "create",
    entity_type: "post",
    entity_id: data?.id,
    entity_label: parsed.data.title,
  });

  revalidatePostRoutes(parsed.data.slug);
  redirect("/admin/posts");
}

export async function updatePostAction(
  id: string,
  values: PostFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = PostFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed for post.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("body, cover_image")
    .eq("id", id)
    .single();

  const oldPaths = new Set<string>([
    ...extractPostImagePaths(existing?.body),
    ...extractPostImagePaths(existing?.cover_image),
  ]);
  const newPaths = new Set<string>([
    ...extractPostImagePaths(parsed.data.body),
    ...extractPostImagePaths(toCoverImageUrl(parsed.data.cover_image)),
  ]);
  const orphaned: string[] = [];
  for (const p of oldPaths) {
    if (!newPaths.has(p)) orphaned.push(p);
  }

  const { error } = await supabase
    .from("posts")
    .update({
      slug: parsed.data.slug,
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
    console.error("[admin/posts.update]", { id, error });
    return { ok: false, error: error.message };
  }

  if (orphaned.length > 0) {
    await deletePostImagesServer(orphaned).catch((e) =>
      console.warn("[storage cleanup] post-save sweep failed:", e)
    );
  }

  await recordAuditEvent({
    action: "update",
    entity_type: "post",
    entity_id: id,
    entity_label: parsed.data.title,
  });

  revalidatePostRoutes(parsed.data.slug);
  redirect("/admin/posts");
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  await requireAdminSession();

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("title, body, cover_image")
    .eq("id", id)
    .single();

  if (existing) {
    const allPaths = new Set<string>([
      ...extractPostImagePaths(existing.body),
      ...extractPostImagePaths(existing.cover_image),
    ]);
    if (allPaths.size > 0) {
      await deletePostImagesServer([...allPaths]).catch((e) =>
        console.warn("[storage cleanup] post-delete sweep failed:", e)
      );
    }
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("[admin/posts.delete]", { id, error });
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "delete",
    entity_type: "post",
    entity_id: id,
    entity_label: existing?.title ?? null,
  });

  revalidatePostRoutes();
  return { ok: true };
}
