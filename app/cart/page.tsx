"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2, Plus, Minus, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { analyzeCartHealth, type CartHealthReport } from "@/lib/cart-health"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { requiresEmailPricing } from "@/lib/room-tiers"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckoutButton } from "@/components/checkout-button"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

// Placeholder for suggested products component
function CartSuggestions({ currentCartItems, id }: { currentCartItems: any[]; id?: string }) {
  const suggestedProducts = [
    {
      id: "deep-clean-add-on",
      name: "Deep Clean Add-on",
      price: 45.0,
      image: "/placeholder.svg?height=60&width=60",
      description: "Enhance your cleaning with a deep clean.",
    },
    {
      id: "eco-friendly-products",
      name: "Eco-Friendly Products",
      price: 15.0,
      image: "/placeholder.svg?height=60&width=60",
      description: "Environmentally friendly supplies.",
    },
  ].filter((suggestion) => !currentCartItems.some((item) => item.id === suggestion.id))

  if (suggestedProducts.length === 0) {
    return null
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm" id={id}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Suggested
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          {suggestedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={40}
                height={40}
                className="rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{product.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{product.description}</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <Button size="sm" variant="outline" className="flex-shrink-0 bg-transparent">
                Add
              </Button>
            </div>
          ))}
        </div>
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

  // Helper function to safely get room type from item metadata
  const getItemRoomType = (item: any): string | undefined => {
    return item?.metadata?.roomType || undefined
  }

  // Helper function to safely check if item requires email pricing
  const itemRequiresEmailPricing = (item: any): boolean => {
    const roomType = getItemRoomType(item)
    return requiresEmailPricing(roomType) || item?.paymentType === "in_person"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cart.items.length === 0 ? "Your cart is empty" : `${cart.totalItems} items in your cart`}
          </p>
        </div>

        {cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto">
            <Card className="text-center p-8 bg-white dark:bg-gray-800 shadow-sm">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Your cart is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start by exploring our cleaning services</p>
              <Button asChild size="lg" className="w-full">
                <Link href="/pricing">Browse Services</Link>
              </Button>
            </Card>
          </div>
        ) : (
          /* Cart Content */
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Cart Items - Takes up more space on larger screens */}
              <div className="lg:col-span-8">
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">Items ({cart.totalItems})</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCartClick}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      <AnimatePresence mode="popLayout">
                        {cart.items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              {/* Item Image */}
                              {item.image && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      if (target && target.src !== "/placeholder.svg") {
                                        target.src = "/placeholder.svg"
                                      }
                                    }}
                                  />
                                </div>
                              )}

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                                    {item.sourceSection && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {item.sourceSection}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                                      {item.metadata?.roomConfig?.name && (
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                          {item.metadata.roomConfig.name}
                                        </span>
                                      )}
                                      {item.metadata?.roomConfig?.timeEstimate && (
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                          {item.metadata.roomConfig.timeEstimate}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Remove Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItemClick(item.id, item.name)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-4"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Quantity and Price Row */}
                                <div className="flex items-center justify-between mt-4">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="px-3 py-1 text-sm font-medium min-w-[2ch] text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  {/* Price */}
                                  <div className="text-right">
                                    {itemRequiresEmailPricing(item) ? (
                                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                                        Email for Pricing
                                      </p>
                                    ) : (
                                      <>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        {item.quantity > 1 && (
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ${item.price.toFixed(2)} each
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  {/* Order Summary */}
                  <Card className="bg-white dark:bg-gray-800 shadow-sm">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                      <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between text-base">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.totalItems} items)</span>
                          <span className="font-medium">${cart.subtotalPrice.toFixed(2)}</span>
                        </div>

                        {/* Discounts */}
                        {cart.couponDiscount > 0 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Coupon ({cart.couponCode})</span>
                            <span>-${cart.couponDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        {cart.fullHouseDiscount > 0 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Full House Discount</span>
                            <span>-${cart.fullHouseDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Coupon Input */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Coupon code"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleApplyCoupon}
                              disabled={!couponInput.trim() || cart.couponDiscount > 0}
                              variant="outline"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span className="text-blue-600 dark:text-blue-400">${cart.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Custom Services Notice */}
                        {cart.inPersonPaymentTotal > 0 && (
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">
                              Custom Services: Email for Pricing
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-400">
                              Some items require custom pricing and will be handled separately.
                            </p>
                          </div>
                        )}

                        {/* Checkout Button */}
                        <div className="pt-4">
                          <CheckoutButton
                            useCheckoutPage={true}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                            disabled={cart.items.length === 0 || isCheckoutLoading}
                          />
                          <Button asChild variant="outline" className="w-full mt-3 bg-transparent">
                            <Link href="/">Continue Shopping</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cart Health & Suggestions */}
                  {cartHealth && (
                    <Card className="bg-white dark:bg-gray-800 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          Cart Insights
                          {cartHealth.overallHealth === "healthy" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {cartHealth.overallHealth === "warning" && (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          {cartHealth.overallHealth === "critical" && <XCircle className="h-5 w-5 text-red-500" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="text-sm space-y-3">
                          <div className="flex justify-between">
                            <span>Health Score</span>
                            <span className="font-medium">{cartHealth.score}/100</span>
                          </div>
                          {cartHealth.suggestions.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Suggestions:</h4>
                              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                                {cartHealth.suggestions.slice(0, 2).map((suggestion, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggested Products */}
                  <CartSuggestions currentCartItems={cart.items} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialogs remain the same */}
        {/* Remove Item Confirmation Dialog */}
        <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remove Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove <strong>{itemToRemoveName}</strong> from your cart?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={cancelRemoveItem}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmRemoveItem}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clear Cart Confirmation Dialog */}
        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Clear Cart</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmClearCart}>
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
