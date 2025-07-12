"use client"

import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { MinusCircle, PlusCircle, Trash2, ShoppingCart } from "lucide-react"
import { CouponInput } from "@/components/coupon-input" // Import CouponInput

export default function CartPage() {
  const { cart, updateItemQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (id: string, change: number) => {
    const item = cart.items.find((i) => i.id === id)
    if (item) {
      updateItemQuantity(id, item.quantity + change)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 dark:bg-gray-950 p-4">
        <ShoppingCart className="h-24 w-24 text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Your Cart is Empty</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
          Looks like you haven't added any cleaning services yet.
        </p>
        <Link href="/pricing" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Building Your Plan
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 shadow-sm">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                <Image
                  src={item.image || "/placeholder.svg?height=100&width=100"}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{item.name}</h2>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                )}
                <p className="text-lg font-bold text-primary mt-2">{formatCurrency(item.price)}</p>
                {item.metadata && item.metadata.serviceType && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Service Type: {item.metadata.serviceType.toUpperCase()}
                  </p>
                )}
                {item.metadata && item.metadata.frequency && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Frequency: {item.metadata.frequency}</p>
                )}
              </div>
              <div className="flex items-center mt-4 sm:mt-0 sm:ml-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="mx-3 text-lg font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, 1)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="ml-4 text-red-500">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
              <CardDescription>Review your selections before proceeding to checkout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.rawSubtotal)}</span>
              </div>
              {cart.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>Coupon ({cart.appliedCoupon})</span>
                  <span>-{formatCurrency(cart.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal (after discount)</span>
                <span>{formatCurrency(cart.subtotalAfterDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Link href="/checkout" passHref className="w-full">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/pricing" passHref className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Coupon Input */}
          <div className="mt-8">
            <CouponInput />
          </div>
        </div>
      </div>
    </div>
  )
}
