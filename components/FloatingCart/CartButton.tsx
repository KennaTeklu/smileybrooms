"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

export function CartButton() {
  const { cartItems, calculateTotal } = useCart()
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = calculateTotal()

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Button asChild className="relative px-6 py-3 rounded-full shadow-lg">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
          <span className="font-semibold">Cart</span>
          {totalItems > 0 && <span className="ml-2 text-sm">{formatCurrency(cartTotal)}</span>}
        </Link>
      </Button>
    </motion.div>
  )
}
