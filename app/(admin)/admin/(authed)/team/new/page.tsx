import { requireAdminSession } from "@/lib/admin/auth";
import { PageHeader } from "@/lib/admin/ui";

import { TeamForm } from "../team-form";

export default async function NewTeamMemberPage() {
  await requireAdminSession();
  return (
    <>
      <PageHeader
        title="New team member"
        description="Add a leadership or masthead entry."
      />
      <TeamForm mode="create" />
    </>
  );
}
