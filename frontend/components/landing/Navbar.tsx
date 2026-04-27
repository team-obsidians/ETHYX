// c:\Obsidian\Ethyx\frontend\components\landing\Navbar.tsx
// ETHYX AI — Landing page sticky navigation

"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { EthyxLogo } from "@/components/shared/EthyxLogo"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Metrics", href: "#metrics" },
  { label: "Demo", href: "#demo" },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg-base/85 backdrop-blur-nav border-b border-border-subtle">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-screen-2xl mx-auto">
        <Link href="/" aria-label="ETHYX AI Home">
          <EthyxLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-dm-sans text-sm text-text-secondary hover:text-teal-light transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Start Audit</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border-subtle px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block font-dm-sans text-sm text-text-secondary hover:text-teal-light transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/signup">Start Audit</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
