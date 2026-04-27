// c:\Obsidian\Ethyx\frontend\components\dashboard\ViewToggle.tsx
// Technical / Executive toggle with Framer Motion animated pill indicator
"use client";

import React from "react";

import { motion } from "framer-motion";
import { BarChart2, PieChart } from "lucide-react";

type ViewMode = "technical" | "executive";

interface ViewToggleProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ activeView, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#1C2128] rounded-full p-1 border border-[#00ADB5]/12">
      <ToggleButton
        active={activeView === "technical"}
        onClick={() => onChange("technical")}
        icon={<BarChart2 className="w-3.5 h-3.5" />}
        label="Technical"
      />
      <ToggleButton
        active={activeView === "executive"}
        onClick={() => onChange("executive")}
        icon={<PieChart className="w-3.5 h-3.5" />}
        label="Executive"
      />
    </div>
  );
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ToggleButton({ active, onClick, icon, label }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 ${
        active ? "text-[#222831]" : "text-[#6B8090]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="dashboard-view-indicator"
          className="absolute inset-0 bg-[#00ADB5] rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}
