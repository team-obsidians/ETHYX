// c:\Obsidian\Ethyx\frontend\components\charts\SelectionRateChart.tsx
// Bar chart showing selection/approval rate per group with threshold reference
"use client";

import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { ChartShell } from "@/components/charts/ChartShell";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { RiskBreakdownDatum } from "@/types/dashboard";

interface SelectionRateChartProps {
  data: RiskBreakdownDatum[];
}

export function SelectionRateChart({ data }: SelectionRateChartProps) {
  if (data.length === 0) {
    return (
      <ChartShell title="Metric Values" subtitle="No data available">
        <div className="flex items-center justify-center h-full text-[#6B8090] text-sm font-dm-mono">
          No metric data available
        </div>
      </ChartShell>
    );
  }

  return (
    <ChartShell
      title="Fairness Metric Values"
      subtitle="Measured vs threshold"
      height={300}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        barCategoryGap="25%"
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
          domain={[0, "auto"]}
        />
        <YAxis
          type="category"
          dataKey="metric"
          tick={{ fill: "#AABBC4", fontSize: 11, fontFamily: "DM Sans" }}
          axisLine={false}
          tickLine={false}
          width={95}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,173,181,0.05)" }} />
        <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.status === "pass" ? "#00ADB5" : "#EF4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}
