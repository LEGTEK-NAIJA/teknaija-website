/**
 * Shared row shapes for marketing pages. Kept defensive (most fields nullable)
 * because the live Supabase schema can drift slightly ahead of the spec while
 * the CMS is still being built.
 */

export type ProjectRow = {
  slug: string | null;
  title: string | null;
  sector: string | null;
  status: string | null;
  body: string | null;
  cover_image?: string | null;
  gallery_images?: unknown;
  stack?: unknown;
  outcomes?: unknown;
  featured?: boolean | null;
  display_order?: number | null;
};

export type PostRow = {
  slug: string | null;
  title: string | null;
  dek: string | null;
  body: string | null;
  cover_image?: string | null;
  published_at: string | null;
  status?: string | null;
};

export type TeamMemberRow = {
  name: string | null;
  role: string | null;
  bio: string | null;
  headshot?: string | null;
  display_order?: number | null;
  active?: boolean | null;
};

export type StackEntry = {
  label: string;
  value: string;
};

export type OutcomeEntry = {
  label: string;
  value: string;
};
