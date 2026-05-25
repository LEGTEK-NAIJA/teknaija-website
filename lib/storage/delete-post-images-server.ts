import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "post-images";

/**
 * Delete a batch of post-images files. Failures are logged, not thrown.
 */
export async function deletePostImagesServer(paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.warn(
      "[storage cleanup] remove failed:",
      error.message,
      "paths:",
      paths
    );
    return [];
  }
  return paths;
}
