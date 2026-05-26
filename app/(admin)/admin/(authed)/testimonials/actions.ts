"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { recordAuditEvent, testimonialLabel } from "@/lib/admin/audit";
import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  TestimonialFormSchema,
  type TestimonialFormValues,
} from "./schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateTestimonialRoutes() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

export async function createTestimonialAction(
  values: TestimonialFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = TestimonialFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for testimonial.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      quote: parsed.data.quote,
      author_name: parsed.data.author_name || null,
      author_role: parsed.data.author_role || null,
      author_org: parsed.data.author_org || null,
      active: parsed.data.active,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[admin/testimonials.create]", error);
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "create",
    entity_type: "testimonial",
    entity_id: data?.id,
    entity_label: testimonialLabel(parsed.data),
  });

  revalidateTestimonialRoutes();
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(
  id: string,
  values: TestimonialFormValues
): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = TestimonialFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Validation failed for testimonial.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      quote: parsed.data.quote,
      author_name: parsed.data.author_name || null,
      author_role: parsed.data.author_role || null,
      author_org: parsed.data.author_org || null,
      active: parsed.data.active,
    })
    .eq("id", id);

  if (error) {
    console.error("[admin/testimonials.update]", { id, error });
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "update",
    entity_type: "testimonial",
    entity_id: id,
    entity_label: testimonialLabel(parsed.data),
  });

  revalidateTestimonialRoutes();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(
  id: string
): Promise<ActionResult> {
  await requireAdminSession();

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("testimonials")
    .select("author_name, quote")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("[admin/testimonials.delete]", { id, error });
    return { ok: false, error: error.message };
  }

  await recordAuditEvent({
    action: "delete",
    entity_type: "testimonial",
    entity_id: id,
    entity_label: existing
      ? testimonialLabel({
          author_name: existing.author_name ?? "",
          quote: existing.quote ?? "",
        })
      : null,
  });

  revalidateTestimonialRoutes();
  return { ok: true };
}
