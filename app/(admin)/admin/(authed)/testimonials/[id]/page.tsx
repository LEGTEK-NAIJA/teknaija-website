import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/lib/admin/ui";

import { TestimonialForm } from "../testimonial-form";
import {
  TESTIMONIAL_DEFAULTS,
  type TestimonialFormValues,
} from "../schema";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_role, author_org, active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/testimonials.edit.fetch]", { id, error });
  }
  if (!data) notFound();

  const row = data as {
    quote: string | null;
    author_name: string | null;
    author_role: string | null;
    author_org: string | null;
    active: boolean | null;
  };

  const defaults: TestimonialFormValues = {
    ...TESTIMONIAL_DEFAULTS,
    quote: row.quote ?? "",
    author_name: row.author_name ?? "",
    author_role: row.author_role ?? "",
    author_org: row.author_org ?? "",
    active: row.active ?? true,
  };

  return (
    <>
      <PageHeader
        title="Edit testimonial"
        description={
          row.author_name
            ? `Editing quote by ${row.author_name}.`
            : "Edit testimonial."
        }
      />
      <TestimonialForm mode="edit" id={id} defaultValues={defaults} />
    </>
  );
}
