"use client"

import type React from "react"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, ShoppingCart, Video, Info, ArrowRight, X, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import { loadStripe } from "@stripe/stripe-js"
import ErrorBoundary from "@/components/error-boundary"
import { useAdaptiveScrollPositioning } from "@/hooks/use-adaptive-scroll-positioning"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { cn } from "@/lib/utils"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartProps {
  isOpen: boolean
  onClose?: () => void
  embedded?: boolean
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  // Use adaptive scroll positioning like the Add All to Cart modal
  const { positionStyles, sensors, debugInfo } = useAdaptiveScrollPositioning({
    startPosition: 80,
    endPosition: 200,
    minDistanceFromBottom: 180,
    mouseSensitivity: 0.4,
    velocityDamping: 0.8,
    adaptiveSpeed: true,
  })

  // Motion values for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  // Cart metrics
  const cartMetrics = useMemo(
    () => ({
      totalItems: cart.totalItems || 0,
      totalValue: cart.totalPrice || 0,
      hasItems: (cart.totalItems || 0) > 0,
      isHighValue: (cart.totalPrice || 0) > 200,
      itemCount: cart.items?.length || 0,
    }),
    [cart.totalItems, cart.totalPrice, cart.items],
  )

  // Show cart when items are present
  useEffect(() => {
    if (cartMetrics.hasItems && !isExpanded) {
      // Auto-expand when items are added
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
      })

      // Haptic feedback when items are ready
      if (cartMetrics.totalItems > 0) {
        vibrate(100)
      }
    }
  }, [cartMetrics.hasItems, cartMetrics.totalItems, controls, vibrate, isExpanded])

  // Restore scroll position
  useEffect(() => {
    if (isExpanded && contentRef.current) {
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
  }, [isExpanded])

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
      vibrate(50) // Light feedback
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
        duration: 3000,
      })
    },
    [removeItem, vibrate],
  )

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      const validQuantity = Math.max(1, isNaN(quantity) ? 1 : Math.floor(quantity))
      updateQuantity(id, validQuantity)
      vibrate(25) // Subtle feedback
    },
    [updateQuantity, vibrate],
  )

  const handleClearCart = useCallback(() => {
    clearCart()
    vibrate([100, 50, 100]) // Pattern feedback
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 3000,
    })
    setIsExpanded(false)
  }, [clearCart, vibrate])

  const videoDiscountAmount = useMemo(() => {
    if (allowVideoRecording) {
      if (cartMetrics.totalValue >= 250) {
        return 25 // $25 discount for orders $250 or more
      } else {
        return cartMetrics.totalValue * 0.1 // 10% discount for orders under $250
      }
    }
    return 0
  }, [allowVideoRecording, cartMetrics.totalValue])

  const finalTotalPrice = useMemo(
    () => cartMetrics.totalValue - videoDiscountAmount,
    [cartMetrics.totalValue, videoDiscountAmount],
  )

  const handleCheckout = async () => {
    if (!cartMetrics.hasItems) {
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
            cartTotal: cartMetrics.totalValue,
            discountAmount: videoDiscountAmount,
            finalTotal: finalTotalPrice,
            itemCount: cartMetrics.itemCount,
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
      vibrate(300) // Error pattern
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
    vibrate(50)
  }

  const handleClose = () => {
    setIsExpanded(false)
    onClose?.()
  }

  // Handle mouse movement for 3D hover effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - rect.width / 2)
      mouseY.set(e.clientY - rect.top - rect.height / 2)
    },
    [mouseX, mouseY],
  )

  // Don't render if no items and not embedded
  if (!cartMetrics.hasItems && !embedded) return null

  // Embedded mode (for cart page)
  if (embedded) {
    return (
      <ErrorBoundary>
        <div className="max-w-2xl mx-auto">
          <ScrollArea className="h-[70vh] w-full">
            <div className="p-4">{/* Cart content would go here */}</div>
          </ScrollArea>

          {cartMetrics.hasItems && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(finalTotalPrice)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCheckout}
                  disabled={!cartMetrics.hasItems || isCheckingOut}
                  className="flex-1"
                  size="lg"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <Button variant="outline" onClick={handleClearCart} disabled={!cartMetrics.hasItems} size="lg">
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

  // Floating adaptive cart (like Add All to Cart modal)
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <motion.div style={positionStyles}>
          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 text-xs rounded z-[9999] font-mono">
              <div>Device: {debugInfo.deviceType}</div>
              <div>Scroll: {debugInfo.scrollType}</div>
              <div>Velocity: {debugInfo.velocity.toFixed(1)}</div>
              <div>Mouse: {debugInfo.mouseActive ? "Active" : "Inactive"}</div>
              <div>Position: {debugInfo.position.toFixed(0)}px</div>
              <div>Progress: {(debugInfo.scrollProgress * 100).toFixed(1)}%</div>
            </div>
          )}

          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                ref={modalRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-white dark:bg-gray-900 shadow-2xl rounded-l-lg overflow-hidden flex"
                onMouseMove={handleMouseMove}
                style={{
                  rotateX: isSmallScreen ? 0 : rotateX,
                  rotateY: isSmallScreen ? 0 : rotateY,
                  transformPerspective: 1000,
                }}
              >
                <div className="w-80 sm:w-96 max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">Your Cart</h2>
                          <p className="text-blue-100 text-sm">
                            {cartMetrics.itemCount} item{cartMetrics.itemCount !== 1 ? "s" : ""} selected
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

                  {/* Scrollable Content */}
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {cartMetrics.hasItems ? (
                        <div className="space-y-3 mb-4">
                          {cart.items.map((item) => (
                            <Card
                              key={item.id}
                              className={`flex flex-col p-3 ${
                                recentlyAdded === item.id ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                              }`}
                            >
                              <div className="flex items-center">
                                {item.image && (
                                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border mr-3">
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
                                  <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate">
                                    {item.name}
                                  </h3>
                                  <div className="flex items-center">
                                    <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                                    {item.metadata?.frequency && (
                                      <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
                                        {item.metadata.frequency}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1 ml-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-2 w-2" />
                                  </Button>
                                  <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-2 w-2" />
                                  </Button>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash className="h-2 w-2" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Remove from cart</TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>

                              {/* Expandable details section */}
                              {item.metadata?.rooms && (
                                <div className="w-full mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full h-5 text-[10px] p-0 justify-between"
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
                                        <div className="mt-1 text-[10px] text-gray-500 bg-gray-50 dark:bg-gray-800 p-1 rounded">
                                          <p className="font-medium">Rooms:</p>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {Array.isArray(item.metadata.rooms) ? (
                                              item.metadata.rooms.map((room, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-[8px] px-1 py-0">
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
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
                          <p className="text-lg font-medium">Your cart is empty</p>
                          <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
                          <Link href="/pricing" passHref>
                            <Button variant="default" onClick={handleClose}>
                              Continue Shopping
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    {/* Video Recording Option */}
                    {cartMetrics.hasItems && (
                      <div className="mb-4 p-2 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowVideoRecording"
                            checked={allowVideoRecording}
                            onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                            className="h-3 w-3"
                          />
                          <Label htmlFor="allowVideoRecording" className="flex items-center gap-1 text-xs font-medium">
                            <Video className="h-3 w-3 text-blue-600" />
                            Video recording discount
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-blue-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                We may record cleaning sessions for training and social media purposes. By allowing
                                this, you'll receive a discount on your order.
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* Total Section */}
                    {cartMetrics.hasItems && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {cartMetrics.totalItems} item{cartMetrics.totalItems !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatCurrency(cartMetrics.totalValue)}
                            </div>
                            {videoDiscountAmount > 0 && (
                              <div className="text-xs text-green-600 dark:text-green-400">
                                - {formatCurrency(videoDiscountAmount)}
                              </div>
                            )}
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(finalTotalPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {cartMetrics.hasItems ? (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleCheckout}
                                disabled={!isOnline || isCheckingOut}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white group relative overflow-hidden"
                              >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center justify-center">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {isCheckingOut ? "Processing..." : "Checkout"}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isOnline ? "Proceed to checkout" : "Cannot checkout while offline"}
                            </TooltipContent>
                          </Tooltip>
                          <Button variant="outline" onClick={handleClearCart} className="w-full text-sm">
                            Clear Cart
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={handleClose} className="w-full text-sm">
                          Continue Shopping
                        </Button>
                      )}
                    </div>

                    {checkoutError && (
                      <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <p>{checkoutError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                ref={buttonRef}
                initial={{ x: "100%", opacity: 0 }}
                animate={controls}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ delay: 0.2 }}
                onClick={toggleExpanded}
                className={cn(
                  "flex items-center justify-center p-3 bg-blue-600 text-white",
                  "rounded-l-lg shadow-lg hover:bg-blue-700",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                )}
                aria-label="Open cart"
              >
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                      {cartMetrics.itemCount}
                    </Badge>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold flex items-center">
                      {cartMetrics.totalItems} Item{cartMetrics.totalItems !== 1 ? "s" : ""}
                      <ChevronLeft className="h-3 w-3 ml-1" />
                    </div>
                    <div className="text-xs">{formatCurrency(finalTotalPrice)}</div>
                  </div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {showAddressModal && (
          <AddressCollectionModal
            isOpen={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            onSubmit={handleAddressSubmit}
          />
        )}
      </TooltipProvider>
    </ErrorBoundary>
  )
}
