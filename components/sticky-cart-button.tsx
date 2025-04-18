"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface StickyCartButtonProps {
  totalPrice: number
  isServiceAvailable: boolean
  onAddToCart: () => void
  visible: boolean
}

export default function StickyCartButton({
  totalPrice,
  isServiceAvailable,
  onAddToCart,
  visible,
}: StickyCartButtonProps) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const calculatorTop = document.querySelector(".calculator-container")?.getBoundingClientRect().top || 0
      setIsSticky(calculatorTop < 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-40 transition-transform duration-300 ease-in-out transform",
        isSticky ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="bg-white dark:bg-gray-900 border-b shadow-md py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Estimated Total:</p>
            <p className="text-xl font-bold">{formatCurrency(totalPrice)}</p>
          </div>
          <Button size="lg" onClick={onAddToCart} className="gap-2" disabled={!isServiceAvailable || totalPrice <= 0}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
