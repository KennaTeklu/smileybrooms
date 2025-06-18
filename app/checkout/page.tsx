"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CreditCard, Shield, Truck, Clock, MapPin, User, Check, Package } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { createCheckoutSession } from "@/lib/actions"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"

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

type CheckoutStep = "contact" | "address" | "payment" | "review"

const steps = [
  { id: "contact", title: "Contact Info", icon: User },
  { id: "address", title: "Service Address", icon: MapPin },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review Order", icon: Package },
]

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("contact")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])

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
  const [optInNotifications, setOptInNotifications] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart")
    }
  }, [cart.items.length, router])

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const notificationDiscountAmount = optInNotifications ? 0.99 : 0
  const tax = (subtotal - notificationDiscountAmount) * 0.08
  const total = subtotal - notificationDiscountAmount + tax

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

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

  const validateStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case "contact":
        return !!(customerData.firstName && customerData.lastName && customerData.email && customerData.phone)
      case "address":
        return !!(
          customerData.address.line1 &&
          customerData.address.city &&
          customerData.address.state &&
          customerData.address.postalCode
        )
      case "payment":
        return !!paymentMethod
      case "review":
        return agreeToTerms
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      const nextStepIndex = currentStepIndex + 1
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex].id as CheckoutStep)
      }
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Fill in all the required information before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id as CheckoutStep)
    }
  }

  const handleStepClick = (stepId: CheckoutStep) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId)
    const currentIndex = steps.findIndex((step) => step.id === currentStep)

    if (stepIndex <= currentIndex || (stepIndex === currentIndex + 1 && validateStep(currentStep))) {
      setCurrentStep(stepId)
    }
  }

  const handleSubmit = async () => {
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
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.sourceSection,
        metadata: item.metadata,
      }))

      if (notificationDiscountAmount > 0) {
        customLineItems.push({
          name: "Notification Opt-in Discount",
          amount: -notificationDiscountAmount,
          quantity: 1,
          description: "Discount for opting into notifications",
        })
      }

      const checkoutUrl = await createCheckoutSession({
        customLineItems: customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerData.email,
        customerData: {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone,
          address: {
            line1: customerData.address.line1,
            line2: customerData.address.line2,
            city: customerData.address.city,
            state: customerData.address.state,
            postal_code: customerData.address.postalCode,
            country: customerData.address.country,
          },
        },
        paymentMethodTypes: [paymentMethod],
        automaticTax: { enabled: true },
        allowPromotions: true,
        metadata: {
          optInNotifications: optInNotifications ? "true" : "false",
        },
      })

      if (checkoutUrl) {
        clearCart()
        window.location.href = checkoutUrl
      } else {
        throw new Error("Failed to get checkout URL from Stripe.")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
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
    return null
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <User className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We'll use this information to contact you about your cleaning service
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={customerData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="mt-2 h-12"
                    placeholder="John"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={customerData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="mt-2 h-12"
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2 h-12"
                  placeholder="john.doe@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-2 h-12"
                  placeholder="(555) 123-4567"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>
          </motion.div>
        )

      case "address":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <MapPin className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Service Address</h2>
              <p className="text-gray-600 dark:text-gray-400">Where should we provide the cleaning service?</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <Label htmlFor="address1" className="text-base font-medium">
                  Street Address
                </Label>
                <Input
                  id="address1"
                  value={customerData.address.line1}
                  onChange={(e) => handleInputChange("address.line1", e.target.value)}
                  className="mt-2 h-12"
                  placeholder="123 Main Street"
                  required
                  autoComplete="address-line1"
                />
              </div>

              <div>
                <Label htmlFor="address2" className="text-base font-medium">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="address2"
                  value={customerData.address.line2}
                  onChange={(e) => handleInputChange("address.line2", e.target.value)}
                  className="mt-2 h-12"
                  placeholder="Apt 4B"
                  autoComplete="address-line2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-base font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={customerData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    className="mt-2 h-12"
                    placeholder="New York"
                    required
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-base font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={customerData.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    className="mt-2 h-12"
                    placeholder="NY"
                    required
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="postalCode" className="text-base font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="postalCode"
                  value={customerData.address.postalCode}
                  onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                  className="mt-2 h-12"
                  placeholder="10001"
                  required
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </motion.div>
        )

      case "payment":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <CreditCard className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Payment Method</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose how you'd like to pay for your cleaning service</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />

              <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Stripe Payment Elements</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Secure payment form will be embedded here</p>
                  <div className="space-y-4">
                    <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                      <span className="text-gray-500">Card number placeholder</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                        <span className="text-gray-500">MM/YY</span>
                      </div>
                      <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                        <span className="text-gray-500">CVC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case "review":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <Package className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Review Your Order</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please review your order details before completing your purchase
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              {/* Minimal Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary ({cart.totalItems} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cart.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {cart.items.length > 3 && (
                      <div className="text-sm text-muted-foreground">...and {cart.items.length - 3} more items</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer & Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-gray-600">
                      {customerData.firstName} {customerData.lastName}
                    </p>
                    <p className="text-gray-600">{customerData.email}</p>
                    <p className="text-gray-600">{customerData.phone}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Service Address</h4>
                    <p className="text-gray-600">{customerData.address.line1}</p>
                    {customerData.address.line2 && <p className="text-gray-600">{customerData.address.line2}</p>}
                    <p className="text-gray-600">
                      {customerData.address.city}, {customerData.address.state} {customerData.address.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Special Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="optInNotifications"
                      checked={optInNotifications}
                      onCheckedChange={setOptInNotifications}
                    />
                    <Label htmlFor="optInNotifications" className="text-base">
                      Opt-in for notifications and receive a small discount
                      {notificationDiscountAmount > 0 && (
                        <span className="text-green-600 font-medium ml-2">
                          (Save {formatCurrency(notificationDiscountAmount)})
                        </span>
                      )}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} required />
                    <Label htmlFor="terms" className="text-base">
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

              {/* Order Total */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {notificationDiscountAmount > 0 && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>Notification Discount</span>
                        <span>-{formatCurrency(notificationDiscountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg">
                      <span>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Secure Checkout</h1>
            <p className="text-xl text-muted-foreground mb-8">Complete your order in just a few simple steps</p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <Progress value={progress} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = completedSteps.includes(step.id as CheckoutStep)
                const isClickable = index <= currentStepIndex || isCompleted

                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && handleStepClick(step.id as CheckoutStep)}
                    disabled={!isClickable}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : isCompleted
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : isClickable
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    <span className="font-medium hidden sm:block">{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          {currentStepIndex > 0 && (
            <Button variant="outline" size="lg" onClick={handlePrevious} className="px-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {currentStep !== "review" ? (
            <Button size="lg" onClick={handleNext} disabled={!validateStep(currentStep)} className="px-8">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isProcessing || !agreeToTerms}
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Complete Order - {formatCurrency(total)}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Service within 24-48 hours
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              100% Satisfaction Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
