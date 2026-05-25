"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ProjectFormSchema, type ProjectFormValues } from "./schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function toCoverImageUrl(input: string | undefined | null) {
  const trimmed = (input ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function projectPayload(parsed: ProjectFormValues) {
  return {
    slug: parsed.slug,
    title: parsed.title,
    sector: parsed.sector,
    status: parsed.status,
    body: parsed.body,
    featured: parsed.featured,
    display_order: parsed.display_order,
    cover_image: toCoverImageUrl(parsed.cover_image),
    stack: parsed.stack,
    gallery_images: parsed.gallery_images,
    outcomes: parsed.outcomes,
  };
}

function revalidateProjectRoutes() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/work");
  revalidatePath("/", "layout");
}

export async function createProjectAction(
  values: ProjectFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = ProjectFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for project.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").insert(projectPayload(parsed.data));

  if (error) {
    console.error("[admin/projects.create]", error);
    return { ok: false, error: error.message };
  }

  revalidateProjectRoutes();
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  values: ProjectFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = ProjectFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for project.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update(projectPayload(parsed.data))
    .eq("id", id);

  if (error) {
    console.error("[admin/projects.update]", { id, error });
    return { ok: false, error: error.message };
  }

  revalidateProjectRoutes();
  if (parsed.data.slug) revalidatePath(`/work/${parsed.data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdminSession();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("[admin/projects.delete]", { id, error });
    return { ok: false, error: error.message };
  }

  revalidateProjectRoutes();
  return { ok: true };
}
