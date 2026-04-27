// c:\Obsidian\Ethyx\frontend\components\landing\FeatureCards.tsx
// ETHYX AI — Landing page feature cards grid

"use client"

import { motion } from "framer-motion"
import {
  ScanSearch,
  BarChart3,
  Users,
  Lightbulb,
  Shield,
  FileText,
} from "lucide-react"

import { stagger, cardReveal, hoverGlow } from "@/lib/animations"
import { SectionLabel } from "@/components/shared/SectionLabel"

const FEATURES = [
  {
    icon: ScanSearch,
    label: "DATASET BIAS SCAN",
    description: "Upload any tabular dataset and detect statistical imbalances across protected attributes like gender, race, and age.",
  },
  {
    icon: BarChart3,
    label: "FAIRNESS METRICS",
    description: "Compute Disparate Impact, Statistical Parity, Equal Opportunity, and Calibration with one click.",
  },
  {
    icon: Users,
    label: "GROUP IMPACT COMPARISON",
    description: "Visualize how model outcomes differ across demographic subgroups with interactive charts.",
  },
  {
    icon: Lightbulb,
    label: "EXPLAINABLE DECISIONS",
    description: "AI-powered plain-English explanations of why each metric passed or failed and what it means.",
  },
  {
    icon: Shield,
    label: "MITIGATION STRATEGY",
    description: "Receive actionable recommendations to rebalance training data or adjust model thresholds.",
  },
  {
    icon: FileText,
    label: "AUDIT REPORT EXPORT",
    description: "Generate a comprehensive PDF fairness report ready for compliance review and stakeholder sharing.",
  },
] as const

export function FeatureCards() {
  return (
    <section id="features" className="py-20 px-6 max-w-screen-2xl mx-auto">
      <SectionLabel>CORE CAPABILITIES</SectionLabel>
      <h2 className="font-orbitron font-black text-3xl md:text-4xl mb-12 tracking-wide">
        Everything you need to audit AI fairness
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.label}
            variants={cardReveal}
            whileHover={hoverGlow}
            className="glass p-6 group cursor-default"
          >
            <f.icon className="h-8 w-8 text-teal mb-4 group-hover:text-teal-light transition-colors" />
            <h3 className="font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-teal-light mb-2">
              {f.label}
            </h3>
            <p className="font-dm-sans text-sm text-text-secondary leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
