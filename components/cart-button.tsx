"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart" // Import the Cart panel component

export function CartButton() {
  const { totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleOpenCart = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  // Only display the button if there are items in the cart
  if (totalItems === 0) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={handleOpenCart}
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
        <span className="ml-2">Cart</span> {/* Added "Cart" text */}
      </Button>
      <Cart isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  )
}
