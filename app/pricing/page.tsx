"use client"

import PricingContent from "@/components/pricing-content"
import { CartProvider } from "@/lib/cart-context" // Import CartProvider

export default function PricingPage() {
  return (
    <CartProvider>
      {" "}
      {/* Wrap with CartProvider */}
      <PricingContent />
    </CartProvider>
  )
}
