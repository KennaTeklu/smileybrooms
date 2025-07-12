import { Suspense } from "react"
import { PricingContent } from "@/components/pricing-content"
import { PricingFloatingElements } from "@/components/pricing-floating-elements"
import { FloatingCartSummary } from "@/components/floating-cart-summary" // Import FloatingCartSummary

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            Flexible Cleaning Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect cleaning service tailored to your needs. Get an instant quote and book online!
          </p>
        </div>

        <Suspense fallback={<div>Loading pricing options...</div>}>
          <PricingContent />
        </Suspense>
      </div>

      {/* Floating elements for cart and other actions */}
      <PricingFloatingElements />

      {/* Floating Cart Summary */}
      <FloatingCartSummary />
    </div>
  )
}
