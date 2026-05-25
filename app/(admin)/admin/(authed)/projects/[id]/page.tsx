import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/lib/admin/ui";

import { ProjectForm } from "../project-form";
import {
  PROJECT_DEFAULTS,
  ProjectStatuses,
  type ProjectFormValues,
  type ProjectStatus,
} from "../schema";

export const dynamic = "force-dynamic";

function coerceStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function coerceOutcomes(
  raw: unknown
): ProjectFormValues["outcomes"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (x): x is { label?: unknown; value?: unknown } =>
        x !== null && typeof x === "object"
    )
    .map((x) => ({
      label: typeof x.label === "string" ? x.label : "",
      value: typeof x.value === "string" ? x.value : "",
    }));
}

function coerceStatus(raw: string | null | undefined): ProjectStatus {
  const v = (raw ?? "").toLowerCase();
  return (ProjectStatuses as readonly string[]).includes(v)
    ? (v as ProjectStatus)
    : "draft";
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, sector, status, body, featured, display_order, cover_image, stack, gallery_images, outcomes"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/projects.edit.fetch]", { id, error });
  }
  if (!data) notFound();

  const row = data as {
    slug: string | null;
    title: string | null;
    sector: string | null;
    status: string | null;
    body: string | null;
    featured: boolean | null;
    display_order: number | null;
    cover_image: string | null;
    stack: unknown;
    gallery_images: unknown;
    outcomes: unknown;
  };

  const defaults: ProjectFormValues = {
    ...PROJECT_DEFAULTS,
    slug: row.slug ?? "",
    title: row.title ?? "",
    sector: row.sector ?? "",
    status: coerceStatus(row.status),
    body: row.body ?? "",
    featured: Boolean(row.featured),
    display_order: row.display_order ?? 0,
    cover_image: row.cover_image ?? "",
    stack: coerceStringArray(row.stack),
    gallery_images: coerceStringArray(row.gallery_images),
    outcomes: coerceOutcomes(row.outcomes),
  };

  return (
    <>
      <PageHeader
        title="Edit project"
        description={row.title ? `Editing “${row.title}”.` : "Edit project."}
      />
      <ProjectForm mode="edit" id={id} defaultValues={defaults} />
    </>
  );
}
