"use client"

import React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ShoppingCart, X, Plus, Minus, Tag, Percent, DollarSign, Info, AlertCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCartHealth } from "@/lib/cart-health" // Assuming this hook exists
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, Shield, Lock, CheckCircle, CreditCard, Apple, BanknoteIcon } from "lucide-react"

// Enhanced cart item interface
interface EnhancedCartItem {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  priceId: string
  quantity: number
  image?: string
  category?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  isRecurring?: boolean
  recurringInterval?: "week" | "month" | "year"
  paymentType?: "online" | "in_person"
}

// Payment method interface
interface PaymentMethod {
  id: string
  type: "card" | "bank" | "wallet" | "crypto" | "bnpl"
  name: string
  icon: React.ComponentType
  description: string
  fees?: number
  processingTime?: string
}

// Advanced cart system component
export function AdvancedCartSystem() {
  // Core state management
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const { getCartHealthSuggestions } = useCartHealth()

  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Device detection
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Payment methods configuration
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      fees: 0,
      processingTime: "Instant",
    },
    {
      id: "paypal",
      type: "wallet",
      name: "PayPal",
      icon: Tag,
      description: "Pay with your PayPal account",
      fees: 0,
      processingTime: "Instant",
    },
    {
      id: "apple_pay",
      type: "wallet",
      name: "Apple Pay",
      icon: Apple,
      description: "Touch ID or Face ID",
      fees: 0,
      processingTime: "Instant",
    },
    {
      id: "bank_transfer",
      type: "bank",
      name: "Bank Transfer",
      icon: BanknoteIcon,
      description: "Direct bank transfer",
      fees: 0,
      processingTime: "1-3 business days",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 },
    },
  }

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 4.99
    const tax = subtotal * 0.08 // Generic tax rate
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total,
      savings: cart.items.reduce((total, item) => {
        const originalPrice = (item as any).originalPrice || item.price
        return total + (originalPrice - item.price) * item.quantity
      }, 0),
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
    }
  }, [cart.items])

  // Enhanced checkout handler
  const handleCheckout = useCallback(async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        lineItems: cart.items.map((item) => ({
          price: item.priceId,
          quantity: item.quantity,
        })),
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [cart.items])

  // Enhanced item removal with undo
  const handleRemoveItem = useCallback(
    (itemId: string) => {
      const item = cart.items.find((item) => item.id === itemId)
      if (!item) return

      removeItem(itemId)

      // Show undo toast
      toast({
        title: "Item removed",
        description: (
          <div className="flex items-center justify-between">
            <span>{item.name} removed from cart</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addItem(item)
                toast({ title: "Item restored", description: `${item.name} added back to cart` })
              }}
            >
              Undo
            </Button>
          </div>
        ),
        duration: 5000,
      })
    },
    [cart.items, removeItem, addItem],
  )

  // Enhanced quantity update
  const handleQuantityUpdate = useCallback(
    (itemId: string, newQuantity: number) => {
      const item = cart.items.find((item) => item.id === itemId)
      if (!item) return

      if (newQuantity < 1) {
        handleRemoveItem(itemId)
        return
      }

      if (newQuantity > 99) {
        toast({
          title: "Quantity limit exceeded",
          description: "Maximum quantity per item is 99",
          variant: "destructive",
        })
        return
      }

      updateQuantity(itemId, newQuantity)
    },
    [cart.items, updateQuantity, handleRemoveItem],
  )

  useEffect(() => {
    // Reset coupon discount if cart items change
    setCouponDiscount(0)
    setCouponCode("")
    setCouponError(null)
  }, [cart.items])

  const handleApplyCoupon = () => {
    setCouponError(null)
    if (couponCode.toLowerCase() === "v0discount") {
      const discountAmount = Math.min(calculations.subtotal * 0.15, 50) // 15% off, max $50
      setCouponDiscount(discountAmount)
      toast({
        title: "Coupon Applied!",
        description: `You saved ${formatCurrency(discountAmount)} with code "${couponCode}".`,
        variant: "success",
      })
    } else if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code.")
    } else {
      setCouponDiscount(0)
      setCouponError("Invalid coupon code. Please try again.")
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      })
    }
  }

  const handleClearCartClick = useCallback(() => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    })
  }, [clearCart, toast])

  // Cart health suggestions
  const cartHealthSuggestions = getCartHealthSuggestions(cart.items)
  const filteredSuggestions = cartHealthSuggestions.filter(
    (suggestion) => suggestion.message !== "Your cart has some potential issues.",
  )

  // Mobile cart component
  const MobileCart = () => (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.div animate={{ scale: calculations.itemCount > 0 ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
            <ShoppingCart className="h-5 w-5" />
          </motion.div>
          <AnimatePresence>
            {calculations.itemCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
              >
                {calculations.itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">Shopping Cart</DrawerTitle>
              <DrawerDescription>
                {calculations.itemCount} {calculations.itemCount === 1 ? "item" : "items"} • Total{" "}
                {formatCurrency(calculations.total)}
              </DrawerDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Online
            </Badge>
          </div>

          {/* Delivery estimate banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm"
          >
            <ShoppingCart className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-800">Arrives by April 3 to April 9th</span>
          </motion.div>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex gap-4">
                      {/* Product image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}

                        {/* Discount badge */}
                        {(item as any).originalPrice && (item as any).originalPrice > item.price && (
                          <Badge className="absolute -right-1 -top-1 bg-red-500 text-xs">
                            -
                            {Math.round(
                              (((item as any).originalPrice - item.price) / (item as any).originalPrice) * 100,
                            )}
                            %
                          </Badge>
                        )}
                      </div>

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.metadata?.frequency && `${item.metadata.frequency} • `}
                              {item.metadata?.serviceType && `${item.metadata.serviceType}`}
                            </p>

                            {/* Price display */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                              {(item as any).originalPrice && (item as any).originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency((item as any).originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Customizations */}
                        {item.metadata?.rooms && (
                          <div className="mt-2 text-sm text-gray-500">
                            <span className="font-medium">Rooms:</span> {item.metadata.rooms}
                          </div>
                        )}

                        {item.metadata?.addOns && item.metadata.addOns.length > 0 && (
                          <div className="mt-2 text-sm text-gray-500">
                            <span className="font-medium">Add-ons:</span> {item.metadata.addOns.join(", ")}
                          </div>
                        )}

                        {item.metadata?.reductions && item.metadata.reductions.length > 0 && (
                          <div className="mt-2 text-sm text-gray-500">
                            <span className="font-medium">Reductions:</span> {item.metadata.reductions.join(", ")}
                          </div>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-8 text-center font-medium">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item actions */}
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700">
                              <Tag className="h-4 w-4 mr-2" />
                              Save for later
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700">
                              <Percent className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            {item.metadata?.isRecurring && (
                              <Badge variant="outline" className="ml-auto">
                                <Percent className="h-3 w-3 mr-1" />
                                Recurring {item.metadata.recurringInterval}ly
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress indicator for recurring services */}
                    {item.metadata?.isRecurring && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Percent className="h-3 w-3" />
                          <span>Recurring {item.metadata.recurringInterval}ly</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty cart state */}
              {cart.items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some cleaning services to get started</p>
                  <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Cart footer with totals and checkout */}
        {cart.items.length > 0 && (
          <DrawerFooter className="border-t bg-gray-50">
            {/* Order summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(calculations.subtotal)}</span>
              </div>

              {calculations.shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatCurrency(calculations.shipping)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(calculations.tax)}</span>
              </div>

              {calculations.savings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You save</span>
                  <span>-{formatCurrency(calculations.savings)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(calculations.total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Continue Shopping
              </Button>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <motion.div className="mr-2 h-4 w-4 animate-spin">
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Protected</span>
              </div>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )

  // Desktop cart component
  const DesktopCart = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.div animate={{ scale: calculations.itemCount > 0 ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
            <ShoppingCart className="h-5 w-5" />
          </motion.div>
          <AnimatePresence>
            {calculations.itemCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
              >
                {calculations.itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left side - Cart items */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">Shopping Cart</DialogTitle>
                  <DialogDescription className="text-lg">
                    You have {calculations.itemCount} {calculations.itemCount === 1 ? "item" : "items"} in your cart
                  </DialogDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Online
                </Badge>
              </div>

              {/* Delivery estimate banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3"
              >
                <ShoppingCart className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">Arrives by April 3 to April 9th</span>
              </motion.div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group relative mb-6 overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex gap-6">
                      {/* Product image */}
                      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                          </div>
                        )}

                        {/* Discount badge */}
                        {(item as any).originalPrice && (item as any).originalPrice > item.price && (
                          <Badge className="absolute -right-2 -top-2 bg-red-500">
                            -
                            {Math.round(
                              (((item as any).originalPrice - item.price) / (item as any).originalPrice) * 100,
                            )}
                            %
                          </Badge>
                        )}
                      </div>

                      {/* Item details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-gray-600 mt-1">
                              {item.metadata?.frequency && `${item.metadata.frequency} • `}
                              {item.metadata?.serviceType && `${item.metadata.serviceType}`}
                            </p>

                            {/* Customizations */}
                            {item.metadata?.rooms && (
                              <div className="mt-2 text-sm text-gray-500">
                                <span className="font-medium">Rooms:</span> {item.metadata.rooms}
                              </div>
                            )}

                            {item.metadata?.addOns && item.metadata.addOns.length > 0 && (
                              <div className="mt-2 text-sm text-gray-500">
                                <span className="font-medium">Add-ons:</span> {item.metadata.addOns.join(", ")}
                              </div>
                            )}

                            {item.metadata?.reductions && item.metadata.reductions.length > 0 && (
                              <div className="mt-2 text-sm text-gray-500">
                                <span className="font-medium">Reductions:</span> {item.metadata.reductions.join(", ")}
                              </div>
                            )}
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Price and quantity controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price display */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                            {(item as any).originalPrice && (item as any).originalPrice > item.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatCurrency((item as any).originalPrice * item.quantity)}
                              </div>
                            )}
                            <div className="text-sm text-gray-500">{formatCurrency(item.price)} each</div>
                          </div>
                        </div>

                        {/* Item actions */}
                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Tag className="h-4 w-4 mr-2" />
                            Save for later
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Percent className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          {item.metadata?.isRecurring && (
                            <Badge variant="outline" className="ml-auto">
                              <Percent className="h-3 w-3 mr-1" />
                              Recurring {item.metadata.recurringInterval}ly
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty cart state */}
              {cart.items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <ShoppingCart className="h-24 w-24 text-gray-300 mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                  <p className="text-gray-500 mb-8 max-w-md">
                    Discover our professional cleaning services and add them to your cart to get started
                  </p>
                  <Button size="lg" onClick={() => setIsOpen(false)}>
                    Browse Services
                  </Button>
                </motion.div>
              )}
            </ScrollArea>
          </div>

          {/* Right side - Checkout panel */}
          {cart.items.length > 0 && (
            <div className="w-96 border-l bg-gradient-to-b from-blue-50 to-purple-50">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Coupon Code
                </h3>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={couponError ? "border-red-500" : ""}
                  />
                  <Button onClick={handleApplyCoupon}>Apply</Button>
                </div>
                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                {couponDiscount > 0 && (
                  <p className="text-green-600 text-sm mt-1">Coupon applied: -{formatCurrency(couponDiscount)}</p>
                )}

                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Card Details
                </h3>

                {/* Payment method selection */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex-1 p-3 border rounded-lg bg-white cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        {React.createElement(method.icon)}
                        <span className="ml-2">{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="card-name" className="text-sm font-medium mb-3 block">
                      Name on card
                    </Label>
                    <Input
                      id="card-name"
                      placeholder="Name"
                      className="mt-1 bg-white/70 border-white/50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card-number" className="text-sm font-medium mb-3 block">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      placeholder="1111 2222 3333 4444"
                      className="mt-1 bg-white/70 border-white/50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry" className="text-sm font-medium mb-3 block">
                        Expiration date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="mm/yy"
                        className="mt-1 bg-white/70 border-white/50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium mb-3 block">
                        CVV
                      </Label>
                      <Input id="cvv" placeholder="123" className="mt-1 bg-white/70 border-white/50 focus:bg-white" />
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="space-y-3 mb-6 p-4 bg-white/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {calculations.shipping > 0 ? formatCurrency(calculations.shipping) : "Free"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Total (Tax incl.)</span>
                    <span className="font-medium">{formatCurrency(calculations.total)}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{formatCurrency(calculations.total)}</span>
                    <Button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div className="mr-2 h-4 w-4 animate-spin">
                            <Loader2 className="h-4 w-4" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Cart health suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 rounded-b-lg">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Info className="h-5 w-5" />
                      Suggestions for You
                    </h3>
                    <ul className="space-y-2">
                      {filteredSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                          {suggestion.type === "warning" ? (
                            <AlertCircle className="h-4 w-4 flex-shrink-0 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                          )}
                          {suggestion.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Protected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  // Return appropriate cart component based on device
  return isMobile ? <MobileCart /> : <DesktopCart />
}

export default AdvancedCartSystem
