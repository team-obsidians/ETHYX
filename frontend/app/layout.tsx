// c:\Obsidian\Ethyx\frontend\app\layout.tsx
// Root layout for ETHYX AI — Server Component by default

import type { Metadata, Viewport } from "next"
import { Orbitron, DM_Sans, DM_Mono } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ETHYX AI — AI Bias Detection & Fairness Auditing Platform",
  description:
    "Is your AI treating everyone fairly? ETHYX AI detects and mitigates bias in machine learning models with comprehensive fairness auditing.",
  keywords: [
    "AI bias detection",
    "fairness auditing",
    "ML fairness",
    "algorithmic bias",
    "responsible AI",
    "ETHYX AI",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "ETHYX AI — AI Bias Detection Platform",
    description: "Is your AI treating everyone fairly?",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#00ADB5",
  width: "device-width",
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${dmSans.variable} ${dmMono.variable} min-h-screen bg-bg-base font-dm-sans text-text-primary antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
