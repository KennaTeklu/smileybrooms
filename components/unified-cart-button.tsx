"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface UnifiedCartButtonProps {
  totalPrice: number
  isServiceAvailable: boolean
  onAddToCart: () => void
  className?: string
}

export function UnifiedCartButton({ totalPrice, isServiceAvailable, onAddToCart, className }: UnifiedCartButtonProps) {
  return (
    <Button
      onClick={onAddToCart}
      disabled={!isServiceAvailable || totalPrice === 0}
      className={cn(
        "w-full py-6 text-lg font-medium flex items-center justify-center gap-2",
        "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      <ShoppingCart className="h-5 w-5" />
      <span>Add to Cart - {formatCurrency(totalPrice)}</span>
    </Button>
  )
}
