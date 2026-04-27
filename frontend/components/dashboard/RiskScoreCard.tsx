// c:\Obsidian\Ethyx\frontend\components\dashboard\RiskScoreCard.tsx
// Large KPI card with animated risk score and progress bar
"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { AlertTriangle, Shield, ShieldAlert } from "lucide-react";

import { normalizeRiskLevel, type RiskLevel } from "@/types/dashboard";

interface RiskScoreCardProps {
  score: number;
  level: unknown;
}

const LEVEL_CLASSES: Record<RiskLevel, { text: string; bg: string; bgGlow: string; border: string; bar: string }> = {
  low: {
    text: "text-[#10B981]",
    bg: "bg-[#10B981]/5",
    bgGlow: "bg-[#10B981]/10",
    border: "border-[#10B981]/20",
    bar: "bg-[#10B981]",
  },
  medium: {
    text: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/5",
    bgGlow: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/20",
    bar: "bg-[#F59E0B]",
  },
  high: {
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/5",
    bgGlow: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/20",
    bar: "bg-[#EF4444]",
  },
  critical: {
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/5",
    bgGlow: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/20",
    bar: "bg-[#EF4444]",
  },
};

function RiskIcon({
  level,
  className,
}: {
  level: RiskLevel;
  className: string;
}) {
  switch (level) {
    case "low":
      return <Shield className={className} />;
    case "medium":
      return <AlertTriangle className={className} />;
    case "high":
    case "critical":
      return <ShieldAlert className={className} />;
  }
}

const LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Moderate Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export function RiskScoreCard({ score, level }: RiskScoreCardProps) {
  const safeLevel = normalizeRiskLevel(level);
  const classes = LEVEL_CLASSES[safeLevel];
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#393E46]/70 backdrop-blur-[14px] border border-[#00ADB5]/15 p-6 rounded-[14px] relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full blur-3xl transition-colors ${classes.bgGlow}`} />

      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-[#EEEEEE]/60 uppercase tracking-widest">
          Risk Score
        </span>
        <RiskIcon level={safeLevel} className={`w-6 h-6 ${classes.text}`} />
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-5xl font-orbitron font-black tabular-nums ${classes.text}`}>
          {displayScore}
        </span>
        <span className="text-lg font-dm-mono text-[#EEEEEE]/40">/100</span>
      </div>

      <div className="mt-4 h-2 w-full bg-[#222831] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full ${classes.bar}`}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className={`text-[10px] font-dm-mono uppercase px-2 py-0.5 rounded border ${classes.text} ${classes.border} ${classes.bg}`}>
          {LABELS[safeLevel]}
        </span>
      </div>
    </motion.div>
  );
}
