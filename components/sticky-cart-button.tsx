"use client"

import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface StickyCartButtonProps {
  className?: string
  visible?: boolean
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Define the component
const StickyCartButton = ({ className, visible = true }: StickyCartButtonProps) => {
  const { cart } = useCart()
  const router = useRouter()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setShowButton(visible && cart.totalPrice > 0)
  }, [visible, cart.totalPrice])

  const handleViewCart = () => {
    router.push("/cart")
  }

  return (
    showButton && (
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          "bg-white dark:bg-gray-900 rounded-full shadow-lg hover:shadow-xl",
          className,
        )}
      >
        <Button variant="outline" size="icon" onClick={handleViewCart} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </div>
    )
  )
}

export default StickyCartButton
