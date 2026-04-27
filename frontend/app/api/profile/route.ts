// c:\Obsidian\Ethyx\frontend\app\api\profile\route.ts
// Server-side API route for profile data — uses auth metadata, NOT a profiles table

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProfileResponse, AuthProfile, ProfileStats } from "@/types/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build profile from auth metadata — no profiles table
    const fullName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";
    const organization =
      user.user_metadata?.organization || "Personal Workspace";

    const profile: AuthProfile = {
      id: user.id,
      email: user.email ?? "",
      fullName,
      organization,
      plan: "FREE PLAN",
      createdAt: user.created_at,
    };

    // Compute stats from audits table
    const { data: audits, error: auditsError } = await supabase
      .from("audits")
      .select("id, status, risk_score")
      .eq("user_id", user.id);

    if (auditsError) {
      console.error("Error fetching audits for profile stats:", auditsError);
    }

    const auditList = audits ?? [];
    const completed = auditList.filter((a) => a.status === "completed");
    const failed = auditList.filter((a) => a.status === "failed");

    let totalScore = 0;
    let scoreCount = 0;
    completed.forEach((a) => {
      if (a.risk_score !== null && a.risk_score !== undefined) {
        totalScore += a.risk_score;
        scoreCount++;
      }
    });

    const stats: ProfileStats = {
      totalAudits: auditList.length,
      completedAudits: completed.length,
      failedAudits: failed.length,
      averageRiskScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
    };

    const response: ProfileResponse = { profile, stats };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Profile route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
