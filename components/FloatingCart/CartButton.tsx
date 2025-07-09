"use client"
export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAnalytics } from "@/hooks/use-analytics"
import { useFeatureFlag } from "@/hooks/use-feature-flag" // Import the new hook

interface CartButtonProps {
  onClick: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { cartItems } = useCart()
  const { trackButtonClick } = useAnalytics()
  const { isEnabled: isNewCartExperienceEnabled } = useFeatureFlag("newCartExperience") // Use the feature flag

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleClick = () => {
    trackButtonClick("Cart Button Click", {
      location: "Floating Cart",
      totalItemsInCart: totalItems,
    })
    onClick()
  }

  // Conditionally render the button based on the feature flag
  if (!isNewCartExperienceEnabled) {
    return null // Don't render the button if the feature is disabled
  }

  return (
    <Button
      variant="default"
      size="lg"
      className="relative rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105"
      onClick={handleClick}
      aria-label={`View cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
