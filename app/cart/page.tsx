import type { Metadata } from "next"
import { Cart } from "@/components/cart"

export const metadata: Metadata = {
  title: "Cart | smileybrooms",
  description: "View and manage your cart items",
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review your items and proceed to checkout</p>
        </div>
        <Cart isOpen={true} embedded={true} />
      </div>
    </div>
  )
}
