import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/lib/admin/ui";

import { AuditFilters } from "./AuditFilters";

type SearchParams = {
  entity?: string;
  actor?: string;
  from?: string;
  to?: string;
};

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdminSession();
  const params = await searchParams;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (params.entity && params.entity !== "all") {
    query = query.eq("entity_type", params.entity);
  }
  if (params.actor) {
    query = query.eq("actor_email", params.actor);
  }
  if (params.from) {
    query = query.gte("created_at", params.from);
  }
  if (params.to) {
    const toDate = new Date(params.to);
    toDate.setUTCDate(toDate.getUTCDate() + 1);
    query = query.lt("created_at", toDate.toISOString());
  }

  const { data: rows, error } = await query;
  if (error) console.error("[audit/page]", error);

  const { data: actorsData } = await supabase
    .from("admin_audit_log")
    .select("actor_email")
    .not("actor_email", "is", null);
  const actors = Array.from(
    new Set((actorsData ?? []).map((r) => r.actor_email).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Append-only record of admin edits across posts, projects, team, and testimonials. Retained 180 days."
      />

      <AuditFilters actors={actors} initial={params} />

      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <Th>When</Th>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th>Entity</Th>
              <Th>Label</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {(rows ?? []).map((row) => (
              <tr key={row.id}>
                <Td className="whitespace-nowrap font-mono text-xs text-slate-600">
                  {formatTimestamp(row.created_at)}
                </Td>
                <Td className="font-mono text-xs text-slate-600">
                  {row.actor_email ?? "—"}
                </Td>
                <Td>
                  <ActionPill action={row.action} />
                </Td>
                <Td className="text-slate-700">
                  {prettyEntity(row.entity_type)}
                </Td>
                <Td className="text-slate-900">{row.entity_label ?? "—"}</Td>
              </tr>
            ))}
            {(rows ?? []).length === 0 && (
              <tr>
                <Td colSpan={5} className="text-center text-sm text-slate-500">
                  No events match these filters.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Showing up to 500 rows. Older rows beyond 180 days are pruned daily.
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-4 py-3 ${className}`}>
      {children}
    </td>
  );
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const lagos = new Date(d.getTime() + 60 * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${lagos.getUTCFullYear()}-${pad(lagos.getUTCMonth() + 1)}-${pad(lagos.getUTCDate())} ${pad(lagos.getUTCHours())}:${pad(lagos.getUTCMinutes())}`;
}

function prettyEntity(t: string) {
  switch (t) {
    case "post":
      return "Post";
    case "project":
      return "Project";
    case "team_member":
      return "Team member";
    case "testimonial":
      return "Testimonial";
    default:
      return t;
  }
}

function ActionPill({ action }: { action: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> =
    {
      create: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Create" },
      update: { bg: "bg-blue-50", text: "text-blue-700", label: "Update" },
      delete: { bg: "bg-red-50", text: "text-red-700", label: "Delete" },
      autosave_create: {
        bg: "bg-slate-100",
        text: "text-slate-600",
        label: "Autosave (create)",
      },
      autosave_update: {
        bg: "bg-slate-100",
        text: "text-slate-500",
        label: "Autosave",
      },
    };
  const c = config[action] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: action,
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}
