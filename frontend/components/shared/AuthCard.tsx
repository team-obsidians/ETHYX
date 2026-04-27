// c:\Obsidian\Ethyx\frontend\components\shared\AuthCard.tsx
// ETHYX AI — Auth page card wrapper with rotating conic-gradient border

"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { modalOpen } from "@/lib/animations"
import { EthyxLogo } from "@/components/shared/EthyxLogo"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  maxWidth?: string
}

export function AuthCard({ children, className, maxWidth = "max-w-[420px]" }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={modalOpen.initial}
        animate={modalOpen.animate}
        transition={modalOpen.transition}
        className={cn("w-full relative", maxWidth)}
      >
        {/* Rotating conic-gradient border effect */}
        <div className="absolute -inset-px rounded-[15px] overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 rotating-glow" />
        </div>

        {/* Inner card */}
        <div className={cn(
          "relative rounded-card bg-surface border border-border-default p-8",
          className
        )}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <EthyxLogo size="md" showSubtitle />
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  )
}
