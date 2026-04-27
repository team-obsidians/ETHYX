// c:\Obsidian\Ethyx\frontend\components\ui\badge.tsx
// ETHYX AI — Badge component (shadcn pattern)

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-badge border px-2.5 py-0.5 text-xs font-dm-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-teal/20 bg-teal/10 text-teal-light",
        success:
          "border-success/20 bg-success/10 text-success",
        warning:
          "border-warning/20 bg-warning/10 text-warning",
        danger:
          "border-danger/20 bg-danger/10 text-danger",
        outline:
          "border-border-default text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
