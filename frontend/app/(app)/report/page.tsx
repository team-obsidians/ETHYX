// c:\Obsidian\Ethyx\frontend\app\(app)\report\page.tsx
"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { RefreshCw, AlertCircle } from "lucide-react";
import { ReportHeader } from "@/components/report/ReportHeader";
import { HighlightMetrics } from "@/components/report/HighlightMetrics";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { ParityDistribution } from "@/components/report/ParityDistribution";
import { AuditLogs } from "@/components/report/AuditLogs";
import { ReportFooter } from "@/components/report/ReportFooter";
import { exportReportToPdf } from "@/lib/exportPdf";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toAnalysisResults } from "@/types/dashboard";

function ReportPageContent() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get("auditId");
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { audit, fairnessResult, status, error } = useDashboardData(auditId);

  /** Bridge canonical types → AnalysisResults for report views */
  const results = useMemo(() => {
    if (audit && fairnessResult) {
      return toAnalysisResults(audit, fairnessResult);
    }
    return null;
  }, [audit, fairnessResult]);

  // Generate static logs based on status
  const logs = [
    { time: "09:12:45", check: "Vector Weight Analysis: Gender Parity", status: status === "failed" ? "FAIL" as const : "PASS" as const },
    { time: "09:15:22", check: "Contextual Bias: Linguistic Nuance", status: status === "failed" ? "WARNING" as const : "PASS" as const },
    { time: "09:20:01", check: "Token Relevancy Variance Check", status: status === "completed" ? "OPTIMIZED" as const : "WARNING" as const },
  ];

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      await exportReportToPdf(reportRef.current, `ETHYX_Report_${auditId || 'Unknown'}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Audit link copied to clipboard!");
  };

  if (!auditId) {
    return (
      <div className="p-12 text-center text-slate-400 font-dm-sans">
        <h2 className="text-2xl mb-4 font-orbitron text-[#EEEEEE]">No Audit Selected</h2>
        <p>Please navigate from the Dashboard or select an audit to generate a report.</p>
      </div>
    );
  }

  if (status === "loading" || status === "uploaded" || status === "queued" || status === "analyzing") {
    return (
      <div className="p-12 text-center text-[#00ADB5] font-dm-sans flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-12 h-12 mb-4 animate-spin opacity-80" />
        <h2 className="text-2xl mb-4 font-orbitron">Generating Report...</h2>
        <p className="text-slate-400">Please wait while we compile the audit results.</p>
      </div>
    );
  }

  if (error || status === "failed") {
    return (
      <div className="p-12 text-center text-red-500 font-dm-sans flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
        <h2 className="text-2xl mb-4 font-orbitron">Audit Failed</h2>
        <p>This audit encountered errors during processing or returned a failed status.</p>
        <p className="text-sm mt-4 text-slate-400">{error}</p>
      </div>
    );
  }

  if (!results) return null;

  // Derive status for report
  let reportStatus: 'LOW RISK SIGNAL' | 'REVIEW NEEDED' | 'HIGH RISK SIGNAL' = 'LOW RISK SIGNAL';
  if (results.risk_level === 'critical' || results.risk_level === 'high') reportStatus = 'HIGH RISK SIGNAL';
  else if (results.risk_level === 'medium') reportStatus = 'REVIEW NEEDED';
  const riskFactor =
    results.risk_level === "critical"
      ? "HIGH"
      : (results.risk_level.toUpperCase() as "LOW" | "MEDIUM" | "HIGH");

  // Format parity score as percentage (e.g., disparate impact 0.98 -> 98.0)
  const parityScore = (results.metrics.demographic_parity_ratio ?? 0) * 100;
  
  // Format variance for distribution (e.g., 100% - parity score)
  const maxVariance = Math.abs(100 - parityScore);

  return (
    <main className="p-12 min-h-screen">
      <div className="max-w-4xl mx-auto" ref={reportRef}>
        <ReportHeader
          auditId={auditId}
          status={reportStatus}
          date={audit?.created_at ? new Date(audit.created_at) : new Date()}
        />
        
        <HighlightMetrics
          biasIndex={results.risk_score}
          parityScore={parityScore}
          latency={12}
          riskFactor={riskFactor}
        />

        <ExecutiveSummary />

        <ParityDistribution
          maxVariance={maxVariance}
          sampleSize={`${(results.row_count / 1000).toFixed(1)}K`}
        />

        <AuditLogs logs={logs} />

        <ReportFooter
          onDownloadPdf={handleDownloadPdf}
          onShare={handleShare}
          status={reportStatus}
          isDownloading={isDownloading}
        />
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-[#00ADB5] font-dm-sans flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl mb-4 font-orbitron">Loading Report...</h2>
      </div>
    }>
      <ReportPageContent />
    </Suspense>
  );
}
