import CartClientPage from "./CartClientPage"
import type { Metadata } from "next" // Add this import

export const metadata: Metadata = {
  title: "Your Shopping Cart - SmileyBrooms",
  description: "Review and manage the cleaning services and products in your cart.",
}

export default function CartPage() {
  return <CartClientPage />
}
