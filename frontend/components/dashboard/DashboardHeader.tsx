// c:\Obsidian\Ethyx\frontend\components\dashboard\DashboardHeader.tsx
// Breadcrumb, audit title, status badge, and action buttons
"use client";

import React from "react";

import {
  ChevronRight,
  Download,
  Share2,
  Loader2,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import type { Audit, AuditStatus } from "@/types/dashboard";

interface DashboardHeaderProps {
  audit: Audit;
  currentView: "technical" | "executive";
}

const STATUS_CLASSES: Record<AuditStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  uploaded: {
    label: "UPLOADED",
    text: "text-[#6B8090]",
    bg: "bg-[#6B8090]/10",
    border: "border-[#6B8090]/20",
    dot: "bg-[#6B8090]",
  },
  queued: {
    label: "QUEUED",
    text: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/20",
    dot: "bg-[#F59E0B]",
  },
  analyzing: {
    label: "ANALYZING",
    text: "text-[#00ADB5]",
    bg: "bg-[#00ADB5]/10",
    border: "border-[#00ADB5]/20",
    dot: "bg-[#00ADB5]",
  },
  completed: {
    label: "COMPLETE",
    text: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/20",
    dot: "bg-[#10B981]",
  },
  failed: {
    label: "FAILED",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/20",
    dot: "bg-[#EF4444]",
  },
  timeout: {
    label: "TIMEOUT",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/20",
    dot: "bg-[#EF4444]",
  },
};

function StatusBadge({ status }: { status: AuditStatus }) {
  const c = STATUS_CLASSES[status];

  return (
    <span className={`flex items-center gap-1.5 text-xs font-dm-mono uppercase px-3 py-1 rounded-full border ${c.text} ${c.bg} ${c.border}`}>
      {status === "analyzing" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "queued" && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.dot}`} />}
      {status === "completed" && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      {c.label}
    </span>
  );
}

function domainLabel(domain: string): string {
  const labels: Record<string, string> = {
    hiring: "Hiring & Recruitment",
    loans: "Loan & Credit",
    healthcare: "Healthcare",
  };
  return labels[domain] ?? domain;
}

export function DashboardHeader({ audit, currentView }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
    >
      <div>
        <nav className="flex items-center gap-2 text-xs text-[#EEEEEE]/40 mb-2 uppercase tracking-widest font-dm-mono">
          <span>Audit Library</span>
          <ChevronRight className="w-3 h-3" />
          <span>{domainLabel(audit.domain)}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#00ADB5]/60">
            {currentView === "technical" ? "Technical" : "Executive"}
          </span>
        </nav>
        <h2 className="text-3xl font-orbitron font-black text-[#EEEEEE]">
          {domainLabel(audit.domain)} Model
        </h2>
        <div className="flex items-center gap-4 mt-2">
          <StatusBadge status={audit.status} />
          <span className="text-xs text-[#EEEEEE]/40 italic font-dm-mono">
            Created: {new Date(audit.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      {audit.status === "completed" && (
        <div className="flex gap-3">
          <Link
            href={`/mitigate?auditId=${audit.id}`}
            className="px-5 py-2.5 rounded-btn border border-[#F59E0B]/40 text-[#F59E0B] font-bold text-sm hover:bg-[#F59E0B]/5 transition-all flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Mitigate
          </Link>
          <button className="px-5 py-2.5 rounded-btn bg-gradient-to-br from-[#00ADB5] to-[#008891] text-[#222831] font-bold text-sm shadow-teal-glow flex items-center gap-2 hover:shadow-teal-glow-lg transition-all">
            <Download className="w-4 h-4" />
            Report
          </button>
        </div>
      )}
    </motion.div>
  );
}
