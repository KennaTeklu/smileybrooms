import { PriceCalculator } from "@/components/price-calculator"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { CallToAction } from "@/components/call-to-action"
import { HowItWorks } from "@/components/how-it-works"
import { MinimalHero } from "@/components/minimal-hero"
import { PricingContent } from "@/components/pricing-content"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MinimalHero
        title="Flexible Pricing for Every Home"
        description="Get an instant quote for your custom cleaning plan or choose from our popular packages."
      />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <PricingContent />
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <PriceCalculator />
          </div>
        </section>
        <HowItWorks />
        <Features />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  )
}
