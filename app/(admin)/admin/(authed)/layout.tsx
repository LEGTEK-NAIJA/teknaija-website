import type { ReactNode } from "react";
import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { signOutAction } from "../logout/actions";
import { AdminNavLinks } from "./nav-links";

export default async function AuthedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-3">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-tight text-slate-900"
            >
              TEK NAIJA{" "}
              <span className="font-normal text-slate-500">/ Admin</span>
            </Link>
            <AdminNavLinks variant="desktop" />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {session.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="
                  rounded-md border border-slate-300 bg-white px-3 py-1.5
                  text-xs font-medium text-slate-700
                  hover:bg-slate-50
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2
                "
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <AdminNavLinks variant="mobile" />
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-8">{children}</main>
    </>
  );
}
