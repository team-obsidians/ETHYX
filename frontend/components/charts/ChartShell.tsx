// c:\Obsidian\Ethyx\frontend\components\charts\ChartShell.tsx
// Reusable chart wrapper with glassmorphism card, label, and ResponsiveContainer
"use client";

import React from "react";

import { ResponsiveContainer } from "recharts";

interface ChartShellProps {
  title: string;
  subtitle?: string;
  height?: number;
  children: React.ReactElement;
}

export function ChartShell({
  title,
  subtitle,
  height = 320,
  children,
}: ChartShellProps) {
  return (
    <div className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/12 rounded-[14px] p-6">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h3 className="text-sm font-orbitron font-black uppercase tracking-wider text-[#EEEEEE]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] font-dm-mono text-[#6B8090] mt-1 uppercase tracking-widest">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
