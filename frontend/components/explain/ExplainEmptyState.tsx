// c:\Obsidian\Ethyx\frontend\components\explain\ExplainEmptyState.tsx
"use client";

import React from "react";
import { BarChart2 } from "lucide-react";

interface ExplainEmptyStateProps {
  title: string;
  description: string;
}

export function ExplainEmptyState({ title, description }: ExplainEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center glass-card rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/20">
      <div className="w-12 h-12 rounded-full bg-[#3C494A]/20 flex items-center justify-center text-[#AABBC4] mb-4 border border-[#3C494A]/30">
        <BarChart2 className="w-6 h-6" />
      </div>
      <h4 className="font-orbitron text-sm font-bold text-[#EEEEEE] mb-2 tracking-wide">
        {title}
      </h4>
      <p className="text-xs text-[#AABBC4] max-w-xs font-dm-sans">
        {description}
      </p>
    </div>
  );
}
