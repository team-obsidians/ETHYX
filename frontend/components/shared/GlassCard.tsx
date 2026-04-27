// c:\Obsidian\Ethyx\frontend\components\shared\GlassCard.tsx
// ETHYX AI — Glassmorphism card wrapper

"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { hoverGlow } from "@/lib/animations"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export function GlassCard({ children, className, hoverable = false }: GlassCardProps) {
  if (hoverable) {
    return (
      <motion.div
        className={cn("glass p-5", className)}
        whileHover={hoverGlow}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn("glass p-5", className)}>
      {children}
    </div>
  )
}
