// c:\Obsidian\Ethyx\frontend\components\landing\StatsStrip.tsx
"use client"

import { motion } from "framer-motion"
import { stagger, cardReveal } from "@/lib/animations"

const STATS = [
  { value: "500", label: "Rows Analyzed" },
  { value: "4", label: "Fairness Checks" },
  { value: "3", label: "Risks Detected" },
  { value: "1", label: "Mitigation Plan" },
] as const

export function StatsStrip() {
  return (
    <section className="py-12 bg-surface/60">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <motion.div key={s.label} variants={cardReveal} className="text-center">
            <p className="font-dm-mono text-3xl font-bold text-teal-light mb-1 tabular-nums">{s.value}</p>
            <p className="font-dm-mono text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
