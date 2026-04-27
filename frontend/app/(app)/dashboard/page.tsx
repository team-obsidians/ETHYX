// c:\Obsidian\Ethyx\frontend\app\(app)\dashboard\page.tsx
// ETHYX AI — Dashboard page with Technical/Executive views and real-time polling
"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useDashboardData } from "@/hooks/useDashboardData";
import { toAnalysisResults } from "@/types/dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ViewToggle } from "@/components/dashboard/ViewToggle";
import { AuditStatusPanel } from "@/components/dashboard/AuditStatusPanel";
import { RecentAuditsList } from "@/components/dashboard/RecentAuditsList";
import { TechnicalView } from "@/components/dashboard/TechnicalView";
import { ExecutiveView } from "@/components/dashboard/ExecutiveView";

type ViewMode = "technical" | "executive";

function DashboardContent() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get("auditId");
  const [viewMode, setViewMode] = useState<ViewMode>("technical");
  const { audit, fairnessResult, status, error, refetch } =
    useDashboardData(auditId);

  /** Bridge FairnessResult → AnalysisResults for view components */
  const analysisResults = useMemo(() => {
    if (audit && fairnessResult) {
      return toAnalysisResults(audit, fairnessResult);
    }
    return null;
  }, [audit, fairnessResult]);

  /* ─── No auditId → show recent audits ─── */
  if (!auditId) {
    return <RecentAuditsList />;
  }

  /* ─── Loading initial fetch ─── */
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#00ADB5] animate-spin" />
      </div>
    );
  }

  /* ─── Non-complete status (canonical: uploaded / queued / analyzing / failed / timeout) ─── */
  if (
    status === "uploaded" ||
    status === "queued" ||
    status === "analyzing" ||
    status === "failed" ||
    status === "timeout"
  ) {
    return (
      <div className="p-8 flex-1">
        {audit && (
          <DashboardHeader audit={audit} currentView={viewMode} />
        )}
        <AuditStatusPanel
          status={status}
          errorMessage={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  /* ─── Completed — show full dashboard ─── */
  if (status === "completed" && audit && analysisResults) {
    return (
      <div className="p-8 flex-1 flex flex-col max-w-[1600px] mx-auto w-full">
        <DashboardHeader audit={audit} currentView={viewMode} />

        <div className="flex justify-end mb-6">
          <ViewToggle activeView={viewMode} onChange={setViewMode} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === "technical" ? (
              <TechnicalView results={analysisResults} />
            ) : (
              <ExecutiveView results={analysisResults} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[#EEEEEE]/20">
          <div className="flex items-center gap-8">
            <span className="text-[10px] uppercase tracking-widest font-dm-mono">
              System Integrity: 99.9%
            </span>
            <span className="text-[10px] uppercase tracking-widest font-dm-mono">
              Audit ID: {audit.id.slice(0, 8)}...
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-widest">
            © 2026 ETHYX AI QUANTUM AUDIT SYSTEMS
          </div>
        </footer>
      </div>
    );
  }

  /* ─── Fallback: idle with auditId but no data ─── */
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-sm text-[#AABBC4]">
          Audit not found or access denied.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#00ADB5] animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
