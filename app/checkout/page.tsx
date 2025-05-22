"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CartSummary } from "@/components/cart-summary"
import Image from "next/image"

export default function CheckoutPage() {
  const { cart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay">("card")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Calculate tax and total
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add services to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
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

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            postal_code: customerInfo.zipCode,
            country: "US",
          },
        },
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
        {/* Left side - Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={customerInfo.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
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

              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Your payment will be securely processed by Stripe. We do not store your payment details.
                </p>

                <div className="flex items-center space-x-2 mt-2">
                  <div className="h-8 w-12 relative">
                    <Image
                      src="/visa-logo-generic.png"
                      alt="Visa"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="h-8 w-12 relative">
                    <Image
                      src="/mastercard-logo-abstract.png"
                      alt="Mastercard"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="h-8 w-12 relative">
                    <Image
                      src="/abstract-credit-card-design.png"
                      alt="American Express"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Order Summary */}
        <div className="space-y-6">
          <CartSummary showControls={false} />

          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full py-6 text-lg"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing || cart.items.length === 0}
              >
                {isProcessing ? "Processing..." : `Complete Order • ${formatCurrency(total)}`}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By completing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
