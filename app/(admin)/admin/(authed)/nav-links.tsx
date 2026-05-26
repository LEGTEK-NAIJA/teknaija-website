"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { href: string; label: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/audit", label: "Audit" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavLinks({
  variant,
}: {
  variant: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav aria-label="Admin sections" className="hidden md:flex">
        <ul className="flex items-center gap-5 text-sm">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "rounded px-1 py-0.5 transition-colors",
                    active
                      ? "font-medium text-slate-900 underline underline-offset-4"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Admin sections (mobile)" className="md:hidden">
      <ul className="mx-auto flex w-full max-w-[1200px] gap-4 overflow-x-auto px-6 pb-2 text-sm">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={[
                  "rounded px-1 py-0.5",
                  active
                    ? "font-medium text-slate-900 underline underline-offset-4"
                    : "text-slate-600",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
