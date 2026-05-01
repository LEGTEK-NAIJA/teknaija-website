"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
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
  const { error } = await supabase.from("posts").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    dek: parsed.data.dek || null,
    body: parsed.data.body,
    author_name: parsed.data.author_name || null,
    status: parsed.data.status,
    published_at: toPublishedAtIso(parsed.data.published_at),
  });

  if (error) {
    console.error("[admin/posts.create]", error);
    return { ok: false, error: error.message };
  }

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
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/posts.update]", { id, error });
    return { ok: false, error: error.message };
  }

  revalidatePostRoutes(parsed.data.slug);
  redirect("/admin/posts");
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  await requireAdminSession();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("[admin/posts.delete]", { id, error });
    return { ok: false, error: error.message };
  }

  revalidatePostRoutes();
  return { ok: true };
}
