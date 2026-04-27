// c:\Obsidian\Ethyx\frontend\components\explain\PredictionRow.tsx
"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { IndividualPrediction } from "@/types/explain";

interface PredictionRowProps {
  row: IndividualPrediction;
  isSelected: boolean;
  onSelect: () => void;
}

export function PredictionRow({ row, isSelected, onSelect }: PredictionRowProps) {
  const getRiskColor = (risk: number) => {
    if (risk > 70) return "text-[#EF4444] border-red-500/20 bg-red-500/5";
    if (risk > 40) return "text-[#F59E0B] border-orange-500/20 bg-orange-500/5";
    return "text-[#10B981] border-emerald-500/20 bg-emerald-500/5";
  };

  return (
    <tr
      onClick={onSelect}
      className={`border-b border-[#3C494A]/20 cursor-pointer transition-all hover:bg-[#2F353E]/30 ${
        isSelected ? "bg-[#2F353E]/50 border-l-4 border-l-[#00ADB5]" : "border-l-4 border-l-transparent"
      }`}
    >
      <td className="px-6 py-4 text-sm font-dm-mono text-[#AABBC4]">{row.id}</td>
      <td className="px-6 py-4 text-sm font-bold text-[#EEEEEE]">{row.entity}</td>
      <td className="px-6 py-4">
        <span
          className={`flex items-center gap-2 text-xs font-bold font-orbitron tracking-wide ${
            row.prediction === "APPROVED" ? "text-[#55d8e1]" : "text-[#EF4444]"
          }`}
        >
          {row.prediction === "APPROVED" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {row.prediction}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-dm-mono text-[#EEEEEE]">
        {(row.confidence * 100).toFixed(0)}%
      </td>
      <td className="px-6 py-4">
        <span
          className={`flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-bold ${getRiskColor(
            row.fairness_risk
          )}`}
        >
          <AlertTriangle className="w-3 h-3" />
          {row.fairness_risk}%
        </span>
      </td>
    </tr>
  );
}
