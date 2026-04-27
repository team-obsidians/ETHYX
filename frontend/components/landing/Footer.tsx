// c:\Obsidian\Ethyx\frontend\components\landing\Footer.tsx
import Link from "next/link"
import { EthyxLogo } from "@/components/shared/EthyxLogo"

const FOOTER_LINKS = [
  { heading: "Product", links: [{ label: "Features", href: "#features" }, { label: "How It Works", href: "#how-it-works" }, { label: "Metrics", href: "#metrics" }, { label: "Demo", href: "#demo" }] },
  { heading: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#" }] },
  { heading: "Legal", links: [{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }, { label: "Cookie Policy", href: "#" }] },
] as const

export function Footer() {
  return (
    <footer className="bg-[#0e141c] pt-16 pb-8 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div><EthyxLogo size="sm" showSubtitle /><p className="font-dm-sans text-xs text-text-muted mt-3">AI Bias Detection Platform</p></div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h5 className="font-dm-sans text-sm font-bold text-text-primary mb-4">{col.heading}</h5>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}><Link href={l.href} className="font-dm-sans text-sm text-text-muted hover:text-teal-light transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border-subtle pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-dm-mono text-[10px] text-text-faint tracking-[0.15em] uppercase">© 2026 ETHYX AI QUANTUM AUDIT SYSTEMS</p>
          <div className="flex items-center gap-2 text-teal-light">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" /><span className="font-dm-mono text-[10px] tracking-widest">SYS_OPTIMAL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
