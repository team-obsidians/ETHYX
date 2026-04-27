// c:\Obsidian\Ethyx\frontend\components\charts\ChartTooltip.tsx
"use client";

import React from "react";
import type { TooltipProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[#1C2128] border border-[#00ADB5]/20 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-[10px] font-dm-mono text-[#6B8090] uppercase tracking-widest mb-2">
        {label}
      </p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            ref={(el) => {
              if (el) el.style.backgroundColor = entry.color ?? "#00ADB5";
            }}
            className="w-2 h-2 rounded-full shrink-0"
          />
          <span className="text-xs text-[#AABBC4]">{entry.name}:</span>
          <span className="text-xs font-dm-mono font-medium text-[#EEEEEE]">
            {typeof entry.value === "number"
              ? entry.value.toFixed(3)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
