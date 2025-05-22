import EnhancedCart from "@/components/enhanced-cart"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout - SmileBrooms",
  description: "Complete your cleaning service order",
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <EnhancedCart />
    </div>
  )
}
