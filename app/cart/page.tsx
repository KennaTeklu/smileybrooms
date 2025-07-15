"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle, AlertCircle, XCircle, Lightbulb, Tag } from "lucide-react"
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
import Image from "next/image"
import { analyzeCartHealth, type CartHealthReport } from "@/lib/cart-health"
import { CheckoutButton } from "@/components/checkout-button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { requiresEmailPricing, CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"

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
  ].filter((suggestion) => !currentCartItems.some((item) => item.id === suggestion.id)) // Filter out items already in cart

  if (suggestedProducts.length === 0) {
    return null
  }

  return (
    <Card className="shadow-lg" id={id}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" /> Suggested for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Add
              </Button>
            </div>
          </div>
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
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">Your Shopping Cart</h1>

      {cart.items.length > 0 && (
        <nav className="mb-8 flex justify-center gap-4 flex-wrap">
          <Button variant="outline" asChild>
            <Link href="#cart-items-list">Items</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#order-summary">Summary</Link>
          </Button>
          {cartHealth && (
            <Button variant="outline" asChild>
              <Link href="#cart-health-report">Health</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="#suggested-products">Suggestions</Link>
          </Button>
        </nav>
      )}

      {cart.items.length === 0 ? (
        <Card
          className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-card rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
          id="empty-cart-message"
        >
          <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6 opacity-70" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Your cart is empty</h3>
          <p className="text-muted-foreground mb-8 max-w-md">
            Looks like you haven't added any cleaning services or products yet. Start by exploring our offerings!
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/pricing">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 flex-1">
          {/* Cart Items List */}
          <Card className="lg:col-span-2 shadow-lg" id="cart-items-list">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Items in Cart ({cart.totalItems})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
                <div className="space-y-4 p-6">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-background rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                    >
                      {/* Item image */}
                      {item.image && (
                        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={112}
                            height={112}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              // Fallback to local placeholder if remote image fails
                              const target = e.target as HTMLImageElement
                              if (target && target.src !== "/placeholder.svg") {
                                target.src = "/placeholder.svg"
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg leading-tight mb-1 text-gray-900 dark:text-gray-100">
                          {item.name}
                        </h4>
                        {item.sourceSection && (
                          <p className="text-sm text-muted-foreground mb-2">{item.sourceSection}</p>
                        )}
                        {item.metadata?.roomConfig?.name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tier: {item.metadata.roomConfig.name}
                          </p>
                        )}
                        {item.metadata?.roomConfig?.timeEstimate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Est. Time: {item.metadata.roomConfig.timeEstimate}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-base font-medium min-w-[2ch] text-center text-gray-900 dark:text-gray-100">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            {requiresEmailPricing(item.metadata?.roomType) || item.paymentType === "in_person" ? (
                              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                Email for Pricing
                              </p>
                            ) : (
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                            {item.quantity > 1 &&
                              !requiresEmailPricing(item.metadata?.roomType) &&
                              item.paymentType !== "in_person" && (
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        onClick={() => handleRemoveItemClick(item.id, item.name)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Items
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Summary & Health */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg" id="order-summary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
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
                    className="flex-1"
                    aria-label="Coupon code input"
                  />
                  <Button onClick={handleApplyCoupon} disabled={!couponInput.trim() || cart.couponDiscount > 0}>
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
                  className="w-full"
                  size="lg"
                  disabled={cart.items.length === 0 || isCheckoutLoading}
                />
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-3 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>

            {cartHealth && (
              <Card className="shadow-lg" id="cart-health-report">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold">{itemToRemoveName}</span> from your cart?
              This action cannot be undone.
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
    </div>
  )
}
