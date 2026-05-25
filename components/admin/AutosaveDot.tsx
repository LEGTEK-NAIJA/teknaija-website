"use client";

import { useEffect, useState } from "react";

export type AutosaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: number }
  | { kind: "error"; message: string };

type Props = { state: AutosaveState };

function relativeTime(at: number, now: number): string {
  const seconds = Math.max(1, Math.round((now - at) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

export function AutosaveDot({ state }: Props) {
  const [, force] = useState(0);
  useEffect(() => {
    if (state.kind !== "saved") return;
    const t = setInterval(() => force((n) => n + 1), 10_000);
    return () => clearInterval(t);
  }, [state.kind]);

  let color: string;
  let label: string;
  switch (state.kind) {
    case "idle":
      color = "bg-slate-300";
      label = "No changes to save";
      break;
    case "saving":
      color = "bg-amber-400 animate-pulse";
      label = "Saving…";
      break;
    case "saved":
      color = "bg-emerald-500";
      label = `Saved ${relativeTime(state.at, Date.now())}`;
      break;
    case "error":
      color = "bg-red-500";
      label = `Save failed: ${state.message}`;
      break;
  }

  return (
    <span
      className="inline-flex items-center"
      title={label}
      aria-label={label}
      role="status"
    >
      <span
        className={`block h-2 w-2 rounded-full ${color}`}
        aria-hidden
      />
    </span>
  );
}
