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
      "id, slug, title, sector, status, body, featured, display_order"
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
