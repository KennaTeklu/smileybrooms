"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

type AddedToCartNotificationProps = {
  isVisible: boolean
  itemName: string
  onClose: () => void
}

export function AddedToCartNotification({ isVisible, itemName, onClose }: AddedToCartNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center space-x-2 bg-green-600/90 backdrop-blur-sm text-white py-2 px-4 rounded-full shadow-lg border border-white/10">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{itemName} added to cart</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
