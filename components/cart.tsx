"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, ShoppingCart, ArrowRight, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import ErrorBoundary from "@/components/error-boundary"
import { useRouter } from "next/navigation"
import { ScrollAwareWrapper } from "@/components/scroll-aware-wrapper"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartProps {
  isOpen?: boolean
  onClose?: () => void
  embedded?: boolean
  children?: React.ReactNode
}

export function Cart({ isOpen, onClose, embedded = false, children }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate cart metrics
  const totalItems = cart.items?.length || 0
  const totalPrice = cart.totalPrice || 0
  const hasItems = totalItems > 0

  // Show cart when items are present
  useEffect(() => {
    if (hasItems && !isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasItems, isExpanded])

  // Highlight recently added items
  useEffect(() => {
    if (recentlyAdded) {
      const timer = setTimeout(() => {
        setRecentlyAdded(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [recentlyAdded])

  // Track scroll position only after mounting
  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMounted])

  const handleRemoveItem = useCallback(
    (id: string) => {
      removeItem(id)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
        duration: 3000,
      })
    },
    [removeItem],
  )

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      const validQuantity = Math.max(1, isNaN(quantity) ? 1 : Math.floor(quantity))
      updateQuantity(id, validQuantity)
    },
    [updateQuantity],
  )

  const handleClearCart = useCallback(() => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 3000,
    })
    setIsExpanded(false)
    setIsSheetOpen(false)
  }, [clearCart])

  const videoDiscountAmount = allowVideoRecording ? (totalPrice >= 250 ? 25 : totalPrice * 0.1) : 0

  const finalTotalPrice = totalPrice - videoDiscountAmount

  const handleCheckout = async () => {
    if (!hasItems) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    router.push("/checkout/address")
  }

  const toggleItemDetails = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleClose = () => {
    setIsExpanded(false)
    setIsSheetOpen(false)
    if (onClose) {
      onClose()
    }
  }

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  // If children are provided, render as a trigger for sheet
  if (children) {
    return (
      <ScrollAwareWrapper>
        <div onClick={() => setIsSheetOpen(true)}>{children}</div>

        {isSheetOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSheetOpen(false)}>
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl" onClick={handleCartClick}>
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Cart ({totalItems})</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsSheetOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <CartContent
                        cart={cart}
                        expandedItem={expandedItem}
                        toggleItemDetails={toggleItemDetails}
                        handleRemoveItem={handleRemoveItem}
                        handleUpdateQuantity={handleUpdateQuantity}
                        recentlyAdded={recentlyAdded}
                      />
                    </div>
                  </ScrollArea>
                </div>

                {/* Footer */}
                <div className="border-t p-4">
                  {hasItems && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold">{formatCurrency(finalTotalPrice)}</span>
                      </div>
                      <div className="space-y-2">
                        <Button onClick={handleCheckout} disabled={!hasItems || isCheckingOut} className="w-full">
                          {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                        </Button>
                        <Button variant="outline" onClick={handleClearCart} disabled={!hasItems} className="w-full">
                          Clear Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollAwareWrapper>
    )
  }

  // Embedded mode (for cart page)
  if (embedded) {
    return (
      <ErrorBoundary>
        <div className="max-w-2xl mx-auto">
          <ScrollArea className="h-[70vh] w-full">
            <div className="p-4">
              <CartContent
                cart={cart}
                expandedItem={expandedItem}
                toggleItemDetails={toggleItemDetails}
                handleRemoveItem={handleRemoveItem}
                handleUpdateQuantity={handleUpdateQuantity}
                recentlyAdded={recentlyAdded}
              />
            </div>
          </ScrollArea>

          {hasItems && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(finalTotalPrice)}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCheckout} disabled={!hasItems || isCheckingOut} className="flex-1" size="lg">
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <Button variant="outline" onClick={handleClearCart} disabled={!hasItems} size="lg">
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    )
  }

  // Calculate dynamic position that follows scroll more smoothly
  const dynamicTopPosition = isMounted ? Math.max(20, Math.min(scrollY * 0.1 + 100, window.innerHeight - 500)) : 100

  // Default floating cart implementation
  return (
    <ErrorBoundary>
      <ScrollAwareWrapper>
        <div
          ref={cartRef}
          className="fixed right-0 top-1/4 z-50"
          style={{
            top: `${dynamicTopPosition}px`,
            transform: isExpanded ? "translateX(0)" : "translateX(calc(100% - 60px))",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "auto",
          }}
          onClick={handleCartClick}
        >
          <div className="flex shadow-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpanded}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-lg flex flex-col items-center justify-center shadow-lg transition-all duration-200 relative"
              style={{ height: "120px", width: "60px" }}
            >
              <ShoppingCart className="h-6 w-6 mb-2" />
              <div className="rotate-90 text-xs font-bold whitespace-nowrap">{isExpanded ? "CLOSE" : "CART"}</div>
              {hasItems && (
                <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {totalItems}
                </div>
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden"
              style={{
                width: "380px",
                maxHeight: "calc(100vh - 100px)",
                minHeight: "400px",
              }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Your Cart</h2>
                      <p className="text-blue-100 text-sm">
                        {totalItems} item{totalItems !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <CartContent
                      cart={cart}
                      expandedItem={expandedItem}
                      toggleItemDetails={toggleItemDetails}
                      handleRemoveItem={handleRemoveItem}
                      handleUpdateQuantity={handleUpdateQuantity}
                      recentlyAdded={recentlyAdded}
                    />
                  </div>
                </ScrollArea>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 bg-white dark:bg-gray-900">
                {hasItems && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(finalTotalPrice)}</span>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isCheckingOut ? "Processing..." : "Checkout"}
                      </Button>
                      <Button variant="outline" onClick={handleClearCart} className="w-full text-sm">
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                )}

                {!hasItems && (
                  <div className="text-center py-4">
                    <ShoppingCart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Your cart is empty</p>
                    <Link href="/pricing" passHref>
                      <Button variant="default" onClick={handleClose} className="mt-2">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </ScrollAwareWrapper>
    </ErrorBoundary>
  )
}

// Helper component for cart content
function CartContent({
  cart,
  expandedItem,
  toggleItemDetails,
  handleRemoveItem,
  handleUpdateQuantity,
  recentlyAdded,
}: {
  cart: any
  expandedItem: string | null
  toggleItemDetails: (id: string) => void
  handleRemoveItem: (id: string) => void
  handleUpdateQuantity: (id: string, quantity: number) => void
  recentlyAdded: string | null
}) {
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
        <Link href="/pricing" passHref>
          <Button variant="default">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cart.items.map((item: any) => (
        <Card
          key={item.id}
          className={`flex flex-col p-3 transition-all duration-200 hover:shadow-md ${
            recentlyAdded === item.id ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
          }`}
        >
          <div className="flex items-center">
            {item.image && (
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border mr-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.name}</h3>
              <div className="flex items-center">
                <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                {item.metadata?.frequency && (
                  <Badge variant="outline" className="ml-1 text-xs px-1 py-0">
                    {item.metadata.frequency}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {item.metadata?.rooms && (
            <div className="w-full mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs p-0 justify-between"
                onClick={() => toggleItemDetails(item.id)}
              >
                <span>Room details</span>
                <ArrowRight className={`h-3 w-3 transition-transform ${expandedItem === item.id ? "rotate-90" : ""}`} />
              </Button>

              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <p className="font-medium">Rooms:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.isArray(item.metadata.rooms) ? (
                          item.metadata.rooms.map((room: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] px-1 py-0">
                              {room}
                            </Badge>
                          ))
                        ) : (
                          <span>{item.metadata.rooms}</span>
                        )}
                      </div>

                      {item.metadata?.serviceLevel && (
                        <p className="mt-1">
                          <span className="font-medium">Service level:</span> {item.metadata.serviceLevel}
                        </p>
                      )}

                      {item.metadata?.specialInstructions && (
                        <p className="mt-1">
                          <span className="font-medium">Notes:</span> {item.metadata.specialInstructions}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
