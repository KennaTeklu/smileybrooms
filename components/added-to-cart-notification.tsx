"use client"

import { useCart } from "@/lib/cart-context"
import { CheckCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function AddedToCartNotification() {
  const { lastAddedItem } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (lastAddedItem) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [lastAddedItem])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible || !lastAddedItem) {
    return null
  }

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">Added to cart!</p>
          <p className="text-sm opacity-90">{lastAddedItem.name}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
