"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ListChecks,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

interface Step3ReviewProps {
  auditId: string;
  onAnalysisComplete: () => void;
}

import { getAuthToken } from "@/lib/getAuthToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function Step3Review({ auditId, onAnalysisComplete }: Step3ReviewProps) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("Integrity Check Complete");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setStatusMessage("Starting analysis...");

    try {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      const { token } = await getAuthToken();

      // Start the analysis
      const startRes = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ audit_id: auditId }),
      });

      if (!startRes.ok) {
        throw new Error("Failed to start analysis");
      }

      // Begin polling
      setStatusMessage("Analysis in progress...");
      let attempts = 0;
      const maxAttempts = 90; // 3 mins max if every 2s

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
          setErrorMessage("Analysis timed out. Please try again.");
          return;
        }

        try {
          const statusRes = await fetch(
            `${API_URL}/analyze/${auditId}/status`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!statusRes.ok) return;

          const statusData = await statusRes.json();

          if (statusData.status === "completed") {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setStatusMessage("Analysis completed successfully!");
            onAnalysisComplete();
          } else if (statusData.status === "failed") {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setErrorMessage(statusData.error_message || "Analysis failed");
          } else if (statusData.status === "timeout") {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setErrorMessage("Analysis timed out");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      setErrorMessage(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Left: Validation Summary (Asymmetrical Layout) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-xl shadow-teal-glow relative overflow-hidden border border-[#00ADB5]/20">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00ADB5]/5 rounded-full blur-3xl"></div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-orbitron text-xl font-black text-[#55d8e1] tracking-wide mb-1">
                  VALIDATION
                </h2>
                <p className="text-[#AABBC4] text-sm">{statusMessage}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#00ADB5]/10 border border-[#00ADB5]/30 flex items-center justify-center text-[#55d8e1]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-medium text-[#EEEEEE]">
                  Headers parsed (12 columns)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-medium text-[#EEEEEE]">
                  No missing values detected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-medium text-[#EEEEEE]">
                  Data types localized
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 flex items-start gap-3 mb-8">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-red-200">
                  {errorMessage}
                </span>
              </div>
            )}

            {!isAnalyzing && !errorMessage && (
              <div className="p-4 bg-[#00ADB5]/5 rounded-lg border border-[#00ADB5]/20 flex items-center justify-center gap-3 mb-8">
                <ListChecks className="w-5 h-5 text-[#55d8e1]" />
                <span className="font-orbitron text-xs font-bold tracking-widest text-[#55d8e1]">
                  READY TO ANALYZE
                </span>
              </div>
            )}

            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-lg text-[#002022] font-bold font-orbitron tracking-widest text-sm transition-all transform active:scale-95 ${
                isAnalyzing
                  ? "bg-[#3C494A] text-[#AABBC4] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#55d8e1] to-[#00adb5] hover:opacity-90 shadow-[0_0_20px_rgba(85,216,225,0.4)]"
              }`}
            >
              {isAnalyzing ? "ANALYZING..." : "START AUDIT"}
            </button>
          </div>

          {/* Feature Legend */}
          <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20">
            <h3 className="text-xs font-orbitron font-bold text-[#AABBC4] mb-4 tracking-widest uppercase">
              MAP LEGEND
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                <span className="text-xs font-dm-sans text-[#EEEEEE]">
                  Sensitive Feature (Bias Probe)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-[#55d8e1]/80 shadow-[0_0_8px_rgba(85,216,225,0.4)]"></div>
                <span className="text-xs font-dm-sans text-[#EEEEEE]">
                  Prediction Target
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-[#3C494A]"></div>
                <span className="text-xs font-dm-sans text-[#EEEEEE]">
                  Descriptive Attribute
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: CSV Preview Table */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-xl overflow-hidden shadow-teal-glow border border-[#00ADB5]/20">
            <div className="p-6 border-b border-[#3C494A]/50 flex justify-between items-center">
              <div>
                <h3 className="font-orbitron text-lg font-bold tracking-tight text-[#EEEEEE]">
                  COLUMN MAPPING
                </h3>
                <p className="text-xs text-[#AABBC4]">
                  Review and assign AI audit roles to your data columns.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-[#2F353E] text-[#AABBC4] transition-colors">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161c25]/50">
                    <th className="px-6 py-4 border-r border-[#3C494A]/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron text-[#AABBC4] mb-1">
                          ROLE
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#AABBC4] bg-[#2F353E] px-2 py-1 rounded w-max">
                          ID <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 border-r border-[#3C494A]/50 border-b-2 border-orange-500/40 bg-orange-500/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron text-orange-400 mb-1">
                          SENSITIVE
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 w-max">
                          ETHNICITY <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 border-r border-[#3C494A]/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron text-[#AABBC4] mb-1">
                          ATTRIBUTE
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#AABBC4] bg-[#2F353E] px-2 py-1 rounded w-max">
                          CREDIT_SCORE <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 border-r border-[#3C494A]/50 border-b-2 border-[#55d8e1]/40 bg-[#55d8e1]/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron text-[#55d8e1] mb-1">
                          PREDICTION
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#55d8e1] bg-[#55d8e1]/10 px-2 py-1 rounded border border-[#55d8e1]/20 w-max">
                          LOAN_STATUS <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-dm-mono text-sm text-[#EEEEEE]">
                  <tr className="border-b border-[#3C494A]/50 hover:bg-[#2F353E]/30 transition-colors">
                    <td className="px-6 py-4 text-[#AABBC4]">#9021</td>
                    <td className="px-6 py-4 text-orange-200">Group_A</td>
                    <td className="px-6 py-4">742</td>
                    <td className="px-6 py-4 text-[#55d8e1]">APPROVED</td>
                  </tr>
                  <tr className="border-b border-[#3C494A]/50 hover:bg-[#2F353E]/30 transition-colors">
                    <td className="px-6 py-4 text-[#AABBC4]">#9022</td>
                    <td className="px-6 py-4 text-orange-200">Group_C</td>
                    <td className="px-6 py-4">610</td>
                    <td className="px-6 py-4 text-[#EF4444]">DENIED</td>
                  </tr>
                  <tr className="border-b border-[#3C494A]/50 hover:bg-[#2F353E]/30 transition-colors">
                    <td className="px-6 py-4 text-[#AABBC4]">#9023</td>
                    <td className="px-6 py-4 text-orange-200">Group_A</td>
                    <td className="px-6 py-4">812</td>
                    <td className="px-6 py-4 text-[#55d8e1]">APPROVED</td>
                  </tr>
                  <tr className="border-b border-[#3C494A]/50 hover:bg-[#2F353E]/30 transition-colors">
                    <td className="px-6 py-4 text-[#AABBC4]">#9024</td>
                    <td className="px-6 py-4 text-orange-200">Group_B</td>
                    <td className="px-6 py-4">655</td>
                    <td className="px-6 py-4 text-[#EF4444]">DENIED</td>
                  </tr>
                  <tr className="hover:bg-[#2F353E]/30 transition-colors">
                    <td className="px-6 py-4 text-[#AABBC4]">#9025</td>
                    <td className="px-6 py-4 text-orange-200">Group_A</td>
                    <td className="px-6 py-4">788</td>
                    <td className="px-6 py-4 text-[#55d8e1]">APPROVED</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#080f17]/40 flex justify-center border-t border-[#3C494A]/50">
              <button className="text-xs font-orbitron font-bold text-[#55d8e1]/70 hover:text-[#55d8e1] transition-all tracking-[0.2em]">
                VIEW ALL 1,240 ROWS
              </button>
            </div>
          </div>

          {/* Technical Specs Card (Editorial Tension) */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-xl border-l-4 border-[#00ADB5] border-y border-r border-[#00ADB5]/20">
              <h4 className="text-[10px] font-orbitron text-[#AABBC4] mb-2">
                MODEL ARCHITECTURE
              </h4>
              <p className="text-xl font-bold font-orbitron text-[#EEEEEE]">
                Random Forest v.2
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-xs font-dm-mono text-[#EEEEEE]">
                  Latent factor check: OPTIMAL
                </span>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl border-l-4 border-orange-500 border-y border-r border-[#00ADB5]/20">
              <h4 className="text-[10px] font-orbitron text-[#AABBC4] mb-2">
                SENSITIVE FEATURES
              </h4>
              <p className="text-xl font-bold font-orbitron text-orange-500">
                1 Detected
              </p>
              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="text-orange-500 w-4 h-4" />
                <span className="text-xs font-dm-mono text-[#EEEEEE]">
                  Targeting: Parity Test
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
