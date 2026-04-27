// c:\Obsidian\Ethyx\frontend\components\landing\FinalCTA.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { pageEnter } from "@/lib/animations"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-teal/5 blur-[120px] pointer-events-none" aria-hidden="true" />
      <motion.div variants={pageEnter} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wide">Build fairer AI before launch.</h2>
        <p className="font-dm-sans text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
          Join the teams using ETHYX AI to ship responsible machine learning models with confidence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" asChild><Link href="/signup">Create Account</Link></Button>
          <Button variant="ghost" size="xl" asChild><Link href="/login">Sign In</Link></Button>
        </div>
      </motion.div>
    </section>
  )
}
