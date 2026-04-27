// c:\Obsidian\Ethyx\frontend\components\shared\EthyxLogo.tsx
// ETHYX AI — Logo component with teal shield mark

import { cn } from "@/lib/utils"

interface EthyxLogoProps {
  size?: "sm" | "md" | "lg"
  showSubtitle?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { text: "text-lg", icon: 16, subtitle: "text-[7px]" },
  md: { text: "text-2xl", icon: 20, subtitle: "text-[8px]" },
  lg: { text: "text-3xl", icon: 26, subtitle: "text-[9px]" },
} as const

export function EthyxLogo({ size = "md", showSubtitle = false, className }: EthyxLogoProps) {
  const s = SIZE_MAP[size]

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
          fill="rgba(0,173,181,0.15)"
          stroke="#00ADB5"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="#00ADB5" />
        <circle cx="12" cy="12" r="5" stroke="#55d8e1" strokeWidth="0.5" opacity="0.6" />
      </svg>
      <div className="flex flex-col">
        <span className={cn("font-orbitron font-black tracking-tight text-teal-light", s.text)}>
          ETHYX AI
        </span>
        {showSubtitle && (
          <span className={cn("font-orbitron font-bold tracking-[0.2em] uppercase text-text-muted", s.subtitle)}>
            OBSIDIAN LENS
          </span>
        )}
      </div>
    </div>
  )
}
