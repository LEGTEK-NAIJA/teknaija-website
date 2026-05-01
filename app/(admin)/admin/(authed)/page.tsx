import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CARDS: { href: string; label: string; table: string; description: string }[] = [
  {
    href: "/admin/projects",
    label: "Projects",
    table: "projects",
    description: "Case studies and portfolio entries.",
  },
  {
    href: "/admin/posts",
    label: "Posts",
    table: "posts",
    description: "Insights, essays, and editorial.",
  },
  {
    href: "/admin/team",
    label: "Team",
    table: "team_members",
    description: "Leadership and masthead entries.",
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    table: "testimonials",
    description: "Pull quotes from clients and partners.",
  },
];

async function fetchCounts(): Promise<Record<string, number | null>> {
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    CARDS.map(async (card) => {
      const { count, error } = await supabase
        .from(card.table)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.error(`[admin/dashboard] count(${card.table})`, error);
        return [card.table, null] as const;
      }
      return [card.table, count ?? 0] as const;
    })
  );
  return Object.fromEntries(results);
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const counts = await fetchCounts();

  return (
    <>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Welcome back
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Signed in as {session.email || "admin"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage projects, posts, team and testimonials. Changes publish
          immediately to the live site.
        </p>
      </header>

      <section
        aria-label="Content sections"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CARDS.map((card) => {
          const count = counts[card.table];
          return (
            <Link
              key={card.href}
              href={card.href}
              className="
                group flex flex-col rounded-lg border border-slate-200 bg-white p-5
                transition-shadow hover:border-slate-300 hover:shadow-sm
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2
              "
            >
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {card.table}
              </span>
              <span className="mt-1 text-base font-semibold text-slate-900">
                {card.label}
              </span>
              <span className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                {count === null ? "—" : count}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                {count === 1 ? "1 record" : `${count ?? 0} records`}
              </span>
              <span className="mt-4 text-xs text-slate-600">
                {card.description}
              </span>
              <span className="mt-4 text-xs font-medium text-slate-700 group-hover:text-slate-900">
                Manage →
              </span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
