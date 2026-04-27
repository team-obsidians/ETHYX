// c:\Obsidian\Ethyx\frontend\components\shared\MetricCard.tsx
// ETHYX AI — KPI metric display card
"use client";

import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/GlassCard"
import { motion } from "framer-motion"

interface MetricCardProps {
  label: string
  value: string
  helper?: string
  tone?: "teal" | "success" | "warning" | "danger"
}

const TONE_COLORS = {
  teal: "text-teal-light",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const

export function MetricCard({ label, value, helper, tone = "teal" }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <GlassCard className="p-4 h-full flex flex-col justify-between">
        <p className="font-dm-mono text-[9px] uppercase tracking-[0.18em] text-text-muted mb-1.5">
          {label}
        </p>
        <p className={cn("font-dm-mono text-[28px] font-medium tabular-nums leading-none", TONE_COLORS[tone])}>
          {value}
        </p>
        {helper && (
          <p className="font-dm-sans text-xs text-text-muted mt-1.5">
            {helper}
          </p>
        )}
      </GlassCard>
    </motion.div>
  )
}
