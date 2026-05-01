import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/lib/admin/ui";

import { PostForm } from "../post-form";
import {
  POST_DEFAULTS,
  PostStatuses,
  type PostFormValues,
  type PostStatus,
} from "../schema";

export const dynamic = "force-dynamic";

function coerceStatus(raw: string | null | undefined): PostStatus {
  const v = (raw ?? "").toLowerCase();
  return (PostStatuses as readonly string[]).includes(v)
    ? (v as PostStatus)
    : "draft";
}

function isoToInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, dek, body, author_name, status, published_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/posts.edit.fetch]", { id, error });
  }
  if (!data) notFound();

  const row = data as {
    slug: string | null;
    title: string | null;
    dek: string | null;
    body: string | null;
    author_name: string | null;
    status: string | null;
    published_at: string | null;
  };

  const defaults: PostFormValues = {
    ...POST_DEFAULTS,
    slug: row.slug ?? "",
    title: row.title ?? "",
    dek: row.dek ?? "",
    body: row.body ?? "",
    author_name: row.author_name ?? "",
    status: coerceStatus(row.status),
    published_at: isoToInputDate(row.published_at),
  };

  return (
    <>
      <PageHeader
        title="Edit post"
        description={row.title ? `Editing “${row.title}”.` : "Edit post."}
      />
      <PostForm mode="edit" id={id} defaultValues={defaults} />
    </>
  );
}
