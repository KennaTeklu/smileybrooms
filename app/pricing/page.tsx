import { Suspense } from "react"
import { PriceCalculator } from "@/components/price-calculator"
import { PricingContent } from "@/components/pricing-content"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import FAQ from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import CallToAction from "@/components/call-to-action"
import { HowItWorks } from "@/components/how-it-works"
import { MinimalHero } from "@/components/minimal-hero"
import LoadingAnimation from "@/components/loading-animation"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <MinimalHero
        title="Flexible Pricing for Every Home"
        description="Choose the perfect cleaning plan that fits your needs and budget. Get an instant quote or customize your service."
      />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <Suspense fallback={<LoadingAnimation />}>
              <PriceCalculator />
            </Suspense>
          </div>
        </section>
        <PricingContent />
        <ServiceComparisonTable />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  )
}
