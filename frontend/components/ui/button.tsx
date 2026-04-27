// c:\Obsidian\Ethyx\frontend\components\ui\button.tsx
// ETHYX AI — Button component (shadcn pattern, dark teal theme)

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-btn text-sm font-medium font-dm-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-teal text-[#003739] hover:bg-teal-dark active:scale-[0.98] shadow-teal-glow",
        ghost:
          "border border-teal/40 text-text-primary hover:bg-teal/5 hover:border-teal/60 active:scale-[0.98]",
        outline:
          "border border-border-default text-text-secondary hover:bg-teal/5 hover:text-text-primary hover:border-teal/30",
        destructive:
          "bg-danger text-text-primary hover:bg-danger/90 active:scale-[0.98]",
        link:
          "text-teal underline-offset-4 hover:underline",
        secondary:
          "bg-surface text-text-secondary hover:bg-input hover:text-text-primary border border-border-default",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-btn px-3 text-xs",
        lg: "h-12 rounded-btn px-8 text-base font-bold",
        xl: "h-14 rounded-btn px-10 text-lg font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
