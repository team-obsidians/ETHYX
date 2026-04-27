// c:\Obsidian\Ethyx\frontend\components\landing\ProblemSection.tsx
"use client"

import { motion } from "framer-motion"
import { AlertTriangle, HeartPulse, Scale } from "lucide-react"
import { stagger, cardReveal } from "@/lib/animations"
import { SectionLabel } from "@/components/shared/SectionLabel"

const PROBLEMS = [
  { icon: AlertTriangle, title: "Historical Discrimination", text: "AI models trained on biased data repeat and amplify past inequalities at scale." },
  { icon: Scale, title: "High-Stakes Decisions", text: "Hiring, lending, and insurance algorithms need fairness checks before deployment." },
  { icon: HeartPulse, title: "Healthcare & Safety", text: "Biased diagnostic models can deny care to entire populations without anyone noticing." },
] as const

export function ProblemSection() {
  return (
    <section className="py-20 px-6 max-w-screen-2xl mx-auto">
      <SectionLabel>THE PROBLEM</SectionLabel>
      <h2 className="font-orbitron font-black text-3xl md:text-4xl mb-4 tracking-wide">AI bias is invisible — until it harms someone</h2>
      <p className="font-dm-sans text-text-secondary mb-12 max-w-2xl">ETHYX flags hidden bias before your model ever reaches production.</p>
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROBLEMS.map((p) => (
          <motion.div key={p.title} variants={cardReveal} className="glass p-6">
            <p.icon className="h-7 w-7 text-warning mb-4" />
            <h3 className="font-dm-sans text-lg font-bold mb-2">{p.title}</h3>
            <p className="font-dm-sans text-sm text-text-secondary leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
