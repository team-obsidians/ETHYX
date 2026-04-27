// c:\Obsidian\Ethyx\frontend\components\dashboard\ExecutiveView.tsx
// Executive summary — plain-language overview for non-technical stakeholders
"use client";

import React from "react";

import { motion } from "framer-motion";
import {
  Shield,
  Users,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import type { AnalysisResults, RiskLevel } from "@/types/dashboard";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { GroupImpactChart } from "@/components/charts/GroupImpactChart";
import type { SelectionRateDatum } from "@/types/dashboard";

interface ExecutiveViewProps {
  results: AnalysisResults;
}

const RISK_ICON_CLASSES: Record<RiskLevel, string> = {
  low: "text-[#10B981]",
  medium: "text-[#F59E0B]",
  high: "text-[#EF4444]",
  critical: "text-[#EF4444]",
};

function riskMessage(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "Your model demonstrates equitable treatment across demographic groups. Continue monitoring to maintain compliance.";
    case "medium":
      return "Some fairness metrics show moderate deviation from acceptable thresholds. Targeted interventions are recommended.";
    case "high":
      return "Significant bias has been detected. Immediate attention is required to address fairness violations before deployment.";
    case "critical":
      return "Critical bias indicators were detected. Treat this as a high-priority review before using the model output.";
  }
}

function buildChartData(
  approvalRates: Record<string, { male: number; female: number }>
): SelectionRateDatum[] {
  return Object.entries(approvalRates).map(([group, rates]) => ({
    group,
    male: rates.male,
    female: rates.female,
  }));
}

export function ExecutiveView({ results }: ExecutiveViewProps) {
  const iconClass = RISK_ICON_CLASSES[results.risk_level];
  const failingMetrics = METRIC_CONFIGS.filter(
    (c) => getMetricStatus(c, results.metrics[c.key] ?? 0) === "fail"
  );
  const chartData = buildChartData(results.approval_rates);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Risk Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskScoreCard score={results.risk_score} level={results.risk_level} />

        <div className="lg:col-span-2 bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <Shield className={`w-5 h-5 ${iconClass}`} />
            <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
              What This Means
            </h3>
          </div>
          <p className="text-sm text-[#EEEEEE]/85 leading-relaxed mb-4">
            {riskMessage(results.risk_level)}
          </p>
          <div className="flex items-center gap-4 text-xs font-dm-mono text-[#6B8090]">
            <span>{results.row_count.toLocaleString()} rows analyzed</span>
            <span>{results.column_count} columns</span>
            <span>{results.missing_value_pct.toFixed(1)}% missing data</span>
          </div>
        </div>
      </div>

      {/* Failing Metrics Summary */}
      {failingMetrics.length > 0 && (
        <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
              Areas of Concern
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {failingMetrics.map((config) => (
              <div
                key={config.key}
                className="flex items-start gap-3 p-4 bg-[#EF4444]/5 border border-[#EF4444]/15 rounded-lg"
              >
                <TrendingDown className="w-4 h-4 text-[#EF4444] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#EEEEEE] mb-1">
                    {config.label}
                  </h4>
                  <p className="text-xs text-[#AABBC4] leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Impact Chart */}
      {chartData.length > 0 && <GroupImpactChart data={chartData} />}

      {/* Recommended Actions */}
      <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-[#00ADB5]" />
          <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
            Recommended Next Steps
          </h3>
        </div>
        <div className="space-y-3">
          {results.narrative ? (
            results.narrative
              .split("\n")
              .filter((l) => l.trim())
              .slice(0, 4)
              .map((line, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-[#00ADB5] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#EEEEEE]/85 leading-relaxed">
                    {line}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-sm text-[#6B8090] italic">
              No recommendations available yet.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
