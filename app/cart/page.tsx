"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2, CheckCircle, AlertCircle, XCircle, Lightbulb, Tag } from "lucide-react"
import Image from "next/image" // Corrected: Ensure Image is imported from next/image
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { analyzeCartHealth, type CartHealthReport } from "@/lib/cart-health"
import { CheckoutButton } from "@/components/checkout-button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"
import { motion, AnimatePresence } from "framer-motion"
import { CartItemDisplay } from "@/components/cart/cart-item-display" // Import the new component

// Placeholder for suggested products component
function CartSuggestions({ currentCartItems, id }: { currentCartItems: any[]; id?: string }) {
  // In a real application, this would fetch suggestions based on currentCartItems
  const suggestedProducts = [
    {
      id: "deep-clean-add-on",
      name: "Deep Clean Add-on",
      price: 45.0,
      image: "/placeholder.svg?height=100&width=100",
      description: "Enhance your cleaning with a deep clean for specific areas.",
    },
    {
      id: "eco-friendly-products",
      name: "Eco-Friendly Products",
      price: 15.0,
      image: "/placeholder.svg?height=100&width=100",
      description: "Upgrade to environmentally friendly cleaning supplies.",
    },
    {
      id: "window-cleaning",
      name: "Window Cleaning",
      price: 75.0,
      image: "/placeholder.svg?height=100&width=100",
      description: "Sparkling clean windows, inside and out.",
    },
  ].filter((suggestion) => !currentCartItems.some((item) => item.id === suggestion.id)) // Filter out items already in cart

  if (suggestedProducts.length === 0) {
    return null
  }

  return (
    <Card className="shadow-lg border-gray-200 dark:border-gray-700" id={id}>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Lightbulb className="h-6 w-6 text-yellow-500" /> Suggested for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={64}
              height={64}
              className="rounded-md object-cover border border-gray-200 dark:border-gray-600"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Add
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cartHealth, setCartHealth] = useState<CartHealthReport | null>(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
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

  const handleClearCartClick = () => {
    setShowClearConfirm(true)
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

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100 leading-tight">
        Your <span className="text-blue-600 dark:text-blue-400">Shopping Cart</span>
      </h1>

      {cart.items.length > 0 && (
        <nav className="mb-8 flex justify-center gap-3 sm:gap-4 flex-wrap">
          <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
            <Link href="#cart-items-list">Items</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
            <Link href="#order-summary">Summary</Link>
          </Button>
          {cartHealth && (
            <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
              <Link href="#cart-health-report">Health</Link>
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
            <Link href="#suggested-products">Suggestions</Link>
          </Button>
        </nav>
      )}

      {cart.items.length === 0 ? (
        <Card
          className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-card rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
          id="empty-cart-message"
        >
          <ShoppingBag className="h-28 w-28 text-muted-foreground mb-6 opacity-70" />
          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Your cart is empty
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md text-base">
            Looks like you haven't added any cleaning services or products yet. Start by exploring our offerings!
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 text-base">
            <Link href="/pricing">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 flex-1">
          {/* Cart Items List */}
          <Card className="lg:col-span-2 shadow-lg border-gray-200 dark:border-gray-700" id="cart-items-list">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Items in Cart ({cart.totalItems})
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleClearCartClick}
                disabled={cart.items.length === 0}
                className="rounded-lg bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
                <div className="space-y-4 p-6 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <CartItemDisplay
                        key={item.id}
                        item={item}
                        onRemoveItem={handleRemoveItemClick}
                        onUpdateQuantity={handleQuantityChange}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Cart Summary & Health */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg border-gray-200 dark:border-gray-700" id="order-summary">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal ({cart.totalItems} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${cart.subtotalPrice.toFixed(2)}
                    </span>
                  </div>
                  {cart.couponDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Coupon ({cart.couponCode})</span>
                      <span>-${cart.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {cart.fullHouseDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Full House Discount</span>
                      <span>-${cart.fullHouseDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <Separator className="my-4" />
                {/* Coupon Input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 h-10 rounded-lg"
                    aria-label="Coupon code input"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || cart.couponDiscount > 0}
                    className="rounded-lg"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">${cart.totalPrice.toFixed(2)}</span>
                </div>
                {cart.inPersonPaymentTotal > 0 && (
                  <>
                    <div className="flex justify-between text-xl font-bold text-orange-600 mt-4">
                      <span>Custom Services</span>
                      <span>Email for Pricing</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">Payment Notice:</p>
                      <p>{CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
                    </div>
                  </>
                )}
                {/* New descriptive text */}
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Ready to finalize your booking? Proceed to our secure checkout to enter your details and complete your
                  order.
                </p>
                <CheckoutButton
                  useCheckoutPage={true}
                  className="w-full h-12 rounded-lg text-base"
                  size="lg"
                  disabled={cart.items.length === 0 || isCheckoutLoading}
                />
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-3 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>

            {cartHealth && (
              <Card className="shadow-lg border-gray-200 dark:border-gray-700" id="cart-health-report">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    Cart Health Report
                    {cartHealth.overallHealth === "healthy" && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {cartHealth.overallHealth === "warning" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                    {cartHealth.overallHealth === "critical" && <XCircle className="h-6 w-6 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overall Status:{" "}
                    <span
                      className={cn("font-semibold", {
                        "text-green-600 dark:text-green-400": cartHealth.overallHealth === "healthy",
                        "text-yellow-600 dark:text-yellow-400": cartHealth.overallHealth === "warning",
                        "text-red-600 dark:text-red-400": cartHealth.overallHealth === "critical",
                      })}
                    >
                      {cartHealth.overallHealth.charAt(0).toUpperCase() + cartHealth.overallHealth.slice(1)}
                    </span>{" "}
                    (Score: {cartHealth.score}/100)
                  </p>
                  {cartHealth.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500" /> Suggestions:
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {cartHealth.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Detailed Metrics:</h3>
                  <div className="space-y-3">
                    {cartHealth.metrics.map((metric) => (
                      <div key={metric.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{metric.name}</span>
                        <span
                          className={cn("font-medium", {
                            "text-green-600 dark:text-green-400": metric.status === "healthy",
                            "text-yellow-600 dark:text-yellow-400": metric.status === "warning",
                            "text-red-600 dark:text-red-400": metric.status === "critical",
                          })}
                        >
                          {metric.value} ({metric.status})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested Products/Upsells */}
            <CartSuggestions currentCartItems={cart.items} id="suggested-products" />
          </div>
        </div>
      )}

      {/* Remove Item Confirmation Dialog */}
      <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Removal</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{itemToRemoveName}</span> from your cart?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-2 pt-4">
            <Button variant="destructive" onClick={confirmRemoveItem} className="w-full sm:w-auto rounded-lg">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <Button variant="outline" onClick={cancelRemoveItem} className="w-full sm:w-auto rounded-lg bg-transparent">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Clear Cart Confirmation
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Are you sure you want to clear all items from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-2 pt-4">
            <Button variant="destructive" onClick={confirmClearCart} className="w-full sm:w-auto rounded-lg">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
              className="w-full sm:w-auto rounded-lg"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
