// c:\Obsidian\Ethyx\frontend\components\shared\SectionLabel.tsx
// ETHYX AI — Section label with Orbitron mini-heading and gradient line

import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <span className="font-orbitron text-[8.5px] font-bold tracking-[0.22em] uppercase text-teal whitespace-nowrap">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-teal/30 to-transparent" />
    </div>
  )
}
