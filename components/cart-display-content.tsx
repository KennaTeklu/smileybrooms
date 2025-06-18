"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart-context"

interface CartDisplayContentProps {
  showHeader?: boolean
  showFooter?: boolean
  onCheckout?: () => void
  onContinueShopping?: () => void
  className?: string
}

// Animation variants for individual cart items
const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
}

export default function CartDisplayContent({
  showHeader = true,
  showFooter = true,
  onCheckout,
  onContinueShopping,
  className,
}: CartDisplayContentProps) {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  // Handle quantity changes
  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items.find((item) => item.id === itemId)
    if (currentItem) {
      updateQuantity(itemId, currentItem.quantity + change)
    }
  }

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  // Handle clear cart
  const handleClearCart = () => {
    clearCart()
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Add some cleaning services to get started</p>
        {onContinueShopping && (
          <Button onClick={onContinueShopping} variant="outline">
            Continue Shopping
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {cart.totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout // Enable layout animations for smooth reordering
                  className="group relative bg-card rounded-lg p-4 border hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    {/* Item image */}
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                      {item.sourceSection && <p className="text-xs text-muted-foreground mb-2">{item.sourceSection}</p>}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[2ch] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove button (appears on hover) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      {showFooter && cart.items.length > 0 && (
        <div className="border-t p-4 space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {onCheckout && (
              <Button onClick={onCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            )}
            <div className="flex gap-2">
              {onContinueShopping && (
                <Button onClick={onContinueShopping} variant="outline" className="flex-1">
                  Continue Shopping
                </Button>
              )}
              <Button onClick={handleClearCart} variant="ghost" size="sm" className="px-3">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
