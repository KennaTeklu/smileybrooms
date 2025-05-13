import { SalesHero } from "@/components/sales-hero"
import { ServiceShowcase } from "@/components/service-showcase"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { SalesCTA } from "@/components/sales-cta"
import { HowItWorks } from "@/components/how-it-works"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import { SalesFAQ } from "@/components/sales-faq"
import { PageViewTracker } from "@/components/page-view-tracker"

export default function Home() {
  return (
    <>
      <PageViewTracker pageName="home" />

      {/* Hero Section - Optimized for conversions */}
      <SalesHero />

      {/* How It Works - Simplified 3-step process */}
      <HowItWorks />

      {/* Service Showcase - Limited to top 3 services */}
      <ServiceShowcase />

      {/* Core Features - Value proposition */}
      <Features />

      {/* Social Proof - Curated testimonials */}
      <Testimonials />

      {/* FAQ - Address common objections */}
      <SalesFAQ />

      {/* Final CTA - Strong conversion push */}
      <SalesCTA />

      {/* Persistent Book Now Button - Always accessible */}
      <PersistentBookNowButton />
    </>
  )
}
