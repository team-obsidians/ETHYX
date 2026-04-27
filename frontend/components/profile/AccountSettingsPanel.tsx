// c:\Obsidian\Ethyx\frontend\components\profile\AccountSettingsPanel.tsx
import { CheckCircle, Laptop, Smartphone } from "lucide-react";
import type { AuthProfile, ProfileStats } from "@/types/profile";

interface AccountSettingsPanelProps {
  profile: AuthProfile | null;
  stats: ProfileStats | null;
}

export function AccountSettingsPanel({
  profile,
  stats,
}: AccountSettingsPanelProps) {
  const planName =
    profile?.plan === "PRO PLAN" ? "Quantum Tier" : "Starter Tier";
  const safeStats: ProfileStats = stats ?? {
    totalAudits: 0,
    completedAudits: 0,
    failedAudits: 0,
    averageRiskScore: 0,
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h4 className="font-orbitron text-sm text-[#00ADB5] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00ADB5] rounded-full" />{" "}
              Security Protocols
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                  Work Email
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm text-[#dde3ef] focus:ring-1 focus:ring-[#00ADB5] transition-all"
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                  Authentication
                </label>
                <div className="flex items-center justify-between w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm border border-[#00ADB5]/5">
                  <span className="text-slate-300">2FA Active (TOTP)</span>
                  <CheckCircle className="text-[#00ADB5] w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                  Session Timeout
                </label>
                <select
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm text-[#dde3ef] focus:ring-1 focus:ring-[#00ADB5] transition-all appearance-none cursor-not-allowed"
                  disabled
                  defaultValue="30"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                  API Access Tier
                </label>
                <div className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm text-slate-400">
                  {profile?.plan === "PRO PLAN"
                    ? "Enterprise High-Throughput"
                    : "Standard Rate Limited"}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#3c494a]/10">
            <h4 className="font-orbitron text-sm text-[#00ADB5] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00ADB5] rounded-full" />{" "}
              Notification Architecture
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-highest/40 rounded-xl hover:bg-surface-container-highest/60 transition-all group">
                <div>
                  <p className="text-sm font-bold text-[#dde3ef] group-hover:text-[#00ADB5] transition-colors">
                    Critical Bias Alerts
                  </p>
                  <p className="text-xs text-slate-500">
                    Immediate push for fairness violations &gt; 15%
                  </p>
                </div>
                <div className="w-12 h-6 bg-[#00ADB5] rounded-full relative cursor-pointer opacity-80">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-[#002022] rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-highest/40 rounded-xl hover:bg-surface-container-highest/60 transition-all group">
                <div>
                  <p className="text-sm font-bold text-[#dde3ef] group-hover:text-[#00ADB5] transition-colors">
                    Daily Integrity Report
                  </p>
                  <p className="text-xs text-slate-500">
                    Consolidated summary of system health
                  </p>
                </div>
                <div className="w-12 h-6 bg-[#2f353e] rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats Bento */}
        <div className="space-y-6">
          <div className="bg-surface-container-highest rounded-2xl p-6 border border-[#00ADB5]/5">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 mb-6 tracking-widest">
              Audit Activity
            </h5>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-dm-mono text-2xl font-bold text-[#dde3ef]">
                    {safeStats.totalAudits}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Models Audited
                  </p>
                </div>
                <div className="h-10 w-24 flex items-end gap-1">
                  <div className="w-2 bg-[#00ADB5]/20 h-[30%]" />
                  <div className="w-2 bg-[#00ADB5]/40 h-[60%]" />
                  <div className="w-2 bg-[#00ADB5]/20 h-[45%]" />
                  <div className="w-2 bg-[#00ADB5]/60 h-[80%]" />
                  <div className="w-2 bg-[#00ADB5]/30 h-[50%]" />
                  <div className="w-2 bg-[#00ADB5] h-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Avg Risk Score</span>
                  <span className="text-[#00ADB5]">
                    {Math.round(safeStats.averageRiskScore)}
                  </span>
                </div>
                <div className="w-full bg-[#2f353e] h-1 rounded-full overflow-hidden">
                  <div
                    className={`bg-[#00ADB5] h-full transition-all ${
                      {
                        0: "w-[0%]",
                        10: "w-[10%]",
                        20: "w-[20%]",
                        30: "w-[30%]",
                        40: "w-[40%]",
                        50: "w-[50%]",
                        60: "w-[60%]",
                        70: "w-[70%]",
                        80: "w-[80%]",
                        90: "w-[90%]",
                        100: "w-[100%]"
                      }[Math.round(Math.min(100, Math.max(0, safeStats.averageRiskScore)) / 10) * 10]
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#00ADB5]/10 rounded-2xl p-6 border border-[#00ADB5]/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00ADB5]/10 blur-3xl" />
            <h5 className="text-[10px] uppercase font-bold text-[#00ADB5] mb-2 tracking-widest">
              Plan Details
            </h5>
            <p className="font-orbitron text-lg font-bold text-[#dde3ef] mb-1">
              {planName}
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Unlimited automated mitigations
            </p>
            <button className="w-full bg-[#00ADB5] text-[#002022] py-2 rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(0,173,181,0.5)] active:scale-98">
              Upgrade Instance
            </button>
          </div>

          <div className="bg-surface-container-highest/40 rounded-2xl p-6 border border-[#3c494a]/10">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 mb-4 tracking-widest">
              Active Devices
            </h5>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-[#dde3ef]">
                    MacBook Pro 16&quot;
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Last active: 2 mins ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-[#dde3ef]">
                    iPhone 15 Pro
                  </p>
                  <p className="text-[10px] text-slate-500">
                    San Francisco, US
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
