"use client"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

interface CheckoutButtonProps {
  priceId?: string
  productName?: string
  productPrice?: number
  quantity?: number
  metadata?: Record<string, any>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  useCheckoutPage?: boolean // New prop to control behavior
  isRecurring?: boolean
  recurringInterval?: "day" | "week" | "month" | "year"
  paymentMethod?: "card" | "bank" | "wallet"
  customerData?: {
    name?: string
    email?: string
    phone?: string
    address?: {
      line1?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  shippingAddressCollection?: { allowed_countries: string[] }
  automaticTax?: { enabled: boolean }
  trialPeriodDays?: number
  cancelAtPeriodEnd?: boolean
  allowPromotions?: boolean
}

export function CheckoutButton({
  priceId,
  productName,
  productPrice,
  quantity = 1,
  metadata = {},
  className,
  variant = "default",
  size = "default",
  useCheckoutPage = true, // Default to using checkout page
  isRecurring = false,
  recurringInterval = "month",
  paymentMethod = "card",
  customerData,
  shippingAddressCollection,
  automaticTax,
  trialPeriodDays,
  cancelAtPeriodEnd,
  allowPromotions,
}: CheckoutButtonProps) {
  const { cart } = useCart()
  const hasItems = cart.items.length > 0

  return (
    <Button asChild disabled={!hasItems} className={className} variant={variant} size={size}>
      <Link href="/checkout">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Proceed to Checkout
      </Link>
    </Button>
  )
}

// Also provide default export for backward compatibility
export default CheckoutButton
