import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader, PrimaryButton, StatusPill } from "@/lib/admin/ui";

import { deletePostAction } from "./actions";
import { DeleteButton } from "../projects/delete-button";

export const dynamic = "force-dynamic";

type PostListRow = {
  id: string;
  slug: string | null;
  title: string | null;
  dek: string | null;
  status: string | null;
  published_at: string | null;
  author_name: string | null;
};

async function fetchPosts(): Promise<PostListRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, dek, status, published_at, author_name")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[admin/posts.list]", error);
    return [];
  }
  return (data as PostListRow[]) ?? [];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPostsListPage() {
  await requireAdminSession();
  const posts = await fetchPosts();

  return (
    <>
      <PageHeader
        title="Posts"
        description="Insights and editorial shown on /insights."
        actions={
          <Link href="/admin/posts/new">
            <PrimaryButton type="button">New post</PrimaryButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Author</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Published</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No posts yet.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 align-middle">
                    <span className="font-medium text-slate-900">
                      {p.title ?? "—"}
                    </span>
                    {p.dek ? (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {p.dek}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-middle font-mono text-xs text-slate-600">
                    {p.slug ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {p.author_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusPill
                      tone={p.status === "published" ? "green" : "amber"}
                    >
                      {p.status ?? "draft"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    {formatDate(p.published_at)}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${p.id}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        label={p.title ?? "this post"}
                        id={p.id}
                        action={deletePostAction}
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
