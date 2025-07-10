"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Minus, CheckCircle, AlertCircle, XCircle, Lightbulb, Tag, ShoppingCart } from "lucide-react"
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
import CheckoutButton from "@/components/checkout-button"
import { Input } from "@/components/ui/input" // Import Input component
import { useToast } from "@/components/ui/use-toast" // Import useToast

// Placeholder for suggested products component
function CartSuggestions({ currentCartItems }: { currentCartItems: any[] }) {
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
    <Card className="shadow-lg">
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
  const { cartItems, totalItems, totalPrice, removeItem, updateItemQuantity } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cartHealth, setCartHealth] = useState<CartHealthReport | null>(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [couponInput, setCouponInput] = useState("") // State for coupon input

  useEffect(() => {
    if (cartItems.length > 0) {
      setCartHealth(analyzeCartHealth(cartItems))
    } else {
      setCartHealth(null)
    }
    setCouponInput("") // Keep input synced with cart state
  }, [cartItems])

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cartItems.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = currentItem.quantity + change
      if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity)
      } else {
        // If quantity drops to 0, trigger remove confirmation
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
    // Assuming clearCart function exists in useCart context
    // clearCart()
    setShowClearConfirm(false)
  }

  const handleClearCartClick = () => {
    setShowClearConfirm(true)
  }

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      // Assuming applyCoupon function exists in useCart context
      // applyCoupon(couponInput.trim())
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

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="mb-4 h-16 w-16 text-gray-400" />
          <p className="mb-4 text-xl text-gray-600">Your cart is empty.</p>
          <Link href="/pricing">
            <Button>Start Building Your Plan</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Items in Cart ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[70vh] md:max-h-[calc(100vh-250px)]">
                  <div className="space-y-4 p-6">
                    {cartItems.map((item) => (
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
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
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
                  <Button variant="outline" onClick={handleClearCartClick} disabled={cartItems.length === 0}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">${totalPrice.toFixed(2)}</span>
                  </div>
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
                    <Button onClick={handleApplyCoupon} disabled={!couponInput.trim()}>
                      <Tag className="h-4 w-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">${totalPrice.toFixed(2)}</span>
                  </div>
                  <CheckoutButton
                    useCheckoutPage={true}
                    className="w-full"
                    size="lg"
                    disabled={cartItems.length === 0 || isCheckoutLoading}
                  />
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-3 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {cartHealth && (
              <Card className="shadow-lg">
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
            <CartSuggestions currentCartItems={cartItems} />
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
