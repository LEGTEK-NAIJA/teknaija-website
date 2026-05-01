import { requireAdminSession } from "@/lib/admin/auth";
import { PageHeader } from "@/lib/admin/ui";

import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  await requireAdminSession();
  return (
    <>
      <PageHeader
        title="New project"
        description="Add a portfolio entry. Fields marked with * are required."
      />
      <ProjectForm mode="create" />
    </>
  );
}
