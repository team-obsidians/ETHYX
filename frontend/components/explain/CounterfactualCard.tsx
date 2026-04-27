// c:\Obsidian\Ethyx\frontend\components\explain\CounterfactualCard.tsx
"use client";

import React from "react";
import { ExplainEmptyState } from "./ExplainEmptyState";
import type { CounterfactualData } from "@/types/explain";

interface CounterfactualCardProps {
  data: CounterfactualData | null | undefined;
}

export function CounterfactualCard({ data }: CounterfactualCardProps) {
  if (!data || !data.changed_fields || data.changed_fields.length === 0) {
    return (
      <ExplainEmptyState
        title="No Counterfactual Suggested"
        description="Alternative scenarios were not discovered for this record."
      />
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-orbitron text-xs font-bold text-[#AABBC4] tracking-widest uppercase">
          Counterfactual Simulation
        </h3>
        <span className="text-[10px] px-2 py-1 rounded-full font-orbitron tracking-widest bg-[#00ADB5]/10 border border-[#00ADB5]/30 text-[#55d8e1] uppercase">
          Target: {data.flipped_prediction}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[240px] pr-2">
        {data.changed_fields.map((field) => {
          const currentVal = data.current[field];
          const suggestedVal = data.suggested[field];
          return (
            <div key={field} className="p-4 rounded-lg bg-[#222831]/50 border border-[#3C494A]/10 flex flex-col space-y-2">
              <span className="text-xs font-orbitron text-[#AABBC4] uppercase tracking-wider">{field}</span>
              <div className="flex items-center justify-between text-xs font-dm-sans">
                <div className="flex flex-col">
                  <span className="text-[#6B8090] text-[10px] uppercase tracking-widest">Current</span>
                  <span className="text-[#EEEEEE] font-medium mt-1">{String(currentVal)}</span>
                </div>
                <div className="flex items-center justify-center px-3 text-[#AABBC4]">
                  →
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#55d8e1] text-[10px] uppercase tracking-widest">Suggested</span>
                  <span className="text-[#55d8e1] font-bold mt-1">{String(suggestedVal)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-[10px] font-dm-sans text-[#6B8090] mt-4 italic text-center">
        Changing these features will flip the model's decision to {data.flipped_prediction}.
      </p>
    </div>
  );
}
