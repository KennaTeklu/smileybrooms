"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Trash2, Minus, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CollapsibleCartPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, totalItems, totalPrice, removeItem, updateItemQuantity } = useCart()

  const togglePanel = () => setIsOpen(!isOpen)

  // Close panel if ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-40 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
        onClick={togglePanel}
        aria-label={isOpen ? "Close cart" : "Open cart"}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-4 right-4 z-50 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border bg-background shadow-lg sm:max-w-md",
              "border-purple-200 bg-purple-50/50 backdrop-blur-md dark:border-purple-800 dark:bg-purple-950/50",
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="cart-panel-title" className="text-xl font-bold text-purple-800 dark:text-purple-200">
                Your Cart ({totalItems})
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close cart panel">
                <X className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </Button>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />

            <ScrollArea className="flex-1 p-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-gray-500 dark:text-gray-400">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-md bg-purple-100/50 p-3 dark:bg-purple-900/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-purple-900 dark:text-purple-100">{item.name}</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-purple-300 text-purple-600 hover:bg-purple-200 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-800 bg-transparent"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-purple-900 dark:text-purple-100">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-purple-300 text-purple-600 hover:bg-purple-200 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-800 bg-transparent"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-500 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="bg-purple-200 dark:bg-purple-800" />
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between text-lg font-bold text-purple-900 dark:text-purple-100">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/cart" passHref>
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700" onClick={togglePanel}>
                  View Full Cart <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
