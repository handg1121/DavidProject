import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { AuthSection } from "./components/auth-section"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950">
      {/* Decorative gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-b from-sky-400/40 to-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-fuchsia-400/30 to-pink-400/20 blur-3xl" />
      </div>

      <Header />
      <main>
        <HeroSection />
        <AuthSection />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
