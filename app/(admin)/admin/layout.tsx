import type { ReactNode } from "react";

export const metadata = {
  title: "TEK NAIJA — Admin",
  robots: { index: false, follow: false },
};

/**
 * Outer admin layout. Intentionally a passthrough — the auth-gated shell
 * lives in `(authed)/layout.tsx` so the login route can render without
 * inheriting the chrome or bouncing redirects.
 */
export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      data-theme="light"
      className="min-h-dvh bg-slate-50 text-slate-900 font-sans"
    >
      {children}
    </div>
  );
}
