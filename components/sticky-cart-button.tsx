"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

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
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible &&
        (isDesktop ? (
          // Side floating button for desktop
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-6 top-1/3 transform -translate-y-1/2 z-50"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-primary">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-500">Total Price:</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
                <Button
                  onClick={onAddToCart}
                  disabled={!isServiceAvailable || totalPrice <= 0}
                  className="gap-2 w-full"
                  size="lg"
                  variant="default"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Bottom sticky button for mobile
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-16 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t shadow-lg"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Price:</p>
                <p className="text-xl font-bold">{formatCurrency(totalPrice)}</p>
              </div>
              <Button
                size="lg"
                onClick={onAddToCart}
                disabled={!isServiceAvailable || totalPrice <= 0}
                className="gap-2"
                variant="default"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        ))}
    </AnimatePresence>
  )
}
