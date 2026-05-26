"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { SecondaryButton, inputClass } from "@/lib/admin/ui";

type Initial = {
  entity?: string;
  actor?: string;
  from?: string;
  to?: string;
};

const ENTITIES = [
  { value: "all", label: "All entities" },
  { value: "post", label: "Posts" },
  { value: "project", label: "Projects" },
  { value: "team_member", label: "Team" },
  { value: "testimonial", label: "Testimonials" },
];

export function AuditFilters({
  actors,
  initial,
}: {
  actors: string[];
  initial: Initial;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params?.toString() ?? "");
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      router.replace(`/admin/audit?${next.toString()}`);
    },
    [params, router]
  );

  const reset = () => router.replace("/admin/audit");

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <Field label="Entity">
        <select
          className={inputClass}
          defaultValue={initial.entity ?? "all"}
          onChange={(e) => update("entity", e.target.value)}
        >
          {ENTITIES.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Actor">
        <select
          className={inputClass}
          defaultValue={initial.actor ?? ""}
          onChange={(e) => update("actor", e.target.value)}
        >
          <option value="">All actors</option>
          {actors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </Field>

      <Field label="From">
        <input
          type="date"
          className={inputClass}
          defaultValue={initial.from ?? ""}
          onChange={(e) => update("from", e.target.value)}
        />
      </Field>

      <Field label="To">
        <input
          type="date"
          className={inputClass}
          defaultValue={initial.to ?? ""}
          onChange={(e) => update("to", e.target.value)}
        />
      </Field>

      <SecondaryButton type="button" onClick={reset}>
        Reset
      </SecondaryButton>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
