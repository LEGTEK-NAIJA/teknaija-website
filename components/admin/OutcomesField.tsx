"use client";

import {
  FieldHelp,
  FieldLabel,
  SecondaryButton,
  inputClass,
} from "@/lib/admin/ui";

export type Outcome = { label: string; value: string };

type Props = {
  label: string;
  value: Outcome[];
  onChange: (next: Outcome[]) => void;
  help?: string;
};

export function OutcomesField({ label, value, onChange, help }: Props) {
  function updateAt(index: number, patch: Partial<Outcome>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, { label: "", value: "" }]);
  }

  return (
    <div>
      <FieldLabel htmlFor="outcomes-field">{label}</FieldLabel>
      <div className="space-y-2">
        {value.map((row, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Label (e.g. Procedural Parts)"
              value={row.label}
              onChange={(e) => updateAt(i, { label: e.target.value })}
            />
            <input
              className={`${inputClass} flex-1`}
              placeholder="Value (e.g. 19)"
              value={row.value}
              onChange={(e) => updateAt(i, { value: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove outcome"
              className="mt-2 text-slate-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <SecondaryButton type="button" onClick={add}>
          + Add outcome
        </SecondaryButton>
      </div>
      {help ? <FieldHelp>{help}</FieldHelp> : null}
    </div>
  );
}
