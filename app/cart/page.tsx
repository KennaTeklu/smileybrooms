"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart()
  const cartTotal = calculateTotal()

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="w-full max-w-2xl mx-auto text-center py-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your cart is empty!</CardTitle>
            <CardDescription>Looks like you haven't added any cleaning services yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-6">
              <Link href="/calculator">Start Building Your Service</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center p-4 shadow-md">
                <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=100&width=100&text=Service"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                  <p className="text-md font-bold mt-1">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <Card className="lg:col-span-1 shadow-lg h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Taxes:</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <Button asChild className="w-full text-lg py-3">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
                <Link href="/calculator">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
