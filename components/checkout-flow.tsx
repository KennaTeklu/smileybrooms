"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CheckoutFlow() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"cart" | "payment">("cart")
  const router = useRouter()

  // Calculate totals
  const subtotal = cart.totalPrice
  const serviceFee = 25 // Base service fee
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + serviceFee + tax

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(id, quantity)
  }

  const handleStripeCheckout = async () => {
    if (cart.items.length === 0) return

    setIsProcessing(true)
    try {
      // Prepare line items for Stripe
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        metadata: item.metadata || {},
      }))

      // Get customer data from the first item with customer metadata
      const customerItem = cart.items.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: customerData
          ? {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address,
                city: customerData?.city || "",
                state: customerData?.state || "",
                postal_code: customerData?.zipCode || "",
                country: "US",
              },
            }
          : undefined,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinueShopping = () => {
    router.push("/")
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg text-gray-500 mb-6">Add some services to get started</p>
            <Button onClick={handleContinueShopping}>Browse Services</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={handleContinueShopping}>
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Shopping Cart
                  <span className="text-base font-normal ml-2 text-gray-500">
                    ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                    <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl">🧹</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.metadata?.frequency && `${item.metadata.frequency}`}
                        {item.metadata?.rooms &&
                          ` • ${Array.isArray(item.metadata.rooms) ? item.metadata.rooms.join(", ") : item.metadata.rooms}`}
                      </p>
                      {item.metadata?.customer && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.metadata.customer.address}, {item.metadata.customer.city || ""}{" "}
                          {item.metadata.customer.state || ""} {item.metadata.customer.zipCode || ""}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 p-0 h-6"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  onClick={handleStripeCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Checkout with Stripe
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
