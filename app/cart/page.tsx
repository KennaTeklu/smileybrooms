import type { Metadata } from "next"
import { Cart } from "@/components/cart"

export const metadata: Metadata = {
  title: "Cart | smileybrooms",
  description: "View and manage your cart items",
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <Cart isOpen={true} embedded={true} />
    </div>
  )
}
