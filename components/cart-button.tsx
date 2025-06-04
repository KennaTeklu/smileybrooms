"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart"

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
        size="sm"
        className="relative flex items-center gap-2"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-4 w-4" />
        {showLabel && <span className="hidden sm:inline">Cart</span>}
        {cart.totalItems > 0 && (
          <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
            {cart.totalItems}
          </Badge>
        )}
      </Button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
