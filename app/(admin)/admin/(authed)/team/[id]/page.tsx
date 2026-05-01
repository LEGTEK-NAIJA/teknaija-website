import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/lib/admin/ui";

import { TeamForm } from "../team-form";
import { TEAM_DEFAULTS, type TeamFormValues } from "../schema";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, bio, display_order, active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/team.edit.fetch]", { id, error });
  }
  if (!data) notFound();

  const row = data as {
    name: string | null;
    role: string | null;
    bio: string | null;
    display_order: number | null;
    active: boolean | null;
  };

  const defaults: TeamFormValues = {
    ...TEAM_DEFAULTS,
    name: row.name ?? "",
    role: row.role ?? "",
    bio: row.bio ?? "",
    display_order: row.display_order ?? 0,
    active: row.active ?? true,
  };

  return (
    <>
      <PageHeader
        title="Edit team member"
        description={row.name ? `Editing ${row.name}.` : "Edit team member."}
      />
      <TeamForm mode="edit" id={id} defaultValues={defaults} />
    </>
  );
}
