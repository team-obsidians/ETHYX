// c:\Obsidian\Ethyx\frontend\components\dashboard\FairnessMetricsTable.tsx
// Detailed table of all fairness metrics with explanations
"use client";

import React from "react";

import { CheckCircle2, XCircle, Info } from "lucide-react";

import type { FairnessMetrics } from "@/types/dashboard";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";

interface FairnessMetricsTableProps {
  metrics: FairnessMetrics;
}

export function FairnessMetricsTable({ metrics }: FairnessMetricsTableProps) {
  return (
    <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
          Fairness Metrics Detail
        </h3>
        <p className="text-[10px] font-dm-mono text-[#6B8090] mt-1 uppercase tracking-widest">
          Comprehensive analysis breakdown
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B8090] uppercase tracking-widest">
                Metric
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B8090] uppercase tracking-widest text-right">
                Value
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B8090] uppercase tracking-widest text-right">
                Threshold
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B8090] uppercase tracking-widest text-center">
                Status
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B8090] uppercase tracking-widest">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {METRIC_CONFIGS.map((config) => {
              const value = metrics[config.key] ?? 0;
              const status = getMetricStatus(config, value);
              const isPassing = status === "pass";

              return (
                <tr
                  key={config.key}
                  className="border-b border-white/5 last:border-b-0 hover:bg-[#00ADB5]/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-[#00ADB5]/50" />
                      <span className="text-sm font-medium text-[#EEEEEE]">
                        {config.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-dm-mono font-medium text-[#EEEEEE] tabular-nums">
                      {config.format === "ratio"
                        ? (value ?? 0).toFixed(3)
                        : `${(value ?? 0) >= 0 ? "+" : ""}${(value ?? 0).toFixed(4)}`}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-dm-mono text-[#6B8090] tabular-nums">
                      {config.direction === "above" ? "≥ " : "≤ ±"}
                      {config.threshold}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {isPassing ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-dm-mono text-[#10B981] uppercase px-2 py-0.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/5">
                        <CheckCircle2 className="w-3 h-3" />
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-dm-mono text-[#EF4444] uppercase px-2 py-0.5 rounded-full border border-[#EF4444]/20 bg-[#EF4444]/5">
                        <XCircle className="w-3 h-3" />
                        Fail
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#AABBC4]">
                      {config.description}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
