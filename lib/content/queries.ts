import { createSupabaseAnonClient } from "@/lib/supabase/server";
import type { PostRow, ProjectRow, TeamMemberRow } from "./types";

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

const PROJECT_COLUMNS =
  "slug, title, sector, status, body, cover_image, gallery_images, stack, outcomes, featured, display_order";

export async function fetchAllProjects(): Promise<ProjectRow[]> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[fetchAllProjects]", error);
    return [];
  }
  return (data as ProjectRow[]) ?? [];
}

export async function fetchProjectBySlug(
  slug: string
): Promise<ProjectRow | null> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[fetchProjectBySlug]", { slug, error });
    return null;
  }
  return (data as ProjectRow | null) ?? null;
}

export async function fetchProjectSlugs(): Promise<string[]> {
  // Uses the cookie-less anon client because `generateStaticParams` runs at
  // build time without an HTTP request.
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.from("projects").select("slug");

  if (error) {
    console.error("[fetchProjectSlugs]", error);
    return [];
  }
  return (data ?? [])
    .map((r) => (r as { slug: string | null }).slug)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                       */
/* -------------------------------------------------------------------------- */

const POST_COLUMNS =
  "slug, title, dek, body, cover_image, published_at, status";

export async function fetchPublishedPosts(): Promise<PostRow[]> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[fetchPublishedPosts]", error);
    return [];
  }
  return (data as PostRow[]) ?? [];
}

export async function fetchPostBySlug(slug: string): Promise<PostRow | null> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[fetchPostBySlug]", { slug, error });
    return null;
  }
  return (data as PostRow | null) ?? null;
}

export async function fetchPostSlugs(): Promise<string[]> {
  // Cookie-less client (see fetchProjectSlugs).
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("[fetchPostSlugs]", error);
    return [];
  }
  return (data ?? [])
    .map((r) => (r as { slug: string | null }).slug)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
}

/* -------------------------------------------------------------------------- */
/* Team members                                                                */
/* -------------------------------------------------------------------------- */

export async function fetchTeam(): Promise<TeamMemberRow[]> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("name, role, bio, headshot, display_order, active")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[fetchTeam]", error);
    return [];
  }
  return (data as TeamMemberRow[]) ?? [];
}
