"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CheckoutForm } from "@/components/checkout-form"
import { CartSummary } from "@/components/cart-summary"
import { CartProvider } from "@/lib/cart-context"

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutPageContent />
    </CartProvider>
  )
}

function CheckoutPageContent() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push("/success")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
        <div>
          <CartSummary showCheckoutButton={false} />
        </div>
      </div>
    </div>
  )
}
