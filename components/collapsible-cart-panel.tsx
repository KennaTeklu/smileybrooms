"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Trash2, Minus, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"

export function CollapsibleCartPanel() {
  const { cart, removeItem, updateQuantity, clearCart, applyCoupon } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [couponInput, setCouponInput] = useState("")

  const togglePanel = () => setIsOpen(!isOpen)

  // Close panel if cart becomes empty
  useEffect(() => {
    if (cart.totalItems === 0 && isOpen) {
      setIsOpen(false)
    }
  }, [cart.totalItems, isOpen])

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50, x: 50, transition: { duration: 0.2 } },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-40 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={togglePanel}
        aria-label={isOpen ? "Close cart" : "Open cart"}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {cart.totalItems}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-40 z-40 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border border-purple-200 bg-background shadow-lg sm:max-w-md"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="cart-panel-title" className="text-xl font-semibold">
                Your Cart ({cart.totalItems})
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close cart panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator />

            {cart.items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-4 text-muted-foreground">
                Your cart is empty.
              </div>
            ) : (
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {item.image && (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <Separator />
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">${cart.subtotalPrice.toFixed(2)}</span>
              </div>
              {cart.couponCode && (
                <div className="mb-2 flex items-center justify-between text-sm text-green-600">
                  <span>Coupon ({cart.couponCode}):</span>
                  <span className="font-medium">-${cart.couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="Coupon Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1"
                  aria-label="Enter coupon code"
                />
                <Button onClick={() => applyCoupon(couponInput)} disabled={!couponInput.trim()}>
                  Apply
                </Button>
              </div>
              <Button onClick={clearCart} variant="outline" className="mb-4 w-full bg-transparent">
                Clear Cart
              </Button>
              <Link href="/cart" passHref>
                <Button className="w-full" onClick={togglePanel}>
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
