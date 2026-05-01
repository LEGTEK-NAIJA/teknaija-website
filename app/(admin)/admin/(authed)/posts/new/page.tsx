import { requireAdminSession } from "@/lib/admin/auth";
import { PageHeader } from "@/lib/admin/ui";

import { PostForm } from "../post-form";

export default async function NewPostPage() {
  await requireAdminSession();
  return (
    <>
      <PageHeader
        title="New post"
        description="Write an insights piece. Drafts stay hidden from the marketing site until status is set to published."
      />
      <PostForm mode="create" />
    </>
  );
}
