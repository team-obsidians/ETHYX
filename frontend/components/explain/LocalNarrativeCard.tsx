// c:\Obsidian\Ethyx\frontend\components\explain\LocalNarrativeCard.tsx
"use client";

import React from "react";

interface LocalNarrativeCardProps {
  entityName: string;
  prediction: "APPROVED" | "DENIED";
  confidence: number;
  fairnessRisk: number;
}

export function LocalNarrativeCard({
  entityName,
  prediction,
  confidence,
  fairnessRisk,
}: LocalNarrativeCardProps) {
  const isApproved = prediction === "APPROVED";
  
  return (
    <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/50 h-full flex flex-col justify-between">
      <div>
        <h3 className="font-orbitron text-xs font-bold text-[#AABBC4] tracking-widest uppercase mb-4">
          Local Narrative
        </h3>
        <p className="text-sm font-dm-sans text-[#EEEEEE] leading-relaxed">
          <strong className="text-[#55d8e1]">{entityName}</strong> was{" "}
          <strong className={isApproved ? "text-[#00ADB5]" : "text-[#EF4444]"}>
            {prediction}
          </strong>{" "}
          with a confidence score of <strong>{(confidence * 100).toFixed(0)}%</strong>.
        </p>
        <p className="text-xs font-dm-sans text-[#AABBC4] mt-3 leading-relaxed">
          The algorithmic evaluation determined a{" "}
          <span className={fairnessRisk > 50 ? "text-[#EF4444] font-bold" : "text-[#55d8e1]"}>
            {fairnessRisk > 60 ? "High" : fairnessRisk > 30 ? "Moderate" : "Low"}
          </span>{" "}
          fairness risk index of <strong>{fairnessRisk}%</strong>. This suggests the model decision relies on key features that may correlate with sensitive attributes.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-[#3C494A]/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00ADB5] animate-pulse" />
          <span className="text-[10px] font-dm-sans text-[#6B8090] uppercase tracking-widest">
            Bias Audit Verified
          </span>
        </div>
      </div>
    </div>
  );
}
