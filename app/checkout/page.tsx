"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CartSummary } from "@/components/cart-summary"
import { CheckoutProgress } from "@/components/checkout-progress"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import { OneClickBooking } from "@/components/one-click-booking"
import Image from "next/image"

// Mock customer profile for demonstration
const MOCK_CUSTOMER_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  phone: "(123) 456-7890",
  addresses: [
    {
      id: "addr1",
      name: "Home",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Office",
      address: "456 Park Ave",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: "pm1",
      type: "visa",
      last4: "4242",
      expiry: "04/24",
      isDefault: true,
    },
    {
      id: "pm2",
      type: "mastercard",
      last4: "5555",
      expiry: "05/25",
      isDefault: false,
    },
  ],
}

// Define checkout steps
const CHECKOUT_STEPS = [
  { id: "information", label: "Information", description: "Your details" },
  { id: "payment", label: "Payment", description: "Payment method" },
  { id: "confirmation", label: "Confirmation", description: "Review order" },
]

export default function CheckoutPage() {
  const { cart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState("information")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isReturningCustomer, setIsReturningCustomer] = useState(false)
  const [showOneClickBooking, setShowOneClickBooking] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Calculate tax and total
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  // Check if user is a returning customer (in a real app, this would be based on authentication)
  useEffect(() => {
    // Simulate checking if user is logged in and has saved payment methods
    const checkReturningCustomer = () => {
      // For demo purposes, we'll randomly decide if the user is returning
      const isReturning = Math.random() > 0.5
      setIsReturningCustomer(isReturning)

      // If returning and has at least one item in cart, show one-click booking option
      if (isReturning && cart.items.length > 0) {
        setShowOneClickBooking(true)
      }
    }

    checkReturningCustomer()
  }, [cart.items.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAddressSelect = (addressDetails: any) => {
    setCustomerInfo((prev) => ({
      ...prev,
      address: addressDetails.address,
      city: addressDetails.city,
      state: addressDetails.state,
      zipCode: addressDetails.zipCode,
    }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name) errors.name = "Name is required"
    if (!customerInfo.email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) errors.email = "Email is invalid"

    if (!customerInfo.address) errors.address = "Address is required"
    if (!customerInfo.city) errors.city = "City is required"
    if (!customerInfo.state) errors.state = "State is required"
    if (!customerInfo.zipCode) errors.zipCode = "ZIP code is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === "information") {
      if (!validateForm()) return

      setCompletedSteps((prev) => [...prev, "information"])
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCompletedSteps((prev) => [...prev, "payment"])
      setCurrentStep("confirmation")
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("information")
    } else if (currentStep === "confirmation") {
      setCurrentStep("payment")
    }
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

  const handleOneClickSuccess = () => {
    // In a real app, this would redirect to success page after one-click booking
    router.push("/success")
  }

  // If showing one-click booking and user chooses to use it
  if (showOneClickBooking) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8">
          <OneClickBooking
            serviceTotal={subtotal}
            serviceName={cart.items[0]?.name || "Cleaning Service"}
            customerProfile={MOCK_CUSTOMER_PROFILE}
            onSuccess={handleOneClickSuccess}
            onCancel={() => setShowOneClickBooking(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <CheckoutProgress
        steps={CHECKOUT_STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        className="mb-8"
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Form */}
        <div className="space-y-6">
          {currentStep === "information" && (
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
                    className={formErrors.name ? "border-red-500" : ""}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
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
                    className={formErrors.email ? "border-red-500" : ""}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
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

                <AddressAutocomplete
                  value={customerInfo.address}
                  onChange={(value) => handleInputChange({ target: { name: "address", value } } as any)}
                  onAddressSelect={handleAddressSelect}
                  label="Address"
                  required
                  error={formErrors.address}
                />

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
                      className={formErrors.city ? "border-red-500" : ""}
                      aria-invalid={!!formErrors.city}
                      aria-describedby={formErrors.city ? "city-error" : undefined}
                    />
                    {formErrors.city && (
                      <p id="city-error" className="text-sm text-red-500">
                        {formErrors.city}
                      </p>
                    )}
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
                      className={formErrors.state ? "border-red-500" : ""}
                      aria-invalid={!!formErrors.state}
                      aria-describedby={formErrors.state ? "state-error" : undefined}
                    />
                    {formErrors.state && (
                      <p id="state-error" className="text-sm text-red-500">
                        {formErrors.state}
                      </p>
                    )}
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
                    className={formErrors.zipCode ? "border-red-500" : ""}
                    aria-invalid={!!formErrors.zipCode}
                    aria-describedby={formErrors.zipCode ? "zipCode-error" : undefined}
                  />
                  {formErrors.zipCode && (
                    <p id="zipCode-error" className="text-sm text-red-500">
                      {formErrors.zipCode}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors border-blue-500 bg-blue-50">
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="text-sm">Card</span>
                      <Check className="h-4 w-4 text-blue-500 mt-1" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors opacity-50">
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600 font-bold">Pay</span>
                      <span className="text-blue-800 font-bold -mt-1">Pal</span>
                      <span className="text-xs text-gray-500 mt-1">Coming soon</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors opacity-50">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">Apple</span>
                      <span className="font-medium -mt-1">Pay</span>
                      <span className="text-xs text-gray-500 mt-1">Coming soon</span>
                    </div>
                  </div>
                </div>

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
          )}

          {currentStep === "confirmation" && (
            <Card>
              <CardHeader>
                <CardTitle>Order Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{customerInfo.name}</p>
                    <p>{customerInfo.email}</p>
                    {customerInfo.phone && <p>{customerInfo.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Service Address</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{customerInfo.address}</p>
                    <p>
                      {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-md flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Credit Card (processed by Stripe)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            {currentStep !== "information" ? (
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep !== "confirmation" ? (
              <Button onClick={handleNextStep}>Continue</Button>
            ) : (
              <Button className="w-full py-6 text-lg" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>Complete Order • {formatCurrency(total)}</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right side - Order Summary */}
        <div>
          <CartSummary showControls={false} />

          {isReturningCustomer && !showOneClickBooking && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full" onClick={() => setShowOneClickBooking(true)}>
                  Use Saved Payment Method
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
