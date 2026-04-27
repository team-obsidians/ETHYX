// c:\Obsidian\Ethyx\frontend\components\dashboard\WarningsPanel.tsx
// Alert cards for bias warnings — cherry-picked from dashboard_spacious_v1.html
"use client";

import React from "react";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import type { FairnessMetrics } from "@/types/dashboard";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";

interface WarningsPanelProps {
  metrics: FairnessMetrics;
}

interface WarningItem {
  title: string;
  description: string;
  severity: "critical" | "warning";
}

function generateWarnings(metrics: FairnessMetrics): WarningItem[] {
  const warnings: WarningItem[] = [];

  for (const config of METRIC_CONFIGS) {
    const value = metrics[config.key] ?? 0;
    const status = getMetricStatus(config, value);

    if (status === "fail") {
      const isCritical =
        config.key === "demographic_parity_ratio" || config.key === "demographic_parity_difference";

      warnings.push({
        title: `${config.label} Violation`,
        description: `${config.description}. Current value: ${Math.abs(value).toFixed(3)}, threshold: ${config.threshold}.`,
        severity: isCritical ? "critical" : "warning",
      });
    }
  }

  return warnings;
}

export function WarningsPanel({ metrics }: WarningsPanelProps) {
  const warnings = generateWarnings(metrics);

  if (warnings.length === 0) {
    return (
      <div className="bg-[#10B981]/5 border border-[#10B981]/20 p-5 rounded-[14px] flex gap-4 items-center">
        <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h4 className="text-[#10B981] font-bold uppercase text-xs tracking-wider mb-1">
            All Clear
          </h4>
          <p className="text-sm text-[#EEEEEE]/80 leading-relaxed">
            No fairness violations detected. All metrics are within acceptable
            thresholds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {warnings.map((w, idx) => {
        const isCritical = w.severity === "critical";

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className={`p-5 rounded-[14px] flex gap-4 border ${
              isCritical
                ? "bg-[#EF4444]/5 border-[#EF4444]/20"
                : "bg-amber-900/10 border-amber-500/20"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isCritical ? "bg-[#EF4444]/10" : "bg-amber-500/10"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${isCritical ? "text-[#EF4444]" : "text-amber-500"}`}
              />
            </div>
            <div>
              <h4
                className={`font-bold uppercase text-xs tracking-wider mb-1 ${
                  isCritical ? "text-[#EF4444]" : "text-amber-500"
                }`}
              >
                {w.title}
              </h4>
              <p className="text-sm text-[#EEEEEE]/80 leading-relaxed">
                {w.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
