"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { createCheckoutSession } from "@/lib/actions"

export function SalesCheckoutButton() {
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Separate regular items from custom cleaning items
      const regularItems = cart.items.filter(
        (item) => item.priceId !== "price_custom_cleaning" && item.priceId !== "price_custom_service",
      )
      const customItems = cart.items.filter(
        (item) => item.priceId === "price_custom_cleaning" || item.priceId === "price_custom_service",
      )

      // Create line items for regular products
      const lineItems = regularItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      }))

      // Create custom line items for custom cleaning services
      const customLineItems = customItems.map((item) => ({
        name: item.name,
        amount: Math.round(item.price * 100) / 100, // Ensure proper decimal handling
        quantity: item.quantity,
        metadata: {
          ...item.metadata,
        },
      }))

      // Get customer data from the first custom item with customer metadata
      const customerItem = customItems.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      const checkoutUrl = await createCheckoutSession({
        lineItems,
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerData?.email,
        customerData: customerData
          ? {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address,
                city: customerData?.city || "",
                state: customerData?.state || "",
                postal_code: customerData?.zipCode || "",
                country: "US",
              },
            }
          : undefined,
        isRecurring: false,
      })

      if (checkoutUrl) {
        setIsComplete(true)

        // Show success animation before redirecting
        setTimeout(() => {
          window.location.href = checkoutUrl
        }, 1000)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span className="font-medium">{formatCurrency(cart.totalPrice * 0.08)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(cart.totalPrice * 1.08)}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={isLoading || isComplete || cart.items.length === 0}
        className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white relative overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-green-500"
            >
              <Check className="h-6 w-6 text-white" />
            </motion.div>
          )}

          {!isLoading && !isComplete && (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>Checkout Now</span>
              <motion.div
                className="absolute right-4"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </Button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Secure checkout powered by Stripe</p>
        <div className="flex justify-center mt-2 space-x-2">
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}
