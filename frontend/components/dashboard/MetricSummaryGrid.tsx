// c:\Obsidian\Ethyx\frontend\components\dashboard\MetricSummaryGrid.tsx
// Grid of fairness metric KPI cards with PASS/FAIL badges
"use client";

import React from "react";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

import type { FairnessMetrics } from "@/types/dashboard";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";

interface MetricSummaryGridProps {
  metrics: FairnessMetrics;
}

const STAGGER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function MetricSummaryGrid({ metrics }: MetricSummaryGridProps) {
  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {METRIC_CONFIGS.map((config) => {
        const value = metrics[config.key] ?? 0;
        const status = getMetricStatus(config, value);
        const isPassing = status === "pass";

        return (
          <motion.div
            key={config.key}
            variants={ITEM}
            className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 p-5 rounded-[14px] flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-[#EEEEEE]/50 uppercase tracking-widest leading-tight">
                {config.label}
              </span>
              {isPassing ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
              )}
            </div>

            <span className="text-2xl font-orbitron font-black tabular-nums text-[#EEEEEE]">
              {config.format === "ratio"
                ? (value ?? 0).toFixed(2)
                : `${(value ?? 0) >= 0 ? "+" : ""}${(value ?? 0).toFixed(3)}`}
            </span>

            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-dm-mono uppercase px-1.5 py-0.5 rounded border ${
                  isPassing
                    ? "text-[#10B981] border-[#10B981]/20 bg-[#10B981]/5"
                    : "text-[#EF4444] border-[#EF4444]/20 bg-[#EF4444]/5"
                }`}
              >
                {isPassing ? "PASS" : "FAIL"}
              </span>
              <span className="text-[9px] font-dm-mono text-[#6B8090]">
                thr: {config.direction === "above" ? "≥" : "≤"}{" "}
                {config.threshold}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
