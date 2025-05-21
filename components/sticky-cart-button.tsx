"use client"

import type React from "react"
import { formatCurrency } from "@/lib/utils"

interface StickyCartButtonProps {
  totalPrice: number
  onCheckout: () => void
}

const StickyCartButton: React.FC<StickyCartButtonProps> = ({ totalPrice, onCheckout }) => {
  // Add error handling for price formatting
  const formattedPrice = (price: number) => {
    try {
      return formatCurrency(price)
    } catch (error) {
      console.error("Error formatting price:", error)
      return "$0.00" // Fallback value
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Update the price display to use the safe formatter */}
        <div className="text-lg font-bold">{formattedPrice(totalPrice)}</div>
        <button
          onClick={onCheckout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default StickyCartButton
