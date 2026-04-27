// c:\Obsidian\Ethyx\frontend\components\landing\MetricsExplainer.tsx
// ETHYX AI — Fairness metrics explanation section

"use client"

import { motion } from "framer-motion"

import { stagger, cardReveal, hoverGlow } from "@/lib/animations"
import { SectionLabel } from "@/components/shared/SectionLabel"

const FAIRNESS_METRICS = [
  {
    name: "Disparate Impact",
    formula: "P(Y=1|D=0) / P(Y=1|D=1)",
    threshold: "≥ 0.80",
    description: "Ratio of positive outcome rates between unprivileged and privileged groups. Below 0.80 signals adverse impact.",
  },
  {
    name: "Statistical Parity",
    formula: "P(Ŷ=1|D=0) - P(Ŷ=1|D=1)",
    threshold: "± 0.05",
    description: "Difference in selection rates. Measures whether the model selects at equal rates regardless of group membership.",
  },
  {
    name: "Equal Opportunity",
    formula: "TPR(D=0) - TPR(D=1)",
    threshold: "± 0.05",
    description: "Difference in true positive rates. Ensures qualified individuals have equal chance of positive prediction.",
  },
  {
    name: "Average Odds",
    formula: "½(ΔFPR + ΔTPR)",
    threshold: "± 0.05",
    description: "Average of FPR and TPR differences. A balanced measure of equalized odds across groups.",
  },
  {
    name: "Calibration",
    formula: "E[Y|Ŷ=p, D=d] ≈ p",
    threshold: "> 0.90",
    description: "Whether predicted probabilities match observed outcomes equally for each group. Key for risk scoring.",
  },
] as const

export function MetricsExplainer() {
  return (
    <section id="metrics" className="py-20 px-6 max-w-screen-2xl mx-auto">
      <SectionLabel>FAIRNESS METRICS</SectionLabel>
      <h2 className="font-orbitron font-black text-3xl md:text-4xl mb-4 tracking-wide">
        Five Pillars of Fair AI
      </h2>
      <p className="font-dm-sans text-text-secondary mb-12 max-w-2xl">
        ETHYX computes these industry-standard metrics on every audit to give you a complete picture of model fairness.
      </p>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {FAIRNESS_METRICS.map((m) => (
          <motion.div
            key={m.name}
            variants={cardReveal}
            whileHover={hoverGlow}
            className="glass p-5"
          >
            <h3 className="font-dm-sans text-base font-bold text-text-primary mb-1">{m.name}</h3>
            <p className="font-dm-mono text-[11px] text-teal-light mb-1 tracking-wide">{m.formula}</p>
            <p className="font-dm-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">
              Threshold: {m.threshold}
            </p>
            <p className="font-dm-sans text-sm text-text-secondary leading-relaxed">
              {m.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
