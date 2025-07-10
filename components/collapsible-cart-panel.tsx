"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2, Plus, Minus, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { analyzeCartHealth, type CartHealthReport } from "@/lib/cart-health"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface CollapsibleCartPanelProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function CollapsibleCartPanel({ isOpen, setIsOpen }: CollapsibleCartPanelProps) {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cartHealth, setCartHealth] = useState<CartHealthReport | null>(null)
  const [couponInput, setCouponInput] = useState(cart.couponCode || "")

  useEffect(() => {
    if (cart.items.length > 0) {
      setCartHealth(analyzeCartHealth(cart.items))
    } else {
      setCartHealth(null)
    }
    setCouponInput(cart.couponCode || "")
  }, [cart.items, cart.couponCode])

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = currentItem.quantity + change
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity)
      } else {
        setItemToRemoveId(itemId)
        setItemToRemoveName(currentItem.name)
        setShowRemoveConfirm(true)
      }
    }
  }

  const confirmRemoveItem = () => {
    if (itemToRemoveId) {
      removeItem(itemToRemoveId)
      setShowRemoveConfirm(false)
      setItemToRemoveId(null)
      setItemToRemoveName(null)
    }
  }

  const cancelRemoveItem = () => {
    setShowRemoveConfirm(false)
    setItemToRemoveId(null)
    setItemToRemoveName(null)
  }

  const handleRemoveItemClick = (itemId: string, itemName: string) => {
    setItemToRemoveId(itemId)
    setItemToRemoveName(itemName)
    setShowRemoveConfirm(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim())
    } else {
      toast({
        title: "Coupon field is empty",
        description: "Please enter a coupon code.",
        variant: "warning",
      })
    }
  }

  const panelVariants = {
    hidden: { opacity: 0, x: "100%", scale: 0.8, originX: 1, originY: 1 },
    visible: { opacity: 1, x: "0%", scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: "100%", scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 right-40 z-50 w-full max-w-[90vw] sm:max-w-md h-[80vh] flex flex-col rounded-xl border bg-background shadow-lg"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
        >
          <Card className="flex flex-col flex-1 rounded-xl border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-blue-500" /> Your Cart ({cart.totalItems})
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close cart panel">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
                  <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4 opacity-70" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6 text-sm">Add services or products to get started!</p>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 max-h-[calc(80vh-200px)]">
                    <div className="space-y-4 p-4">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="group relative bg-card rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow flex gap-3 items-center"
                        >
                          {item.image && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base leading-tight mb-1 text-gray-900 dark:text-gray-100">
                              {item.name}
                            </h4>
                            {item.metadata?.roomConfig?.name && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Tier: {item.metadata.roomConfig.name}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-md p-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  aria-label={`Decrease quantity of ${item.name}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium min-w-[2ch] text-center text-gray-900 dark:text-gray-100">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  aria-label={`Increase quantity of ${item.name}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            onClick={() => handleRemoveItemClick(item.id, item.name)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal ({cart.totalItems} items)</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ${cart.subtotalPrice.toFixed(2)}
                        </span>
                      </div>
                      {cart.couponDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                          <span>Coupon ({cart.couponCode})</span>
                          <span>-${cart.couponDiscount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1"
                        aria-label="Coupon code input"
                      />
                      <Button onClick={handleApplyCoupon} disabled={!couponInput.trim() || cart.couponDiscount > 0}>
                        <Tag className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                      <Link href="/cart" onClick={() => setIsOpen(false)}>
                        View Full Cart
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Remove Item Confirmation Dialog */}
          <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove <span className="font-semibold">{itemToRemoveName}</span> from your
                  cart? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={cancelRemoveItem}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmRemoveItem}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Clear Cart Confirmation Dialog */}
          <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Cart Confirmation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear all items from your cart? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmClearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
