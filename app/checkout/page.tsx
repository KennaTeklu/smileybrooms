"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, CreditCard, Shield, Truck, Clock, MapPin, User } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import AccessibilityToolbar from "@/components/accessibility-toolbar"

type CustomerData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

type PaymentMethod = "card" | "paypal" | "apple_pay" | "google_pay"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
    },
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
    }
  }, [cart.items.length, router])

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08 // 8% tax
  const total = subtotal - videoDiscount + tax

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setCustomerData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setCustomerData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Here you would integrate with Stripe or other payment processor
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and redirect to success
      clearCart()
      router.push("/success")

      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation email shortly.",
      })
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pricing"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order and schedule your cleaning service</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>We'll use this to contact you about your service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={customerData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={customerData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Service Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Service Address
                  </CardTitle>
                  <CardDescription>Where should we provide the cleaning service?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address1">Street Address</Label>
                    <Input
                      id="address1"
                      value={customerData.address.line1}
                      onChange={(e) => handleInputChange("address.line1", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="address2"
                      value={customerData.address.line2}
                      onChange={(e) => handleInputChange("address.line2", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={customerData.address.city}
                        onChange={(e) => handleInputChange("address.city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={customerData.address.state}
                        onChange={(e) => handleInputChange("address.state", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">ZIP Code</Label>
                      <Input
                        id="postalCode"
                        value={customerData.address.postalCode}
                        onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Credit or Debit Card</span>
                          <div className="flex space-x-2">
                            <Badge variant="outline">Visa</Badge>
                            <Badge variant="outline">Mastercard</Badge>
                            <Badge variant="outline">Amex</Badge>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>PayPal</span>
                          <Badge variant="outline">PayPal</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="apple_pay" id="apple_pay" />
                      <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Apple Pay</span>
                          <Badge variant="outline">Apple Pay</Badge>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Stripe Elements Placeholder */}
                  <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Stripe Payment Elements
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        This is where the Stripe payment form will be embedded
                      </p>
                      <div className="mt-4 text-sm text-gray-400">
                        {/* Placeholder for Stripe Elements */}
                        <div className="space-y-3">
                          <div className="h-10 bg-white dark:bg-gray-700 border rounded-md flex items-center px-3">
                            <span className="text-gray-500">Card number placeholder</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-10 bg-white dark:bg-gray-700 border rounded-md flex items-center px-3">
                              <span className="text-gray-500">MM/YY</span>
                            </div>
                            <div className="h-10 bg-white dark:bg-gray-700 border rounded-md flex items-center px-3">
                              <span className="text-gray-500">CVC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Options</CardTitle>
                  <CardDescription>Additional preferences for your service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="videoRecording"
                      checked={allowVideoRecording}
                      onCheckedChange={setAllowVideoRecording}
                    />
                    <Label htmlFor="videoRecording" className="text-sm">
                      Allow video recording for quality assurance and social media use
                      <span className="text-green-600 font-medium ml-2">
                        (Save {videoDiscount > 0 ? formatCurrency(videoDiscount) : "10%"})
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full" disabled={isProcessing || !agreeToTerms}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Complete Order - {formatCurrency(total)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{cart.items.length} item(s) in your cart</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64 mb-4">
                  <div className="space-y-3">
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.metadata?.frequency && (
                            <p className="text-xs text-muted-foreground">
                              {item.metadata.frequency.replace(/_/g, " ")}
                            </p>
                          )}
                          {item.metadata?.rooms && (
                            <p className="text-xs text-muted-foreground">{item.metadata.rooms} rooms</p>
                          )}
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {videoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Video Recording Discount</span>
                      <span>-{formatCurrency(videoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="mr-2 h-4 w-4" />
                    Service within 24-48 hours
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Flexible scheduling available
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Shield className="mr-2 h-4 w-4" />
                    100% satisfaction guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
