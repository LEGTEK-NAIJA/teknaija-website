"use client";

import { useState, type KeyboardEvent } from "react";

import { FieldHelp, FieldLabel } from "@/lib/admin/ui";

type Props = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  help?: string;
};

export function TagInputField({
  label,
  value,
  onChange,
  placeholder,
  help,
}: Props) {
  const [draft, setDraft] = useState("");

  function commit(text: string) {
    const trimmed = text.trim().replace(/,$/, "").trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <FieldLabel htmlFor="tag-input">{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900">
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove ${tag}`}
              className="text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && commit(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[8rem] flex-1 border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
        />
      </div>
      {help ? <FieldHelp>{help}</FieldHelp> : null}
    </div>
  );
}
