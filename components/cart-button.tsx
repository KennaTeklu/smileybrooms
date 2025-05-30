"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart" // Import the main Cart component

interface CartButtonProps {
  showLabel?: boolean
}

export default function CartButton({ showLabel = false }: CartButtonProps) {
  const { cart } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {cart.totalItems}
          </span>
        )}
        {showLabel && <span className="ml-2">Cart</span>}
      </Button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
