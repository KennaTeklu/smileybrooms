"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function CartButton() {
  const { cartItems } = useCart()
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/cart" aria-label={`View cart with ${itemCount} items`}>
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
