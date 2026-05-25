"use client";

import { useRef, useState } from "react";

import { SecondaryButton } from "@/lib/admin/ui";
import { uploadImage } from "@/lib/storage/upload-image";

type Props = {
  bucket: string;
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
};

export function ImageUploadButton({
  bucket,
  onUploaded,
  label = "Upload image",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    const result = await uploadImage(file, bucket);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onUploaded(result.url);
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleChange}
        className="hidden"
      />
      <SecondaryButton
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="px-3 py-1.5 text-sm"
      >
        {busy ? "Uploading…" : label}
      </SecondaryButton>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
