import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { SystemStrip } from "@/components/marketing/SystemStrip";
import { AchiStrip } from "@/components/motifs/AchiStrip";

function getBuildInfo() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const env = process.env.VERCEL_ENV;
  return {
    commit: sha ? sha.slice(0, 7) : "local",
    region: process.env.VERCEL_REGION ?? "iad1",
    env:
      env === "production"
        ? ("production" as const)
        : env === "preview"
          ? ("preview" as const)
          : ("development" as const),
  };
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const build = getBuildInfo();

  return (
    <>
      <SystemStrip
        commit={build.commit}
        region={build.region}
        env={build.env}
      />
      <AchiStrip />
      <MarketingNav />
      <main id="main" className="flex-1 isolate">
        {children}
      </main>
      <MarketingFooter />
    </>
  );
}
