"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import CartDisplayContent from "@/components/cart-display-content"

export default function CartPage() {
  const router = useRouter()
  const { cart } = useCart()

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    router.push("/pricing")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pricing"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
            <p className="text-xl text-muted-foreground">Review your selected services before checkout</p>
          </div>
        </div>

        {/* Cart Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CartDisplayContent
            onCheckout={handleCheckout}
            onContinueShopping={handleContinueShopping}
            className="min-h-[400px] flex flex-col"
          />
        </div>
      </div>
    </div>
  )
}
