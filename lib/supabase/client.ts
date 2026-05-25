import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for client components. Uses cookie-backed auth so
 * storage uploads and other authed calls work after admin login.
 */
export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
