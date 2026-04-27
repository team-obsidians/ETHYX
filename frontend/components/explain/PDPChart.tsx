// c:\Obsidian\Ethyx\frontend\components\explain\PDPChart.tsx
"use client";

import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ExplainEmptyState } from "./ExplainEmptyState";
import type { PDPData } from "@/types/explain";

interface PDPChartProps {
  data: PDPData[] | null | undefined;
}

export function PDPChart({ data }: PDPChartProps) {
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState<number>(0);

  if (!data || data.length === 0) {
    return (
      <ExplainEmptyState
        title="Partial Dependence Curves Unavailable"
        description="PDP profiling could not be extracted for this dataset."
      />
    );
  }

  const activePDP = data[selectedFeatureIdx];
  if (!activePDP || !activePDP.points || activePDP.points.length === 0) {
    return (
      <ExplainEmptyState
        title="Feature Profile Unavailable"
        description="No data points exist for the selected feature curve."
      />
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/50 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-orbitron text-xs font-bold text-[#AABBC4] tracking-widest uppercase">
          Partial Dependence (PDP)
        </h3>
        {data.length > 1 && (
          <select
            value={selectedFeatureIdx}
            onChange={(e) => setSelectedFeatureIdx(Number(e.target.value))}
            className="bg-[#222831] border border-[#3C494A]/50 text-[#EEEEEE] text-xs font-dm-sans rounded px-2 py-1 focus:outline-none focus:border-[#00ADB5]"
          >
            {data.map((pdp, idx) => (
              <option key={pdp.feature} value={idx}>
                {pdp.feature}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={activePDP.points}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#3C494A" opacity={0.2} />
            <XAxis dataKey="value" stroke="#AABBC4" fontSize={10} tickLine={false} />
            <YAxis stroke="#AABBC4" fontSize={10} tickLine={false} />
            <Tooltip
              cursor={{ stroke: "rgba(57, 62, 70, 0.2)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1C2128] border border-[#3C494A] p-3 rounded-lg shadow-xl font-dm-sans text-xs">
                      <p className="text-[#AABBC4]">{activePDP.feature}: <span className="text-[#EEEEEE] font-bold">{payload[0].payload.value}</span></p>
                      <p className="text-[#55d8e1] mt-1 font-medium">
                        Impact: {Number(payload[0].value).toFixed(4)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="impact"
              stroke="#00ADB5"
              strokeWidth={2}
              dot={{ fill: "#00ADB5", r: 4 }}
              activeDot={{ r: 6, fill: "#55d8e1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
