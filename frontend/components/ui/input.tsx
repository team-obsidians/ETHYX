// c:\Obsidian\Ethyx\frontend\components\ui\input.tsx
// ETHYX AI — Input component (shadcn pattern, dark theme)

import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional className override */
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-btn border border-border-base bg-input px-4 py-2 text-sm font-dm-sans text-text-primary placeholder:text-text-muted transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
