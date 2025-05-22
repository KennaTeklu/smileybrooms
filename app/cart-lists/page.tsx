"use client"

import { EnhancedCartProvider } from "@/lib/enhanced-cart-context"
import { MultiListCart } from "@/components/multi-list-cart"

export default function CartListsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Lists</h1>
      <EnhancedCartProvider>
        <MultiListCart />
      </EnhancedCartProvider>
    </div>
  )
}
