"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { cart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay">("card")

  // Calculate totals
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // Example tax rate
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add services to your cart before checking out",
        variant: "destructive",
      })
      return
    }

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
                city: customerData.city || "",
                state: customerData.state || "",
                postal_code: customerData.zipCode || "",
                country: "US",
              },
            }
          : undefined,
      })

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Order summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.25%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side - Payment details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="text-sm">Card</span>
                      {paymentMethod === "card" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600 font-bold">Pay</span>
                      <span className="text-blue-800 font-bold -mt-1">Pal</span>
                      {paymentMethod === "paypal" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "applepay" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("applepay")}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">Apple</span>
                      <span className="font-medium -mt-1">Pay</span>
                      {paymentMethod === "applepay" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full py-6 text-lg"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.items.length === 0}
                >
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Your payment is processed securely through Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
