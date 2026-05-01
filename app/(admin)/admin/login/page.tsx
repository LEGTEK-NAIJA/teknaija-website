import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in — TEK NAIJA Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            TEK NAIJA / Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter your credentials to manage site content.
          </p>
        </header>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
