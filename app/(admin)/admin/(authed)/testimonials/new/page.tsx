import { requireAdminSession } from "@/lib/admin/auth";
import { PageHeader } from "@/lib/admin/ui";

import { TestimonialForm } from "../testimonial-form";

export default async function NewTestimonialPage() {
  await requireAdminSession();
  return (
    <>
      <PageHeader
        title="New testimonial"
        description="Capture a pull-quote attribution. Mark inactive to hide without deleting."
      />
      <TestimonialForm mode="create" />
    </>
  );
}
