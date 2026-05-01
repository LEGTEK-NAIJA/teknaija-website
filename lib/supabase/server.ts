import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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
  // `cookies()` rejects (or trips Next's static-context check) when called
  // outside of an HTTP request — e.g. during `generateStaticParams` or while
  // prerendering routes that declared static params. In those build-time
  // paths there is no user session to forward anyway, so we transparently
  // fall back to the cookie-less anon client and the public reads still work.
  try {
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
              // setAll is called from Server Components where cookie writes
              // are a no-op; middleware refreshes sessions instead.
            }
          },
        },
      }
    );
  } catch {
    return createSupabaseAnonClient();
  }
}

/**
 * Build-time / static-context client. `generateStaticParams` runs without an
 * HTTP request, so it cannot call `cookies()`. This client uses the public
 * anon key directly via @supabase/supabase-js and is safe to use anywhere
 * that does not need a user session — e.g. enumerating public slugs at build
 * time, or in route handlers running outside of a request context.
 */
export function createSupabaseAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
