// c:\Obsidian\Ethyx\frontend\components\dashboard\RecentAuditsList.tsx
// Displayed when no auditId is in URL — shows user's recent audits
"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import {
  FileSearch,
  Upload,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Audit, AuditStatus, RiskLevel } from "@/types/dashboard";

const STATUS_CLASSES: Record<
  AuditStatus,
  { label: string; text: string; bg: string; border: string }
> = {
  uploaded: {
    label: "Uploaded",
    text: "text-[#6B8090]",
    bg: "bg-[#6B8090]/5",
    border: "border-[#6B8090]/20",
  },
  queued: {
    label: "Queued",
    text: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/5",
    border: "border-[#F59E0B]/20",
  },
  analyzing: {
    label: "Analyzing",
    text: "text-[#00ADB5]",
    bg: "bg-[#00ADB5]/5",
    border: "border-[#00ADB5]/20",
  },
  completed: {
    label: "Complete",
    text: "text-[#10B981]",
    bg: "bg-[#10B981]/5",
    border: "border-[#10B981]/20",
  },
  failed: {
    label: "Failed",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/5",
    border: "border-[#EF4444]/20",
  },
  timeout: {
    label: "Timeout",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/5",
    border: "border-[#EF4444]/20",
  },
};

const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "text-[#10B981]",
  medium: "text-[#F59E0B]",
  high: "text-[#EF4444]",
  critical: "text-[#EF4444]",
};

function domainLabel(domain: string): string {
  const labels: Record<string, string> = {
    hiring: "Hiring & Recruitment",
    loans: "Loan & Credit",
    healthcare: "Healthcare",
  };
  return labels[domain] ?? domain;
}

function riskLevelFromScore(score: number | null): RiskLevel | null {
  if (score === null || score === undefined) return null;
  if (score < 30) return "low";
  if (score < 70) return "medium";
  return "high";
}

export function RecentAuditsList() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAudits() {
      try {
        // Fetch via server-side API route — handles auth & ownership
        const res = await fetch("/api/audits");

        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: "Failed to fetch audits" }));
          throw new Error(errData.error || `Error: ${res.status}`);
        }

        const data: Audit[] = await res.json();
        setAudits(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch audits"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAudits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#00ADB5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 flex-1 flex flex-col max-w-[1200px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl font-orbitron font-black text-[#EEEEEE]">
            Audit Library
          </h2>
          <p className="text-sm text-[#AABBC4] mt-1">
            Your recent fairness analysis runs
          </p>
        </div>
        <Link
          href="/upload"
          className="px-6 py-2.5 rounded-btn bg-gradient-to-br from-[#00ADB5] to-[#008891] text-[#222831] font-bold text-sm shadow-teal-glow flex items-center gap-2 hover:shadow-teal-glow-lg transition-all w-fit"
        >
          <Upload className="w-4 h-4" />
          New Audit
        </Link>
      </motion.div>

      {error && (
        <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 p-4 rounded-[14px] mb-6 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {audits.length === 0 && !error ? (
        <EmptyState />
      ) : (
        <AuditList audits={audits} router={router} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <FileSearch className="w-16 h-16 text-[#00ADB5]/30 mb-6" />
      <h3 className="text-xl font-orbitron font-black text-[#EEEEEE] mb-2">
        No Audits Yet
      </h3>
      <p className="text-sm text-[#AABBC4] mb-6 max-w-sm">
        Upload a dataset and run your first fairness analysis to see results
        here.
      </p>
      <Link
        href="/upload"
        className="px-6 py-2.5 rounded-btn bg-gradient-to-br from-[#00ADB5] to-[#008891] text-[#222831] font-bold text-sm shadow-teal-glow flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Start First Audit
      </Link>
    </motion.div>
  );
}

interface AuditListProps {
  audits: Audit[];
  router: ReturnType<typeof useRouter>;
}

function AuditList({ audits, router }: AuditListProps) {
  return (
    <div className="space-y-3">
      {audits.map((audit, idx) => {
        const statusCfg = STATUS_CLASSES[audit.status] ?? {
          label: audit.status,
          text: "text-[#6B8090]",
          bg: "bg-[#6B8090]/5",
          border: "border-[#6B8090]/20",
        };
        const riskScore = audit.risk_score;
        const riskLevel = riskLevelFromScore(riskScore);

        return (
          <motion.button
            key={audit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={() => router.push(`/dashboard?auditId=${audit.id}`)}
            className="w-full bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-5 flex items-center gap-5 hover:border-[#00ADB5]/30 transition-all group text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-sm font-bold text-[#EEEEEE] truncate">
                  {domainLabel(audit.domain)}
                </h4>
                <span
                  className={`text-[9px] font-dm-mono uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusCfg.text} ${statusCfg.bg} ${statusCfg.border}`}
                >
                  {statusCfg.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6B8090]">
                <span className="flex items-center gap-1 font-dm-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(audit.created_at).toLocaleDateString()}
                </span>
                {audit.file_name && (
                  <span className="font-dm-mono truncate max-w-[200px]">
                    {audit.file_name}
                  </span>
                )}
              </div>
            </div>

            {riskScore !== null && riskLevel && (
              <div className="text-right shrink-0">
                <span
                  className={`text-2xl font-orbitron font-black tabular-nums ${RISK_CLASSES[riskLevel] ?? "text-[#6B8090]"}`}
                >
                  {riskScore}
                </span>
                <p className="text-[9px] font-dm-mono text-[#6B8090] uppercase">
                  Risk Score
                </p>
              </div>
            )}

            <ChevronRight className="w-5 h-5 text-[#6B8090] group-hover:text-[#00ADB5] transition-colors shrink-0" />
          </motion.button>
        );
      })}
    </div>
  );
}
