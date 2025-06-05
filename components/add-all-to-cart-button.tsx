"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart, type CartItem } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useCallback } from "react"

export default function AddAllToCartButton() {
  const { addItem } = useCart()
  const { toast } = useToast()

  // Define a static list of items to add for "Add All to Cart"
  // In a real application, this would come from a database or API
  const allAvailableItems: Omit<CartItem, "quantity">[] = [
    {
      id: "basic-cleaning-service",
      name: "Basic Cleaning Service",
      price: 99.99,
      priceId: "price_basic_cleaning",
      image: "/placeholder.svg?height=48&width=48",
      sourceSection: "pricing",
      metadata: { type: "standard" },
      paymentFrequency: "per_service",
    },
    {
      id: "deep-cleaning-addon",
      name: "Deep Cleaning Add-on",
      price: 49.99,
      priceId: "price_deep_cleaning",
      image: "/placeholder.svg?height=48&width=48",
      sourceSection: "pricing",
      metadata: { type: "addon" },
      paymentFrequency: "per_service",
    },
    {
      id: "window-cleaning-addon",
      name: "Window Cleaning Add-on",
      price: 29.99,
      priceId: "price_window_cleaning",
      image: "/placeholder.svg?height=48&width=48",
      sourceSection: "pricing",
      metadata: { type: "addon" },
      paymentFrequency: "per_service",
    },
  ]

  const handleAddAllToCart = useCallback(() => {
    allAvailableItems.forEach((item) => {
      addItem(item)
    })

    toast({
      title: "All items added!",
      description: "All available services have been added to your cart.",
      duration: 3000,
    })
  }, [addItem, toast, allAvailableItems])

  return (
    <Button
      variant="secondary" // Use a distinct variant
      size="sm"
      onClick={handleAddAllToCart}
      className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
      aria-label="Add all available services to cart"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden lg:inline">Add All to Cart</span>
    </Button>
  )
}
