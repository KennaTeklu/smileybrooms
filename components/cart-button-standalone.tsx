"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { Cart } from "./cart"

export function CartButtonStandalone() {
  const { cart } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <Button variant="outline" className="relative flex items-center gap-2" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart className="h-5 w-5" />
        <span className="hidden sm:inline">Cart</span>
        {cart.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {cart.totalItems}
          </span>
        )}
      </Button>

      {/* This will render the cart sheet when isCartOpen is true */}
      {isCartOpen && <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />}
    </>
  )
}
