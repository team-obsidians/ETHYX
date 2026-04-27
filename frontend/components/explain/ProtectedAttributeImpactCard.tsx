// c:\Obsidian\Ethyx\frontend\components\explain\ProtectedAttributeImpactCard.tsx
"use client";

import React, { useRef, useEffect } from "react";

interface ProtectedAttributeImpactCardProps {
  attributes: string[];
  fairnessRisk: number;
}

export function ProtectedAttributeImpactCard({
  attributes,
  fairnessRisk,
}: ProtectedAttributeImpactCardProps) {
  const hasAttributes = attributes && attributes.length > 0;
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${fairnessRisk}%`;
    }
  }, [fairnessRisk]);

  return (
    <div className="glass-card p-6 rounded-xl border border-[#3C494A]/20 bg-[#1C2128]/50 h-full flex flex-col justify-between">
      <div>
        <h3 className="font-orbitron text-xs font-bold text-[#AABBC4] tracking-widest uppercase mb-4">
          Protected Attribute Impact
        </h3>
        
        {hasAttributes ? (
          <div className="space-y-4">
            <p className="text-xs font-dm-sans text-[#AABBC4]">
              The following protected attributes were evaluated for direct and indirect impact:
            </p>
            <div className="flex flex-wrap gap-2">
              {attributes.map((attr) => (
                <span
                  key={attr}
                  className="text-[10px] font-orbitron px-3 py-1 rounded bg-[#222831] border border-[#3C494A]/50 text-[#EEEEEE] uppercase tracking-wider"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs font-dm-sans text-[#6B8090] italic">
            No protected attributes explicitly defined for this audit.
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-orbitron text-[#AABBC4] uppercase tracking-widest">
            Overall Proxy Impact
          </span>
          <span className={`text-xs font-dm-mono font-bold ${fairnessRisk > 50 ? "text-[#EF4444]" : "text-[#00ADB5]"}`}>
            {fairnessRisk}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#222831] rounded-full overflow-hidden">
          <div
            ref={barRef}
            className={`h-full transition-all duration-1000 ease-out ${
              fairnessRisk > 60
                ? "bg-[#EF4444]"
                : fairnessRisk > 30
                ? "bg-[#F59E0B]"
                : "bg-[#00ADB5]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
