// c:\Obsidian\Ethyx\frontend\components\landing\HeroDashboardPreview.tsx
// ETHYX AI — Fake fairness dashboard card shown in the hero

import { GlassCard } from "@/components/shared/GlassCard"
import { Badge } from "@/components/ui/badge"

const METRICS = [
  { name: "Disparate Impact", value: "0.74", status: "FAIL" as const },
  { name: "Equal Opportunity", value: "-0.18", status: "FAIL" as const },
  { name: "Calibration", value: "0.92", status: "PASS" as const },
] as const

export function HeroDashboardPreview() {
  return (
    <GlassCard className="p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-dm-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">
            FAIRNESS RISK SCORE
          </p>
          <p className="font-dm-mono text-4xl font-bold text-warning tabular-nums">
            67
          </p>
        </div>
        <Badge variant="warning">MEDIUM RISK</Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal via-warning to-danger w-[67%] transition-all" />
        </div>
      </div>

      {/* Metric rows */}
      <div className="space-y-3">
        {METRICS.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
          >
            <span className="font-dm-sans text-sm text-text-secondary">{m.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-dm-mono text-sm text-text-primary tabular-nums">{m.value}</span>
              <Badge variant={m.status === "PASS" ? "success" : "danger"}>
                {m.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Animated pulse ring */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-teal/20 animate-pulse-glow" />
        <div className="absolute inset-3 rounded-full border border-teal/10 animate-pulse" />
        <div className="absolute inset-7 rounded-full bg-teal/20" />
      </div>
    </GlassCard>
  )
}
