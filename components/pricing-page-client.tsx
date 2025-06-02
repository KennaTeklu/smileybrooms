"use client"
import Header from "@/components/header"
import PricingContent from "@/components/pricing-content"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import AccessibilityToolbar from "@/components/accessibility-toolbar"

export default function PricingPageClient() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Ensure header is visible */}
      <Header />

      {/* Main content */}
      <main className="pt-16">
        {" "}
        {/* Add padding-top to account for fixed header */}
        <PricingContent />
      </main>

      {/* Floating elements */}
      <FloatingCartButton />
      <PersistentBookNowButton />
      <AccessibilityToolbar />
    </div>
  )
}
