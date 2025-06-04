"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, ShoppingCart, Video, Info, ArrowRight, X, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import { loadStripe } from "@stripe/stripe-js"
import ErrorBoundary from "@/components/error-boundary"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Advanced item matching function
const advancedMatchCriteria = (existingItem: any, newItem: any) => {
  // Match by ID and SKU if available
  if (existingItem.id === newItem.id && existingItem.sku === newItem.sku) {
    return true
  }

  // Match by service signature for custom cleaning services
  if (
    existingItem.priceId === "price_custom_cleaning" &&
    newItem.priceId === "price_custom_cleaning" &&
    existingItem.metadata?.serviceSignature === newItem.metadata?.serviceSignature
  ) {
    return true
  }

  // Match by room configuration
  if (
    existingItem.metadata?.rooms &&
    newItem.metadata?.rooms &&
    JSON.stringify(existingItem.metadata.rooms.sort()) === JSON.stringify(newItem.metadata.rooms.sort())
  ) {
    return true
  }

  return false
}

interface CartProps {
  isOpen: boolean
  onClose?: () => void
  embedded?: boolean
}

// Hook to prevent body scrolling when panel is open
const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return

    // Save initial body style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Lock scrolling
    document.body.style.overflow = "hidden"

    // Restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isLocked])
}

