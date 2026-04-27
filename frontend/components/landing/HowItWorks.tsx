// c:\Obsidian\Ethyx\frontend\components\landing\HowItWorks.tsx
// ETHYX AI — 4-step workflow pipeline section

"use client"

import { motion } from "framer-motion"
import { Upload, Settings, Play, FileCheck } from "lucide-react"

import { stagger, cardReveal } from "@/lib/animations"
import { SectionLabel } from "@/components/shared/SectionLabel"

const STEPS = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Dataset",
    description: "Upload your CSV or connect to your data warehouse. ETHYX supports datasets up to 500k rows.",
  },
  {
    icon: Settings,
    number: "02",
    title: "Map Attributes",
    description: "Select your target variable and protected attributes like gender, race, or age group.",
  },
  {
    icon: Play,
    number: "03",
    title: "Run Fairness Audit",
    description: "ETHYX computes five key fairness metrics and generates AI-powered explanations in seconds.",
  },
  {
    icon: FileCheck,
    number: "04",
    title: "Review & Mitigate",
    description: "Explore results, apply mitigation strategies, and export a compliance-ready audit report.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-surface/40">
      <div className="max-w-screen-2xl mx-auto px-6">
        <SectionLabel>WORKFLOW PIPELINE</SectionLabel>
        <h2 className="font-orbitron font-black text-3xl md:text-4xl mb-16 tracking-wide text-center">
          Four Steps to Fair AI
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div
            className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent -translate-y-1/2 hidden md:block"
            aria-hidden="true"
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={cardReveal}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-surface border-[3px] border-teal flex items-center justify-center mb-5 shadow-teal-glow">
                  <span className="font-dm-mono font-bold text-lg text-teal">{step.number}</span>
                </div>
                <step.icon className="h-5 w-5 text-teal-light mb-3" />
                <h3 className="font-dm-sans text-lg font-bold mb-2">{step.title}</h3>
                <p className="font-dm-sans text-sm text-text-secondary leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
