"use client";

import { useRef, useState } from "react";

import { SecondaryButton } from "@/lib/admin/ui";
import { formatBytes, optimizeImage } from "@/lib/storage/optimize-image";
import { uploadImage } from "@/lib/storage/upload-image";

type Props = {
  bucket: string;
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "optimizing"; originalBytes: number }
  | {
      kind: "uploading";
      originalBytes: number;
      finalBytes: number;
      optimized: boolean;
    }
  | { kind: "error"; message: string };

export function ImageUploadButton({
  bucket,
  onUploaded,
  label = "Upload image",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (inputRef.current) inputRef.current.value = "";

    setStatus({ kind: "optimizing", originalBytes: file.size });

    let result;
    try {
      result = await optimizeImage(file);
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Optimization failed.",
      });
      return;
    }

    setStatus({
      kind: "uploading",
      originalBytes: result.originalBytes,
      finalBytes: result.finalBytes,
      optimized: result.optimized,
    });

    const uploadResult = await uploadImage(result.file, bucket);

    if (!uploadResult.ok) {
      setStatus({ kind: "error", message: uploadResult.error });
      return;
    }

    setStatus({ kind: "idle" });
    onUploaded(uploadResult.url);
  }

  const busy = status.kind === "optimizing" || status.kind === "uploading";

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
        {status.kind === "optimizing"
          ? "Optimizing…"
          : status.kind === "uploading"
            ? "Uploading…"
            : label}
      </SecondaryButton>
      <StatusLine status={status} />
    </div>
  );
}

function StatusLine({ status }: { status: Status }) {
  if (status.kind === "idle") return null;

  if (status.kind === "error") {
    return <p className="mt-1 text-xs text-red-600">{status.message}</p>;
  }

  if (status.kind === "optimizing") {
    return (
      <p className="mt-1 text-xs text-slate-500">
        Optimizing {formatBytes(status.originalBytes)}…
      </p>
    );
  }

  if (status.optimized) {
    return (
      <p className="mt-1 text-xs text-slate-500">
        Optimizing… {formatBytes(status.originalBytes)} →{" "}
        {formatBytes(status.finalBytes)}. Uploading…
      </p>
    );
  }

  return (
    <p className="mt-1 text-xs text-slate-500">
      Uploading {formatBytes(status.finalBytes)}…
    </p>
  );
}
