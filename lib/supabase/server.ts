import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client that is safe to use in Server Components, Route
 * Handlers, and Server Actions. It reads cookies from the incoming request
 * via `next/headers` so that auth sessions are correctly forwarded.
 *
 * For unauthenticated public reads (as used on the homepage) this is still
 * preferable over the browser singleton in lib/supabase/client.ts because:
 *   - Each request gets its own client instance (no cross-request leakage).
 *   - The cookie plumbing is in place if auth-gated routes are added later.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where cookie writes are
            // a no-op; the middleware is responsible for session refreshing.
          }
        },
      },
    }
  );
}
