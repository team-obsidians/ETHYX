// c:\Obsidian\Ethyx\frontend\components\landing\DemoReportPreview.tsx
"use client"

import { motion } from "framer-motion"
import { cardReveal } from "@/lib/animations"
import { SectionLabel } from "@/components/shared/SectionLabel"
import { GlassCard } from "@/components/shared/GlassCard"
import { Badge } from "@/components/ui/badge"

const ROWS = [
  { metric: "Disparate Impact", value: "0.74", threshold: "0.80", pass: false },
  { metric: "Statistical Parity", value: "-0.24", threshold: "±0.05", pass: false },
  { metric: "Equal Opportunity", value: "-0.18", threshold: "±0.05", pass: false },
  { metric: "Calibration", value: "0.92", threshold: ">0.90", pass: true },
] as const

export function DemoReportPreview() {
  return (
    <section id="demo" className="py-20 px-6 max-w-screen-2xl mx-auto">
      <SectionLabel>DEMO REPORT</SectionLabel>
      <h2 className="font-orbitron font-black text-3xl md:text-4xl mb-12 tracking-wide">
        See a Real Audit Report
      </h2>
      <motion.div variants={cardReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto">
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-danger" /><div className="w-3 h-3 rounded-full bg-warning" /><div className="w-3 h-3 rounded-full bg-surface" /></div>
              <span className="font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-warning">MEDIUM FAIRNESS RISK</span>
            </div>
            <Badge variant="warning">Score: 67</Badge>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-default">
              <th className="text-left py-2 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted font-medium">Metric</th>
              <th className="text-right py-2 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted font-medium">Value</th>
              <th className="text-right py-2 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted font-medium">Threshold</th>
              <th className="text-right py-2 font-dm-mono text-[10px] uppercase tracking-widest text-text-muted font-medium">Result</th>
            </tr></thead>
            <tbody>{ROWS.map((r) => (
              <tr key={r.metric} className="border-b border-border-subtle last:border-0">
                <td className="py-3 font-dm-sans text-text-primary">{r.metric}</td>
                <td className="py-3 text-right font-dm-mono tabular-nums text-text-primary">{r.value}</td>
                <td className="py-3 text-right font-dm-mono tabular-nums text-text-muted">{r.threshold}</td>
                <td className="py-3 text-right"><Badge variant={r.pass ? "success" : "danger"}>{r.pass ? "PASS" : "FAIL"}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
        </GlassCard>
      </motion.div>
    </section>
  )
}
