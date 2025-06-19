import { PricingContent } from "@/components/pricing-content"
import { CartProvider } from "@/lib/cart-context"

export default function Pricing() {
  return (
    <CartProvider>
      <PricingContent />
    </CartProvider>
  )
}
