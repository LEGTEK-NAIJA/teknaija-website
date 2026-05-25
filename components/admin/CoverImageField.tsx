"use client";

import { useState } from "react";

import { deleteImage, extractImagePath } from "@/lib/storage/delete-image";
import { FieldError, FieldLabel, inputClass } from "@/lib/admin/ui";

import { ImageUploadButton } from "./ImageUploadButton";

type Props = {
  bucket: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  errorMessage?: string;
  alsoReferencedIn?: string[];
};

export function CoverImageField({
  bucket,
  label,
  value,
  onChange,
  errorMessage,
  alsoReferencedIn = [],
}: Props) {
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fieldId = `${bucket}-url`;

  function isReferencedElsewhere(url: string): boolean {
    return alsoReferencedIn.some((text) => text.includes(url));
  }

  async function handleRemove() {
    if (!value) return;
    setError(null);
    const path = extractImagePath(value, bucket);
    if (path && !isReferencedElsewhere(value)) {
      setRemoving(true);
      const result = await deleteImage(value, bucket);
      setRemoving(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
    }
    onChange("");
  }

  async function handleUploaded(newUrl: string) {
    if (value && value !== newUrl && !isReferencedElsewhere(value)) {
      const result = await deleteImage(value, bucket);
      if (!result.ok) {
        console.warn(`[${bucket}] failed to delete previous file:`, result.error);
      }
    }
    onChange(newUrl);
  }

  return (
    <div>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <input
            id={fieldId}
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <ImageUploadButton bucket={bucket} onUploaded={handleUploaded} />
      </div>
      <FieldError>{errorMessage}</FieldError>
      {value ? (
        <div className="relative mt-2 inline-block">
          <img
            src={value}
            alt=""
            className="h-32 w-auto rounded-md border border-slate-200 object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleRemove();
            }}
            disabled={removing}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {removing ? "…" : "×"}
          </button>
          {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
