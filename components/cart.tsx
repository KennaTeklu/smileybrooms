"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, ShoppingCart, Video, Info, ArrowRight, X } from "lucide-react"
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
  const cartRef = useRef<HTMLDivElement>(null)

  // Calculate cart metrics
  const totalItems = cart.items?.length || 0
  const totalPrice = cart.totalPrice || 0
  const hasItems = totalItems > 0

  // Show cart when items are present
  useEffect(() => {
    if (hasItems && !isExpanded) {
      // Auto-expand when items are added
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

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isExpanded && !embedded) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [isExpanded, embedded])

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
  }, [clearCart])

  const videoDiscountAmount = allowVideoRecording
    ? totalPrice >= 250
      ? 25 // $25 discount for orders $250 or more
      : totalPrice * 0.1 // 10% discount for orders under $250
    : 0

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
            cartTotal: totalPrice,
            discountAmount: videoDiscountAmount,
            finalTotal: finalTotalPrice,
            itemCount: totalItems,
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

  // MEGA UPDATE: Always visible floating cart
  return (
    <ErrorBoundary>
      <div
        ref={cartRef}
        className="fixed right-0 top-1/4 z-50 transform transition-transform duration-300"
        style={{
          transform: isExpanded ? "translateX(0)" : "translateX(calc(100% - 60px))",
        }}
      >
        {/* Main Cart Panel */}
        <div className="flex">
          {/* Toggle Button (Always Visible) */}
          <button
            onClick={toggleExpanded}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-lg flex flex-col items-center justify-center shadow-lg"
            style={{ height: "120px", width: "60px" }}
          >
            <ShoppingCart className="h-6 w-6 mb-2" />
            <div className="rotate-90 text-xs font-bold whitespace-nowrap">{isExpanded ? "CLOSE" : "CART"}</div>
            {hasItems && (
              <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </div>
            )}
          </button>

          {/* Cart Content */}
          <div
            className="bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
            style={{ width: "350px", maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
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
                  onClick={toggleExpanded}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1" ref={contentRef}>
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

            {/* Video Recording Option */}
            {hasItems && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="p-2 border rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowVideoRecording"
                      checked={allowVideoRecording}
                      onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="allowVideoRecording" className="flex items-center gap-1 text-sm font-medium">
                      <Video className="h-4 w-4 text-blue-600" />
                      Video recording discount
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            We may record cleaning sessions for training and social media purposes. By allowing this,
                            you'll receive a discount on your order.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                </div>

                {/* Total Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(totalPrice)}</div>
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

                {/* Action Buttons */}
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

                {checkoutError && (
                  <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <p>{checkoutError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty Cart Message */}
            {!hasItems && (
              <div className="flex flex-col items-center justify-center p-8 text-center border-t">
                <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
                <Link href="/pricing" passHref>
                  <Button variant="default" onClick={toggleExpanded}>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

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
function CartContent({ cart, expandedItem, toggleItemDetails, handleRemoveItem, handleUpdateQuantity, recentlyAdded }) {
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
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate">{item.name}</h3>
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
                <span className="text-xs text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-2 w-2" />
              </Button>
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
