"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

export function CartButton() {
  const { cart } = useCart()
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      aria-label={`Shopping cart with ${cart.totalItems} items`}
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart className="h-5 w-5" />
      {cart.totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
          {cart.totalItems}
        </span>
      )}
    </Button>
  )
}
