"use client";

import { useState } from "react";

import { deleteImage } from "@/lib/storage/delete-image";
import { FieldHelp, FieldLabel } from "@/lib/admin/ui";

import { ImageUploadButton } from "./ImageUploadButton";

type Props = {
  label: string;
  bucket: string;
  value: string[];
  onChange: (next: string[]) => void;
  help?: string;
};

export function GalleryField({
  label,
  bucket,
  value,
  onChange,
  help,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  function handleUploaded(url: string) {
    onChange([...value, url]);
  }

  async function handleRemove(index: number) {
    setError(null);
    const url = value[index];
    const result = await deleteImage(url, bucket);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <FieldLabel htmlFor="gallery-field-upload">{label}</FieldLabel>
      {value.length > 0 ? (
        <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="relative">
              <img
                src={url}
                alt=""
                className="h-24 w-full rounded-md border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleRemove(i);
                }}
                aria-label="Remove image"
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <ImageUploadButton
        bucket={bucket}
        onUploaded={handleUploaded}
        label="Add image"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      {help ? <FieldHelp>{help}</FieldHelp> : null}
    </div>
  );
}
