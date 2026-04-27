// c:\Obsidian\Ethyx\frontend\components\charts\GroupImpactChart.tsx
// Grouped bar chart comparing approval/selection rates per demographic group
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
import type { SelectionRateDatum } from "@/types/dashboard";

interface GroupImpactChartProps {
  data: SelectionRateDatum[];
}

const TEAL = "#00ADB5";
const TEAL_MUTED = "#008891";

export function GroupImpactChart({ data }: GroupImpactChartProps) {
  if (data.length === 0) {
    return (
      <ChartShell title="Approval Rate by Group" subtitle="No data available">
        <div className="flex items-center justify-center h-full text-[#6B8090] text-sm font-dm-mono">
          No group data available
        </div>
      </ChartShell>
    );
  }

  return (
    <ChartShell
      title="Approval Rate by Group"
      subtitle="Male vs Female selection rates"
      height={340}
    >
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        barCategoryGap="20%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,173,181,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="group"
          tick={{ fill: "#6B8090", fontSize: 11, fontFamily: "DM Mono" }}
          axisLine={{ stroke: "rgba(0,173,181,0.12)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B8090", fontSize: 11, fontFamily: "DM Mono" }}
          axisLine={false}
          tickLine={false}
          domain={[0, 1]}
          tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,173,181,0.05)" }} />
        <ReferenceLine
          y={0.8}
          stroke="#F59E0B"
          strokeDasharray="6 4"
          label={{
            value: "4/5ths Rule",
            position: "insideTopRight",
            fill: "#F59E0B",
            fontSize: 10,
            fontFamily: "DM Mono",
          }}
        />
        <Bar dataKey="male" name="Male" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((_, idx) => (
            <Cell key={`male-${idx}`} fill={TEAL} />
          ))}
        </Bar>
        <Bar dataKey="female" name="Female" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((entry, idx) => (
            <Cell
              key={`female-${idx}`}
              fill={entry.female < 0.8 ? "#EF4444" : TEAL_MUTED}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}
