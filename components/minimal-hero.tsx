"use client"

import { Button } from "@/components/ui/button"
import { Cart } from "@/components/cart"
import { useCart } from "@/lib/cart-context" // Import useCart
import { useState, useEffect } from "react"
import { useShoppingCart } from "use-shopping-cart"

export function MinimalHero() {
  const { cart } = useCart() // Use the cart context
  const { cartCount, cartDetails } = useShoppingCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    // You can add any logic here that needs to run when the component mounts
  }, [])

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const hasItemsInCart = cartCount > 0

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Experience the Future of Clean
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-50 md:text-xl">
              Seamlessly manage your cleaning services with our intuitive platform.
            </p>
          </div>
          <div className="space-x-4">
            <Button
              className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Learn More
            </Button>
            {cart.totalItems > 0 && <Cart />} {/* Conditionally render Cart */}
          </div>
        </div>
      </div>
    </section>
  )
}
