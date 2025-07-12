"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import CouponInput from "@/components/coupon-input" // Import CouponInput

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity } = useCart()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateItemQuantity(itemId, newQuantity)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <ShoppingCart className="h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
          Looks like you haven't added any services yet.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="px-8 py-3">
            Start Building Your Cleaning Plan
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          href="/pricing"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>

        <h1 className="text-4xl font-bold text-center mb-10">Your Cleaning Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="flex items-center p-4 shadow-sm">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80&text=Service"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                      <p className="text-lg font-bold mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cart.rawSubtotal)}</span>
                </div>
                {cart.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon ({cart.appliedCoupon}):</span>
                    <span>-{formatCurrency(cart.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal after discount:</span>
                  <span>{formatCurrency(cart.subtotalAfterDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>{formatCurrency(cart.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>

                {/* Coupon Input */}
                <CouponInput />
              </CardContent>
              <CardFooter>
                <Link href="/checkout" className="w-full">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
