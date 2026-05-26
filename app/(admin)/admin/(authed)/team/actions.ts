"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { recordAuditEvent } from "@/lib/admin/audit";
import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { TeamFormSchema, type TeamFormValues } from "./schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function toHeadshotUrl(input: string | undefined | null) {
  const trimmed = (input ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function revalidateTeamRoutes() {
  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/about");
  revalidatePath("/", "layout");
}

export async function createTeamMemberAction(
  values: TeamFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = TeamFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for team member.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      display_order: parsed.data.display_order,
      active: parsed.data.active,
      headshot: toHeadshotUrl(parsed.data.headshot),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[admin/team.create]", error);
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "create",
    entity_type: "team_member",
    entity_id: data?.id,
    entity_label: parsed.data.name,
  });

  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function updateTeamMemberAction(
  id: string,
  values: TeamFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = TeamFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for team member.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("team_members")
    .update({
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      display_order: parsed.data.display_order,
      active: parsed.data.active,
      headshot: toHeadshotUrl(parsed.data.headshot),
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/team.update]", { id, error });
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "update",
    entity_type: "team_member",
    entity_id: id,
    entity_label: parsed.data.name,
  });

  revalidateTeamRoutes();
  redirect("/admin/team");
}

export async function deleteTeamMemberAction(
  id: string
): Promise<ActionResult> {
  await requireAdminSession();

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("team_members")
    .select("name")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) {
    console.error("[admin/team.delete]", { id, error });
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "delete",
    entity_type: "team_member",
    entity_id: id,
    entity_label: existing?.name ?? null,
  });

  revalidateTeamRoutes();
  return { ok: true };
}