export function Cart({ isOpen, onClose, embedded = false }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customerAddressData, setCustomerAddressData] = useState<AddressData | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when panel is open
  useLockBodyScroll(isOpen && !embedded)

  // Restore scroll position
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const savedPosition = localStorage.getItem("cart-scroll-position")
      if (savedPosition) {
        contentRef.current.scrollTop = Number.parseInt(savedPosition, 10)
      }
    }

    return () => {
      if (contentRef.current) {
        localStorage.setItem("cart-scroll-position", contentRef.current.scrollTop.toString())
      }
    }
  }, [isOpen])

  // Check for previously saved video recording consent
  useEffect(() => {
    if (customerAddressData) {
      const fullAddress = `${customerAddressData.address}, ${customerAddressData.city || ""}, ${customerAddressData.state || ""} ${customerAddressData.zipCode || ""}`
      const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`
      const savedConsent = localStorage.getItem(addressKey)
      if (savedConsent === "permanent") {
        setAllowVideoRecording(true)
      }
    }
  }, [customerAddressData])

  // Highlight recently added items
  useEffect(() => {
    if (recentlyAdded) {
      const timer = setTimeout(() => {
        setRecentlyAdded(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [recentlyAdded])

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
  }, [clearCart])

  const videoDiscountAmount = useMemo(() => {
    if (allowVideoRecording) {
      if (cart.totalPrice >= 250) {
        return 25 // $25 discount for orders $250 or more
      } else {
        return cart.totalPrice * 0.1 // 10% discount for orders under $250
      }
    }
    return 0
  }, [allowVideoRecording, cart.totalPrice])

  const finalTotalPrice = useMemo(() => cart.totalPrice - videoDiscountAmount, [cart.totalPrice, videoDiscountAmount])

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // If no address data, open the address collection modal
    if (!customerAddressData) {
      setShowAddressModal(true)
      return
    }

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Validate cart items
      const invalidItems = cart.items.filter(
        (item) => !item.id || !item.name || typeof item.price !== "number" || item.price <= 0,
      )

      if (invalidItems.length > 0) {
        throw new Error("Some items in your cart are invalid. Please try removing and adding them again.")
      }

      // Prepare line items for Stripe
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.metadata?.description || `Service: ${item.name}`,
            images: item.image ? [item.image] : [],
            metadata: {
              itemId: item.id,
              priceId: item.priceId,
              ...item.metadata,
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }))

      // Add video discount if applicable
      if (videoDiscountAmount > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Video Recording Discount",
              description: "Discount for allowing video recording during service",
            },
            unit_amount: -Math.round(videoDiscountAmount * 100), // Negative amount for discount
          },
          quantity: 1,
        })
      }

      // Generate cart ID with timestamp and random string for idempotency
      const cartId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": cartId, // Prevent duplicate charges
        },
        body: JSON.stringify({
          lineItems,
          customerData: customerAddressData,
          allowVideoRecording,
          cartId,
          metadata: {
            cartTotal: cart.totalPrice,
            discountAmount: videoDiscountAmount,
            finalTotal: finalTotalPrice,
            itemCount: cart.items.length,
            orderDate: new Date().toISOString(),
            deviceInfo: navigator.userAgent,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout. Please try again or call us for assistance.",
      )
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleAddressSubmit = (data: AddressData) => {
    setCustomerAddressData(data)
    setShowAddressModal(false)
    // Automatically trigger checkout after address is submitted
    handleCheckout()
  }

  const toggleItemDetails = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Modern sticky cart panel
  if (embedded) {
    return (
      <ErrorBoundary>
        <div className="max-w-2xl mx-auto">
          <ScrollArea className="h-[70vh] w-full">
            <div className="p-4">
              <CartContent />
            </div>
          </ScrollArea>

          {/* Fixed Action Buttons for Embedded Mode */}
          {cart.items.length > 0 && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(finalTotalPrice)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0 || isCheckingOut}
                  className="flex-1"
                  size="lg"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <Button variant="outline" onClick={handleClearCart} disabled={cart.items.length === 0} size="lg">
                  Clear
                </Button>
              </div>
            </div>
          )}

          {showAddressModal && (
            <AddressCollectionModal
              isOpen={showAddressModal}
              onClose={() => setShowAddressModal(false)}
              onSubmit={handleAddressSubmit}
            />
          )}
        </div>
      </ErrorBoundary>
    )
  }

  // Modern sticky header cart panel
  return (
    <ErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] max-w-full bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
            >
              {/* Header - Always visible */}
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h2 id="cart-title" className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart
                  {cart.items.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                    </Badge>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={toggleExpanded}
                    aria-label={isExpanded ? "Collapse cart" : "Expand cart"}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={onClose}
                    aria-label="Close cart"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-hidden" ref={contentRef}>
                      <ScrollArea className="h-[calc(100vh-180px)]">
                        <div className="p-4 space-y-4">
                          {cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
                              <p className="text-lg font-medium">Your cart is empty</p>
                              <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
                              <Link href="/pricing" passHref>
                                <Button variant="default" onClick={onClose}>
                                  Continue Shopping
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cart.items.map((item) => (
                                <Card
                                  key={item.id}
                                  className={`flex flex-col p-3 ${
                                    recentlyAdded === item.id ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                                  }`}
                                >
                                  <div className="flex items-center">
                                    {item.image && (
                                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border mr-3">
                                        <Image
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          layout="fill"
                                          objectFit="cover"
                                          className="rounded-md"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                                        {item.name}
                                      </h3>
                                      <div className="flex items-center">
                                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                        {item.metadata?.frequency && (
                                          <Badge variant="outline" className="ml-1 text-xs px-1 py-0">
                                            {item.metadata.frequency}
                                          </Badge>
                                        )}
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
                                      <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
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
                                        className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label="Remove item"
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Expandable details section */}
                                  {item.metadata?.rooms && (
                                    <div className="w-full mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-6 text-xs p-0 justify-between"
                                        onClick={() => toggleItemDetails(item.id)}
                                      >
                                        <span>Room details</span>
                                        <ArrowRight
                                          className={`h-3 w-3 transition-transform ${
                                            expandedItem === item.id ? "rotate-90" : ""
                                          }`}
                                        />
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
                                            <div className="mt-1 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                              <p className="font-medium">Rooms:</p>
                                              <div className="flex flex-wrap gap-1 mt-1">
                                                {Array.isArray(item.metadata.rooms) ? (
                                                  item.metadata.rooms.map((room, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="secondary"
                                                      className="text-[10px] px-1 py-0"
                                                    >
                                                      {room}
                                                    </Badge>
                                                  ))
                                                ) : (
                                                  <span>{item.metadata.rooms}</span>
                                                )}
                                              </div>

                                              {item.metadata?.serviceLevel && (
                                                <p className="mt-1">
                                                  <span className="font-medium">Service level:</span>{" "}
                                                  {item.metadata.serviceLevel}
                                                </p>
                                              )}

                                              {item.metadata?.specialInstructions && (
                                                <p className="mt-1">
                                                  <span className="font-medium">Notes:</span>{" "}
                                                  {item.metadata.specialInstructions}
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
                          )}

                          {/* Video Recording Option */}
                          {cart.items.length > 0 && (
                            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="allowVideoRecording"
                                  checked={allowVideoRecording}
                                  onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                                  className="h-4 w-4"
                                />
                                <Label
                                  htmlFor="allowVideoRecording"
                                  className="flex items-center gap-1 text-sm font-medium"
                                >
                                  <Video className="h-4 w-4 text-blue-600" />
                                  Video recording discount
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        We may record cleaning sessions for training and social media purposes. By
                                        allowing this, you'll receive a discount on your order.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </Label>
                              </div>
                            </div>
                          )}

                          {checkoutError && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                              <p>{checkoutError}</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer - Always visible */}
              <div className="border-t p-4 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
                {cart.items.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                          <span>{formatCurrency(cart.totalPrice)}</span>
                        </div>
                        {videoDiscountAmount > 0 && (
                          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Video Discount</span>
                            <span>- {formatCurrency(videoDiscountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatCurrency(finalTotalPrice)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCheckout}
                        disabled={cart.items.length === 0 || isCheckingOut}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isCheckingOut ? "Processing..." : "Checkout"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleClearCart}
                        disabled={cart.items.length === 0}
                        size="icon"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <Link href="/pricing" passHref>
                      <Button variant="default" onClick={onClose} className="w-full">
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showAddressModal && (
        <AddressCollectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
        />
      )}
    </ErrorBoundary>
  )
}

// Helper component for cart content
function CartContent() {
  // This component would contain the cart items display logic
  // It's not implemented here since we're using the content directly in the Cart component
  return null
}
