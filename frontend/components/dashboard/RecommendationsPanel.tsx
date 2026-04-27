// c:\Obsidian\Ethyx\frontend\components\dashboard\RecommendationsPanel.tsx
// AI-generated narrative and recommendations display
"use client";

import React from "react";

import { Sparkles } from "lucide-react";

interface RecommendationsPanelProps {
  narrative: string;
}

export function RecommendationsPanel({ narrative }: RecommendationsPanelProps) {
  const paragraphs = narrative.split("\n").filter((p) => p.trim().length > 0);

  return (
    <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-[#00ADB5]/5">
        <Sparkles className="w-5 h-5 text-[#00ADB5]" />
        <div>
          <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
            AI Analysis Summary
          </h3>
          <p className="text-[10px] font-dm-mono text-[#00ADB5]/70 uppercase tracking-widest">
            Gemini-generated narrative
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {paragraphs.map((para, idx) => (
          <p
            key={idx}
            className="text-sm text-[#EEEEEE]/85 leading-relaxed"
          >
            {para}
          </p>
        ))}
        {paragraphs.length === 0 && (
          <p className="text-sm text-[#6B8090] italic">
            No narrative summary available for this analysis.
          </p>
        )}
      </div>
    </div>
  );
}
