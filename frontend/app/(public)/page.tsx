// c:\Obsidian\Ethyx\frontend\app\(public)\page.tsx
// ETHYX AI — Landing Page (root "/")

import { BackgroundShell } from "@/components/shared/BackgroundShell"
import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsStrip } from "@/components/landing/StatsStrip"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { FeatureCards } from "@/components/landing/FeatureCards"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { MetricsExplainer } from "@/components/landing/MetricsExplainer"
import { DemoReportPreview } from "@/components/landing/DemoReportPreview"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <BackgroundShell>
      <Navbar />
      <main>
        <HeroSection />
        <StatsStrip />
        <ProblemSection />
        <FeatureCards />
        <HowItWorks />
        <MetricsExplainer />
        <DemoReportPreview />
        <FinalCTA />
      </main>
      <Footer />
    </BackgroundShell>
  )
}
