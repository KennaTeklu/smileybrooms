"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.08 // Example tax rate
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-gray-600 dark:text-gray-400">Your cart is empty.</p>
            <Link href="/pricing">
              <Button className="mt-6">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center p-4">
                <Image
                  src={item.image || "/placeholder.svg?height=100&width=100&text=Service"}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 text-lg">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-500 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/pricing">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxRate * 100}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
