import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader, PrimaryButton, StatusPill } from "@/lib/admin/ui";

import { deleteTeamMemberAction } from "./actions";
import { DeleteButton } from "../projects/delete-button";

export const dynamic = "force-dynamic";

type TeamListRow = {
  id: string;
  name: string | null;
  role: string | null;
  display_order: number | null;
  active: boolean | null;
};

async function fetchTeamMembers(): Promise<TeamListRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, display_order, active")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/team.list]", error);
    return [];
  }
  return (data as TeamListRow[]) ?? [];
}

export default async function AdminTeamListPage() {
  await requireAdminSession();
  const team = await fetchTeamMembers();

  return (
    <>
      <PageHeader
        title="Team"
        description="Leadership and masthead entries shown on /about."
        actions={
          <Link href="/admin/team/new">
            <PrimaryButton type="button">New team member</PrimaryButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No team members yet.
                </td>
              </tr>
            ) : (
              team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 align-middle font-medium text-slate-900">
                    {m.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {m.role ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {m.display_order ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusPill tone={m.active ? "green" : "neutral"}>
                      {m.active ? "active" : "inactive"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/team/${m.id}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        label={m.name ?? "this team member"}
                        id={m.id}
                        action={deleteTeamMemberAction}
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
