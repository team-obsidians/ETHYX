// c:\Obsidian\Ethyx\frontend\components\shared\BackgroundShell.tsx
// ETHYX AI — Page background wrapper with dot-grid and ambient glow

import { cn } from "@/lib/utils"

interface BackgroundShellProps {
  children: React.ReactNode
  className?: string
}

export function BackgroundShell({ children, className }: BackgroundShellProps) {
  return (
    <div className={cn("relative min-h-screen bg-bg-base overflow-hidden", className)}>
      {/* Dot grid pattern */}
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-100" aria-hidden="true" />

      {/* Ambient teal glow — top right */}
      <div
        className="pointer-events-none fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Secondary subtle glow — bottom left */}
      <div
        className="pointer-events-none fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-teal-dark/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
