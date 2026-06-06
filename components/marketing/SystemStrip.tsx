"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SystemStrip({
  commit,
  region = "iad1",
  env = "production",
}: {
  commit: string;
  region?: string;
  env?: "production" | "preview" | "development";
}) {
  const [lagosTime, setLagosTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setLagosTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="contentinfo"
      aria-label="System status"
      className="
        relative z-50
        border-b border-border-subtle
        bg-ink-deep/95 backdrop-blur-sm
        text-foreground-muted
        font-mono text-[0.65rem] tracking-[0.14em] uppercase
      "
    >
      <div
        className="
          mx-auto flex w-full max-w-[1440px]
          items-center justify-between gap-4
          px-5 sm:px-8 lg:px-14
          h-7
        "
      >
        <Link
          href="/status"
          className="flex items-center gap-4 truncate group transition-opacity hover:opacity-90"
          aria-label="View system status page"
        >
          <Dot status={env === "production" ? "operational" : "preview"} />
          <span className="hidden sm:inline">
            TEK NAIJA <span className="text-ochre/70">/</span> RC 9181824
          </span>
          <span className="sm:hidden">RC 9181824</span>
          <span className="text-foreground/30 hidden md:inline">·</span>
          <span className="hidden md:inline group-hover:text-foreground transition-colors">
            Lagos <span className="text-ochre/70">/</span> Nigeria
          </span>
        </Link>

        <div className="flex items-center gap-4 truncate">
          <span className="hidden md:inline">
            <span className="text-foreground/40">env</span>{" "}
            <span className="text-foreground">{env}</span>
          </span>
          <span className="text-foreground/30 hidden md:inline">·</span>
          <span className="hidden sm:inline">
            <span className="text-foreground/40">build</span>{" "}
            <span className="text-foreground">{commit}</span>
          </span>
          <span className="text-foreground/30 hidden sm:inline">·</span>
          <span className="hidden lg:inline">
            <span className="text-foreground/40">region</span>{" "}
            <span className="text-foreground">{region}</span>
          </span>
          <span className="text-foreground/30 hidden lg:inline">·</span>
          <span suppressHydrationWarning>
            <span className="text-foreground/40">lagos</span>{" "}
            <span className="text-foreground">{lagosTime ?? "--:--"} WAT</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Dot({ status }: { status: "operational" | "preview" | "degraded" }) {
  const color =
    status === "operational"
      ? "bg-status-ok"
      : status === "preview"
        ? "bg-status-warn"
        : "bg-status-down";
  return (
    <span className="relative inline-flex items-center" aria-label={status}>
      <span className={`relative inline-block h-1.5 w-1.5 rounded-full ${color}`}>
        <span
          className={`absolute inset-0 rounded-full ${color} opacity-70 motion-safe:animate-ping`}
          aria-hidden
        />
      </span>
    </span>
  );
}
