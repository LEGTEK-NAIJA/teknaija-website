"use client";

import { useState } from "react";

import { MarkdownPreview } from "./markdown";

type Props = {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  /** Controlled value override (e.g. when wired through react-hook-form). */
  value?: string;
  onChange?: (value: string) => void;
  ariaInvalid?: boolean;
};

/**
 * Side-by-side markdown editor for the admin CMS. Plain textarea on the left,
 * live react-markdown preview on the right. Stacks vertically on narrow
 * viewports (mobile-first).
 */
export function MarkdownField({
  id,
  name,
  defaultValue = "",
  placeholder,
  rows = 14,
  value,
  onChange,
  ariaInvalid,
}: Props) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as string) : internal;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={current}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        onChange={(e) => {
          const next = e.currentTarget.value;
          if (!isControlled) setInternal(next);
          onChange?.(next);
        }}
        className="
          w-full resize-y rounded-md border border-slate-300 bg-white
          px-3 py-2 font-mono text-sm leading-6 text-slate-900
          placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900
          aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200
        "
      />
      <div
        aria-label="Markdown preview"
        className="
          h-full min-h-[10rem] overflow-auto rounded-md border border-slate-200
          bg-slate-50 px-4 py-3
        "
      >
        <MarkdownPreview source={current} />
      </div>
      <div className="col-span-1 flex justify-end pt-1 text-xs font-mono text-slate-500 lg:col-span-2">
        {(() => {
          const words = (current || "").trim().split(/\s+/).filter(Boolean).length;
          const minutes = Math.max(1, Math.round(words / 220));
          return (
            <span>
              {words.toLocaleString()} words · about {minutes} min read
            </span>
          );
        })()}
      </div>
    </div>
  );
}
