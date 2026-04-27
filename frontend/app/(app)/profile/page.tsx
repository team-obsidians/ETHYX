// c:\Obsidian\Ethyx\frontend\app\(app)\profile\page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { AccountSettingsPanel } from "@/components/profile/AccountSettingsPanel";
import { AuditHistoryPanel } from "@/components/profile/AuditHistoryPanel";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import type { Audit } from "@/types/dashboard";

export default function ProfilePage() {
  const { data, loading, error } = useProfileData();
  const [activeTab, setActiveTab] = useState<"account" | "history">("account");
  const [recentAudits, setRecentAudits] = useState<Audit[]>([]);

  useEffect(() => {
    async function fetchRecentAudits() {
      try {
        const res = await fetch("/api/audits");
        if (res.ok) {
          const audits: Audit[] = await res.json();
          setRecentAudits(audits.slice(0, 5));
        }
      } catch (err: unknown) {
        console.error("Error fetching recent audits:", err);
      }
    }
    fetchRecentAudits();
  }, []);

  if (loading) {
    return (
      <LoadingOverlay isVisible={true} message="Loading profile data..." />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-8">
        <div className="text-center bg-surface-container/50 p-8 rounded-2xl border border-[#EF4444]/30 max-w-md">
          <h2 className="text-[#EF4444] font-orbitron text-xl mb-4">
            Error Loading Profile
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00ADB5] text-[#002022] px-6 py-2 rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-[calc(100vh-120px)] dot-grid">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-8">
          <h2 className="font-orbitron text-xl text-[#00ADB5] glow-on-hover">
            Profile
          </h2>
          <nav className="hidden md:flex gap-6">
            <a
              className="text-slate-400 hover:text-cyan-300 font-orbitron text-sm transition-all"
              href="#"
            >
              Audit Log
            </a>
            <a
              className="text-slate-400 hover:text-cyan-300 font-orbitron text-sm transition-all"
              href="#"
            >
              API Docs
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#869394] w-4 h-4" />
            <input
              className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm text-[#dde3ef] focus:ring-1 focus:ring-[#00ADB5] w-[240px] placeholder:text-slate-600 transition-all"
              placeholder="Search system logs..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-[#00ADB5] transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-[#00ADB5] transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <ProfileHero profile={data?.profile ?? null} />

      <div className="bg-surface-container-low/30 rounded-2xl border border-[#3c494a]/20 overflow-hidden shadow-xl">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "account" ? (
          <AccountSettingsPanel
            profile={data?.profile ?? null}
            stats={data?.stats ?? null}
          />
        ) : (
          <AuditHistoryPanel recentAudits={recentAudits} />
        )}
      </div>
    </div>
  );
}
