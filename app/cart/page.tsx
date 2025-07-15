"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, XCircle, CheckCircle2, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCartHealthSuggestions } from "@/lib/cart-health"
import { CUSTOM_SPACE_LEGAL_DISCLAIMER, requiresEmailPricing } from "@/lib/room-tiers"

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart()
  const { toast } = useToast()

  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)

  const subtotal = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart.items])

  const totalItems = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart.items])

  const hasInPersonPaymentItems = useMemo(() => {
    return cart.items.some((item) => item.paymentType === "in_person")
  }, [cart.items])

  const hasEmailPricingItems = useMemo(() => {
    return cart.items.some((item) => requiresEmailPricing(item.metadata?.roomType))
  }, [cart.items])

  const cartHealthSuggestions = useMemo(() => {
    const suggestions = getCartHealthSuggestions(cart.items)
    // Filter out the specific suggestion about potential issues
    return suggestions.filter((suggestion) => !suggestion.includes("Your cart has some potential issues"))
  }, [cart.items])

  useEffect(() => {
    // Reset coupon discount if cart items change
    setCouponDiscount(0)
    setCouponCode("")
    setCouponError(null)
  }, [cart.items])

  const handleApplyCoupon = () => {
    setCouponError(null)
    // Simulate coupon application
    if (couponCode.toLowerCase() === "v0discount") {
      const discountAmount = Math.min(subtotal * 0.15, 50) // 15% off, max $50
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

  const handleClearCartClick = () => {
    clearCart()
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Your Cart ({totalItems} items)
          </CardTitle>
          <CardDescription>Review your selected cleaning services before proceeding to checkout.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-end p-6 border-b border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Items
            </Button>
          </div>
          <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
            <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-lg text-muted-foreground">Your cart is empty.</p>
                  <Link href="/pricing">
                    <Button className="mt-6">Start Building Your Order</Button>
                  </Link>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.metadata?.frequency && (
                          <p className="text-sm text-muted-foreground">
                            Frequency: {item.metadata.frequency.replace(/_/g, " ")}
                          </p>
                        )}
                        {item.metadata?.rooms && (
                          <p className="text-sm text-muted-foreground">Rooms: {item.metadata.rooms}</p>
                        )}
                        {item.paymentType === "in_person" && (
                          <p className="text-sm text-orange-500 font-semibold">Payment in person</p>
                        )}
                        {requiresEmailPricing(item.metadata?.roomType) && (
                          <p className="text-sm text-orange-500 font-semibold">Email for Pricing</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.paymentType === "in_person" || requiresEmailPricing(item.metadata?.roomType) ? (
                        <span className="font-medium text-lg text-orange-600">Email for Pricing</span>
                      ) : (
                        <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
              {/* Coupon Code Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Have a coupon code?</h3>
                <div className="flex gap-2">
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
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(subtotal - couponDiscount)}</span>
                </div>
                {hasInPersonPaymentItems && (
                  <p className="text-sm text-orange-500 mt-2">
                    Note: Some services require payment in person. This total reflects online payment services only.
                  </p>
                )}
                {hasEmailPricingItems && (
                  <p className="text-sm text-orange-500 mt-2">Note: {CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
                )}
              </div>
              <Button asChild className="w-full py-3 text-lg" disabled={cart.items.length === 0}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Health Suggestions */}
      {cart.items.length > 0 && cartHealthSuggestions.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Suggestions for You
            </CardTitle>
            <CardDescription>Based on your cart, here are some recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {cartHealthSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
