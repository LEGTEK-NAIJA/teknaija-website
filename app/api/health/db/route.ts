import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("status_systems")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          service: "supabase-primary",
          error: error.message,
          duration_ms: Date.now() - start,
        },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        status: "operational",
        service: "supabase-primary",
        duration_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "major_outage",
        service: "supabase-primary",
        error: err instanceof Error ? err.message : "unknown",
        duration_ms: Date.now() - start,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
