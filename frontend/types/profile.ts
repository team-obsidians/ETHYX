// c:\Obsidian\Ethyx\frontend\types\profile.ts
// Profile types — derived from Supabase auth metadata, NOT a profiles table

/**
 * User profile derived from supabase.auth.getUser() metadata.
 * No `profiles` table exists in the canonical schema.
 */
export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  organization: string;
  plan: "FREE PLAN" | "PRO PLAN";
  createdAt: string;
}

export interface ProfileStats {
  totalAudits: number;
  averageRiskScore: number;
  completedAudits: number;
  failedAudits: number;
}

export interface ProfileResponse {
  profile: AuthProfile;
  stats: ProfileStats;
}
