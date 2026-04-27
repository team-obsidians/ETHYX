// c:\Obsidian\Ethyx\frontend\components\forms\AuthInput.tsx
// ETHYX AI — Styled auth form input

"use client"

import { useState } from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface AuthInputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: LucideIcon
  rightElement?: React.ReactNode
  id?: string
  autoComplete?: string
  required?: boolean
  error?: string
}

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  id,
  autoComplete,
  required = false,
  error,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword && showPassword ? "text" : type

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-dm-sans text-[11px] font-medium text-text-secondary tracking-wide"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className={cn(
            "w-full h-11 rounded-btn bg-input border border-border-base px-4 py-2 text-sm font-dm-sans text-text-primary placeholder:text-text-muted transition-all",
            "focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20",
            Icon && "pl-10",
            isPassword && "pr-10",
            error && "border-danger focus:border-danger focus:ring-danger/20"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        {rightElement && !isPassword && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-danger font-dm-sans">{error}</p>
      )}
    </div>
  )
}
