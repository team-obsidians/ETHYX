// c:\Obsidian\Ethyx\frontend\components\charts\RiskBreakdownChart.tsx
// Horizontal bar chart showing each metric's contribution to overall risk
"use client";

import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";

import { ChartShell } from "@/components/charts/ChartShell";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { FairnessMetrics } from "@/types/dashboard";
import { METRIC_CONFIGS, getMetricStatus } from "@/types/dashboard";

interface RiskBreakdownChartProps {
  metrics: FairnessMetrics;
}

export function RiskBreakdownChart({ metrics }: RiskBreakdownChartProps) {
  const chartData = METRIC_CONFIGS.map((config) => {
    const value = metrics[config.key] ?? 0;
    return {
      metric: config.label,
      value: Math.abs(value),
      threshold: config.threshold,
      status: getMetricStatus(config, value),
    };
  });

  return (
    <ChartShell
      title="Risk Breakdown"
      subtitle="Per-metric analysis"
      height={260}
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 110, bottom: 5 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,173,181,0.08)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "#6B8090", fontSize: 11, fontFamily: "DM Mono" }}
          axisLine={{ stroke: "rgba(0,173,181,0.12)" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="metric"
          tick={{ fill: "#AABBC4", fontSize: 11, fontFamily: "DM Sans" }}
          axisLine={false}
          tickLine={false}
          width={105}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,173,181,0.05)" }} />
        <ReferenceLine
          x={0.8}
          stroke="#F59E0B"
          strokeDasharray="6 4"
          label={{
            value: "Threshold",
            position: "top",
            fill: "#F59E0B",
            fontSize: 10,
            fontFamily: "DM Mono",
          }}
        />
        <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {chartData.map((entry, idx) => (
            <Cell
              key={`risk-${idx}`}
              fill={entry.status === "pass" ? "#00ADB5" : "#EF4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}
