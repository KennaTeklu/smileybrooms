"use client"

import type React from "react"

import { forwardRef } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

export interface CartButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Tailwind variant from buttonVariants (default / outline / ghost …)
   */
  variant?: Parameters<typeof buttonVariants>[0]["variant"]
  /**
   * Tailwind size from buttonVariants (icon / sm / lg …)
   */
  size?: Parameters<typeof buttonVariants>[0]["size"]
  /**
   * Show the word “Cart” next to the icon
   */
  showLabel?: boolean
}

const CartButton = forwardRef<HTMLAnchorElement, CartButtonProps>(
  ({ variant = "outline", size = "icon", className, showLabel = false, ...props }, ref) => {
    const { cart } = useCart()
    const itemCount = cart?.items?.length ?? 0

    return (
      <Link
        ref={ref}
        href="/cart"
        className={cn(buttonVariants({ variant, size }), "relative flex items-center justify-center", className)}
        {...props}
      >
        <ShoppingCart className={cn(size === "icon" ? "h-5 w-5" : "mr-2 h-5 w-5", "shrink-0")} aria-hidden="true" />
        {showLabel && <span className="whitespace-nowrap">Cart</span>}

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </Link>
    )
  },
)

CartButton.displayName = "CartButton"

export { CartButton }
export default CartButton
