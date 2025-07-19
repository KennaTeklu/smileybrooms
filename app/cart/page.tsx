"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItemDisplay } from "@/components/cart/cart-item-display"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { cart, updateItemQuantity, removeItem, applyCoupon, couponCode, couponDiscount } = useCart()
  const { toast } = useToast()
  const [localCouponCode, setLocalCouponCode] = useState(couponCode || "")

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalDiscount = couponDiscount + cart.fullHouseDiscount
  const finalSubtotal = subtotal - totalDiscount
  const tax = finalSubtotal * 0.08 // Example 8% tax
  const total = finalSubtotal + tax

  const handleApplyCoupon = () => {
    if (localCouponCode.trim()) {
      const success = applyCoupon(localCouponCode.trim())
      if (success) {
        toast({
          title: "Coupon Applied!",
          description: `Coupon "${localCouponCode}" applied successfully.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code entered is not valid.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-bold">
              <ShoppingCart className="h-7 w-7" />
              Your Cart
            </CardTitle>
            <CardDescription>Review your selected cleaning services before proceeding to checkout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Your cart is empty.</p>
                <Link href="/calculator">
                  <Button className="mt-4">Start Building Your Cleaning Plan</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItemDisplay
                      key={item.id}
                      item={item}
                      onQuantityChange={updateItemQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Apply Coupon</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={localCouponCode}
                      onChange={(e) => setLocalCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                  {couponDiscount > 0 && (
                    <p className="text-sm text-green-600">
                      Coupon "{couponCode}" applied: -${couponDiscount.toFixed(2)}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {cart.fullHouseDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-muted-foreground">Full House Discount:</span>
                      <span className="font-medium">-${cart.fullHouseDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-muted-foreground">Coupon Discount:</span>
                      <span className="font-medium">-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link href="/checkout">
                    <Button size="lg" className="px-8 py-3 rounded-lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
