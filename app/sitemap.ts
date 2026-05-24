import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://teknaija.legtek.ng";

// Static marketing routes
const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE}/`,              changeFrequency: "weekly", priority: 1.0 },
  { url: `${SITE}/work`,          changeFrequency: "monthly", priority: 0.9 },
  { url: `${SITE}/capabilities`,  changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE}/about`,         changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE}/insights`,      changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE}/contact`,       changeFrequency: "yearly",  priority: 0.5 },
  { url: `${SITE}/status`,        changeFrequency: "always",  priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Build dynamic routes from Supabase: projects and posts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticRoutes;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase.from("projects").select("slug, updated_at"),
    supabase.from("posts").select("slug, updated_at").eq("status", "published"),
  ]);

  const projectRoutes: MetadataRoute.Sitemap =
    projects?.map((p) => ({
      url: `${SITE}/work/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })) ?? [];

  const postRoutes: MetadataRoute.Sitemap =
    posts?.map((p) => ({
      url: `${SITE}/insights/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })) ?? [];

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
