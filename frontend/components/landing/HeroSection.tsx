// c:\Obsidian\Ethyx\frontend\components\landing\HeroSection.tsx
// ETHYX AI — Landing page hero with dashboard preview card

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { pageEnter, cardReveal } from "@/lib/animations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroDashboardPreview } from "@/components/landing/HeroDashboardPreview"

export function HeroSection() {
  return (
    <header className="pt-28 pb-16 px-6 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-12 items-center">
        {/* Left — copy */}
        <motion.div
          variants={pageEnter}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          <Badge className="mb-6">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
            OBSIDIAN LENS / AI BIAS DETECTION PLATFORM
          </Badge>

          <h1 className="font-orbitron font-black text-4xl md:text-6xl leading-tight tracking-wide mb-4">
            Is your AI treating{" "}
            <span className="text-teal-light text-glow">everyone</span> fairly?
          </h1>

          <p className="text-lg text-text-secondary max-w-xl leading-relaxed mb-8 font-dm-sans">
            ETHYX AI helps teams inspect datasets and automated decisions for
            hidden unfairness before they affect real people.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Free Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href="#demo">View Demo Report</a>
            </Button>
          </div>
        </motion.div>

        {/* Right — dashboard preview */}
        <motion.div
          variants={cardReveal}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 bg-teal/10 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />
          <HeroDashboardPreview />
        </motion.div>
      </div>
    </header>
  )
}
