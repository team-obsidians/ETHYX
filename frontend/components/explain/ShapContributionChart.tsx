// c:\Obsidian\Ethyx\frontend\components\explain\ShapContributionChart.tsx
"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { ExplainEmptyState } from "./ExplainEmptyState";
import type { ShapContribution } from "@/types/explain";

interface ShapContributionChartProps {
  data: ShapContribution[] | null | undefined;
}

export function ShapContributionChart({ data }: ShapContributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <ExplainEmptyState
        title="SHAP Analysis Unavailable"
        description="Feature importance scores have not been generated for this record."
      />
    );
  }

  const chartData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/50 h-[350px]">
      <h3 className="font-orbitron text-xs font-bold text-[#AABBC4] mb-6 tracking-widest uppercase">
        Feature Importance (SHAP)
      </h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#3C494A" opacity={0.2} horizontal={false} />
            <XAxis type="number" stroke="#AABBC4" fontSize={10} tickLine={false} />
            <YAxis dataKey="feature" type="category" stroke="#AABBC4" fontSize={10} tickLine={false} width={80} />
            <Tooltip
              cursor={{ fill: "rgba(57, 62, 70, 0.2)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-[#1C2128] border border-[#3C494A] p-3 rounded-lg shadow-xl font-dm-sans text-xs">
                      <p className="text-[#EEEEEE] font-bold">{payload[0].payload.feature}</p>
                      <p className={val >= 0 ? "text-[#55d8e1]" : "text-[#EF4444]"}>
                        Impact: {val.toFixed(4)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? "#00ADB5" : "#EF4444"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
