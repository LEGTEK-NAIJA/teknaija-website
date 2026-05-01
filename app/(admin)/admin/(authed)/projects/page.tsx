import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader, PrimaryButton, StatusPill } from "@/lib/admin/ui";

import { deleteProjectAction } from "./actions";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

type ProjectListRow = {
  id: string;
  slug: string | null;
  title: string | null;
  sector: string | null;
  status: string | null;
  featured: boolean | null;
  display_order: number | null;
};

async function fetchProjects(): Promise<ProjectListRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, sector, status, featured, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/projects.list]", error);
    return [];
  }
  return (data as ProjectListRow[]) ?? [];
}

function statusTone(status: string | null) {
  const s = (status ?? "").toLowerCase();
  if (s === "live" || s === "active") return "green" as const;
  if (s === "forthcoming") return "amber" as const;
  if (s === "archived") return "neutral" as const;
  return "neutral" as const;
}

export default async function AdminProjectsListPage() {
  await requireAdminSession();
  const projects = await fetchProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies and portfolio entries shown on /work."
        actions={
          <Link href="/admin/projects/new">
            <PrimaryButton type="button">New project</PrimaryButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Sector</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Featured</th>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No projects yet.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 align-middle">
                    <span className="font-medium text-slate-900">
                      {p.title ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle font-mono text-xs text-slate-600">
                    {p.slug ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {p.sector ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusPill tone={statusTone(p.status)}>
                      {p.status ?? "—"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {p.featured ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {p.display_order ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        label={p.title ?? "this project"}
                        id={p.id}
                        action={deleteProjectAction}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
