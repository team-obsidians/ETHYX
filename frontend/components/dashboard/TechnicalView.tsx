// c:\Obsidian\Ethyx\frontend\components\dashboard\TechnicalView.tsx
// Full technical dashboard with charts, metrics table, warnings, and narrative
"use client";

import React from "react";

import { motion } from "framer-motion";

import type { AnalysisResults, SelectionRateDatum } from "@/types/dashboard";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { MetricSummaryGrid } from "@/components/dashboard/MetricSummaryGrid";
import { FairnessMetricsTable } from "@/components/dashboard/FairnessMetricsTable";
import { WarningsPanel } from "@/components/dashboard/WarningsPanel";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";
import { GroupImpactChart } from "@/components/charts/GroupImpactChart";
import { SelectionRateChart } from "@/components/charts/SelectionRateChart";
import { RiskBreakdownChart } from "@/components/charts/RiskBreakdownChart";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";

interface TechnicalViewProps {
  results: AnalysisResults;
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

function buildMetricChartData(results: AnalysisResults) {
  return METRIC_CONFIGS.map((config) => {
    const value = results.metrics[config.key] ?? 0;
    return {
      metric: config.label,
      value: Math.abs(value),
      threshold: config.threshold,
      status: getMetricStatus(config, value),
    };
  });
}

export function TechnicalView({ results }: TechnicalViewProps) {
  const groupChartData = buildChartData(results.approval_rates);
  const metricChartData = buildMetricChartData(results);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Row 1: Risk Score + Metric Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <RiskScoreCard score={results.risk_score} level={results.risk_level} />
        <div className="lg:col-span-3">
          <MetricSummaryGrid metrics={results.metrics} />
        </div>
      </div>

      {/* Row 2: Warnings */}
      <WarningsPanel metrics={results.metrics} />

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GroupImpactChart data={groupChartData} />
        <RiskBreakdownChart metrics={results.metrics} />
      </div>

      {/* Row 4: Metric detail chart */}
      <SelectionRateChart data={metricChartData} />

      {/* Row 5: Metrics Table */}
      <FairnessMetricsTable metrics={results.metrics} />

      {/* Row 6: AI Narrative */}
      {results.narrative && (
        <RecommendationsPanel narrative={results.narrative} />
      )}

      {/* Row 7: Dataset metadata */}
      <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-6">
        <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE] mb-4">
          Dataset Metadata
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetaItem
            label="Rows Analyzed"
            value={results.row_count.toLocaleString()}
          />
          <MetaItem label="Columns" value={String(results.column_count)} />
          <MetaItem
            label="Missing Data"
            value={`${results.missing_value_pct.toFixed(1)}%`}
          />
          <MetaItem label="Domain" value={results.domain} />
        </div>
      </div>
    </motion.div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-bold text-[#6B8090] uppercase tracking-widest block mb-1">
        {label}
      </span>
      <span className="text-lg font-dm-mono font-medium text-[#EEEEEE] tabular-nums">
        {value}
      </span>
    </div>
  );
}
