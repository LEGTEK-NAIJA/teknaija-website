import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getAdminSession } from "./auth";

export type AuditEntityType = "post" | "project" | "team_member" | "testimonial";
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "autosave_create"
  | "autosave_update";

export type AuditEvent = {
  action: AuditAction;
  entity_type: AuditEntityType;
  entity_id?: string | null;
  entity_label?: string | null;
};

export async function recordAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const session = await getAdminSession();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("admin_audit_log").insert({
      actor_email: session?.email ?? null,
      action: event.action,
      entity_type: event.entity_type,
      entity_id: event.entity_id ?? null,
      entity_label: event.entity_label ?? null,
    });
    if (error) {
      console.error("[audit]", error);
    }
  } catch (err) {
    console.error("[audit] unexpected error", err);
  }
}

function testimonialLabel(values: {
  author_name?: string;
  quote: string;
}): string {
  const name = (values.author_name ?? "").trim();
  if (name) return name;
  return values.quote.slice(0, 60);
}

export { testimonialLabel };
