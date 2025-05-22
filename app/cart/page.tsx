"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { CartSummary } from "@/components/cart-summary"
import { CartProvider } from "@/lib/cart-context"

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  )
}

function CartPageContent() {
  const { cart, getCartTotal, getItemCount } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    router.push("/checkout")
  }

  // Calculate values safely
  const itemCount = getItemCount()
  const subtotal = getCartTotal()
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" onClick={() => router.push("/pricing")}>
          <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
        </Button>
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any services to your cart yet.</p>
          <Button size="lg" onClick={() => router.push("/pricing")}>
            Browse Services
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CartSummary showCheckoutButton={false} />
          </div>
          <div>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({itemCount})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6 py-6 text-lg" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                Proceed to Checkout
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
