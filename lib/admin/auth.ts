import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
};

/**
 * Resolve the active Supabase user from request cookies. Memoised per render
 * so multiple admin server components can call it without round-tripping
 * Supabase Auth on every call.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return { userId: user.id, email: user.email ?? "" };
});

/**
 * Hard guard for admin server components, server actions and route handlers.
 * Redirects unauthenticated callers to the login screen.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
