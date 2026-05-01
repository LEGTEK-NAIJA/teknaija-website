import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { AchiStrip } from "@/components/motifs/AchiStrip";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AchiStrip />
      <MarketingNav />
      <main id="main" className="flex-1 isolate">
        {children}
      </main>
      <MarketingFooter />
    </>
  );
}
