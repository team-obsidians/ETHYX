// c:\Obsidian\Ethyx\frontend\app\api\audits\[auditId]\route.ts
// Server-side API route for single audit with fairness_results + events

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AuditDetailResponse } from "@/types/dashboard";

export async function GET(
  req: NextRequest,
  { params }: { params: { auditId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch audit with ownership check
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("*")
      .eq("id", params.auditId)
      .eq("user_id", user.id)
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Fetch fairness results (may not exist yet if still analyzing)
    const { data: fairnessResults } = await supabase
      .from("fairness_results")
      .select("*")
      .eq("audit_id", params.auditId)
      .eq("user_id", user.id)
      .single();

    // Fetch audit events for timeline
    const { data: events } = await supabase
      .from("audit_events")
      .select("*")
      .eq("audit_id", params.auditId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const response: AuditDetailResponse = {
      audit,
      fairness_results: fairnessResults ?? null,
      events: events ?? [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fetch audit error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
