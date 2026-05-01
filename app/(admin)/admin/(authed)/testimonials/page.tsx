import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader, PrimaryButton, StatusPill } from "@/lib/admin/ui";

import { deleteTestimonialAction } from "./actions";
import { DeleteButton } from "../projects/delete-button";

export const dynamic = "force-dynamic";

type TestimonialListRow = {
  id: string;
  quote: string | null;
  author_name: string | null;
  author_role: string | null;
  author_org: string | null;
  active: boolean | null;
};

async function fetchTestimonials(): Promise<TestimonialListRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_role, author_org, active")
    .order("id", { ascending: true });

  if (error) {
    console.error("[admin/testimonials.list]", error);
    return [];
  }
  return (data as TestimonialListRow[]) ?? [];
}

function truncate(value: string | null, max = 140) {
  if (!value) return "—";
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

export default async function AdminTestimonialsListPage() {
  await requireAdminSession();
  const testimonials = await fetchTestimonials();

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Pull quotes from clients and partners. Active entries rotate on the homepage Voices section."
        actions={
          <Link href="/admin/testimonials/new">
            <PrimaryButton type="button">New testimonial</PrimaryButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Quote</th>
              <th className="px-4 py-2 font-medium">Attribution</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No testimonials yet.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 align-top text-slate-800">
                    {truncate(t.quote)}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {t.author_name ?? "—"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {[t.author_role, t.author_org]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusPill tone={t.active ? "green" : "neutral"}>
                      {t.active ? "active" : "inactive"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/testimonials/${t.id}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        label="this testimonial"
                        id={t.id}
                        action={deleteTestimonialAction}
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
