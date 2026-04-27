// c:\Obsidian\Ethyx\frontend\components\dashboard\AuditStatusPanel.tsx
// Status display for non-complete audits: uploaded, queued, analyzing, failed, timeout
"use client";

import React from "react";

import { motion } from "framer-motion";
import {
  Loader2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Upload,
} from "lucide-react";
import Link from "next/link";

import type { AuditStatus } from "@/types/dashboard";

interface AuditStatusPanelProps {
  status: AuditStatus | "loading" | "timeout";
  step?: number;
  stepDescription?: string | null;
  errorMessage?: string | null;
  onRetry?: () => void;
}

const STEP_LABELS = [
  "Validating dataset...",
  "Computing fairness metrics...",
  "Running statistical tests...",
  "Generating AI narrative...",
  "Finalizing results...",
];

export function AuditStatusPanel({
  status,
  step = 0,
  stepDescription,
  errorMessage,
  onRetry,
}: AuditStatusPanelProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-10 max-w-md w-full text-center"
      >
        {(status === "uploaded" || status === "queued" || status === "loading") && (
          <>
            <Clock className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="text-xl font-orbitron font-black text-[#EEEEEE] mb-2">
              Queued
            </h3>
            <p className="text-sm text-[#AABBC4] mb-6">
              Your analysis is queued and will begin shortly.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-dm-mono text-[#F59E0B]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Waiting for worker...
            </div>
          </>
        )}

        {status === "analyzing" && (
          <>
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-[#00ADB5]/20" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00ADB5]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-[#00ADB5] animate-spin" />
            </div>
            <h3 className="text-xl font-orbitron font-black text-[#EEEEEE] mb-2">
              Analyzing
            </h3>
            <p className="text-sm text-[#AABBC4] mb-6">
              {stepDescription ?? STEP_LABELS[Math.min(step, STEP_LABELS.length - 1)]}
            </p>
            <div className="w-full h-1.5 bg-[#222831] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00ADB5] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 5) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-[10px] font-dm-mono text-[#6B8090] mt-2 uppercase tracking-widest">
              Step {step + 1} of 5
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <AlertTriangle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
            <h3 className="text-xl font-orbitron font-black text-[#EEEEEE] mb-2">
              Analysis Failed
            </h3>
            <p className="text-sm text-[#AABBC4] mb-2">
              {errorMessage ?? "An unexpected error occurred during analysis."}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-5 py-2.5 rounded-btn border border-[#00ADB5]/40 text-[#00ADB5] font-bold text-sm hover:bg-[#00ADB5]/5 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              )}
              <Link
                href="/upload"
                className="px-5 py-2.5 rounded-btn bg-gradient-to-br from-[#00ADB5] to-[#008891] text-[#222831] font-bold text-sm shadow-teal-glow flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Audit
              </Link>
            </div>
          </>
        )}

        {status === "timeout" && (
          <>
            <Clock className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="text-xl font-orbitron font-black text-[#EEEEEE] mb-2">
              Timed Out
            </h3>
            <p className="text-sm text-[#AABBC4] mb-6">
              Analysis exceeded the maximum wait time. Please try again.
            </p>
            <Link
              href="/upload"
              className="px-5 py-2.5 rounded-btn bg-gradient-to-br from-[#00ADB5] to-[#008891] text-[#222831] font-bold text-sm shadow-teal-glow inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              New Audit
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
