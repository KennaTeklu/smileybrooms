"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

interface CartButtonProps {
  showLabel?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null
}

export default function CartButton({
  showLabel = true,
  className,
  size = "default",
  variant = "default",
}: CartButtonProps) {
  const { cart } = useCart()
  const itemCount = cart.totalItems

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("relative", className)}
      aria-label={`View shopping cart with ${itemCount} items`}
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {showLabel && <span className="ml-2 hidden sm:inline">Cart</span>}
        {itemCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            aria-label={`${itemCount} items in cart`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
