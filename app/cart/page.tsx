"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { CheckoutButton } from "@/components/checkout-button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"
import { AnimatePresence } from "framer-motion"
import { CartItemDisplay } from "@/components/cart/cart-item-display"

// Simple price formatter – prepend `$` & keep two decimals
const formatPrice = (price: number) => `$${price.toFixed(2)}`

// Empty placeholder for suggested products component
function CartSuggestions({ currentCartItems, id }: { currentCartItems: any[]; id?: string }) {
  return null
}

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [couponInput, setCouponInput] = useState(cart.couponCode || "")

  useEffect(() => {
    setCouponInput(cart.couponCode || "")
  }, [cart.couponCode])

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items?.find((item) => item.id === itemId)
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

      {(cart.items?.length ?? 0) > 0 && (
        <nav className="mb-8 flex justify-center gap-3 sm:gap-4 flex-wrap">
          <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
            <Link href="#cart-items-list">Items</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-4 py-2 text-sm sm:text-base bg-transparent">
            <Link href="#order-summary">Summary</Link>
          </Button>
        </nav>
      )}

      {(cart.items?.length ?? 0) === 0 ? (
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
                disabled={(cart.items?.length ?? 0) === 0}
                className="rounded-lg bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                <AnimatePresence mode="popLayout">
                  {cart.items?.map((item) => (
                    <CartItemDisplay
                      key={item.id}
                      item={item}
                      onRemoveItem={handleRemoveItemClick}
                      onUpdateQuantity={handleQuantityChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
          {/* Cart Summary Only */}
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
                      {formatPrice(cart.subtotalPrice)}
                    </span>
                  </div>
                  {cart.couponDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Coupon ({cart.couponCode})</span>
                      <span>-{formatPrice(cart.couponDiscount)}</span>
                    </div>
                  )}
                  {cart.fullHouseDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Full House Discount</span>
                      <span>-{formatPrice(cart.fullHouseDiscount)}</span>
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
                  <span className="text-blue-600 dark:text-blue-400">{formatPrice(cart.totalPrice)}</span>
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
                {/* Checkout focused description */}
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Ready to complete your order? Proceed to checkout to finalize your booking.
                </p>
                <CheckoutButton
                  useCheckoutPage={false} // Changed to false for direct Stripe checkout
                  className="w-full h-12 rounded-lg text-base"
                  size="lg"
                  disabled={(cart.items?.length ?? 0) === 0 || isCheckoutLoading}
                  productName="Smiley Brooms Cleaning Service" // Generic product name for Stripe
                  productPrice={cart.totalPrice} // Pass the total price from the cart
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
