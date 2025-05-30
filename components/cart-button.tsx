"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { Cart } from "@/components/cart"

export function CartButton() {
  const { totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  if (totalItems === 0) {
    return null // Only display button if there are items in the cart
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsCartOpen(true)}
        aria-label={`View cart with ${totalItems} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {totalItems}
          </span>
        )}
      </Button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
