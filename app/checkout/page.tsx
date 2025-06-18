"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { DynamicPaymentSelector } from "@/components/dynamic-payment-selector" // Import the dynamic payment selector
import { toast } from "@/components/ui/use-toast"
import { useDeviceDetection } from "@/hooks/use-device-detection" // For device-specific UI
import { useNetworkStatus } from "@/hooks/use-network-status" // For network status
import { useVibration } from "@/hooks/use-vibration" // For haptic feedback
import { useForm } from "@/hooks/use-form" // For form management
import { useFormValidation } from "@/hooks/use-form-validation" // For form validation
import { useAnalytics } from "@/hooks/use-analytics" // For analytics tracking
import { useUserSegment } from "@/hooks/use-user-segment" // For user segmentation
import { useFeatureFlag } from "@/hooks/use-feature-flag" // For feature flags
import { useNotifications } from "@/hooks/use-notifications" // For notification opt-in

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { isOnline } = useNetworkStatus()
  const { vibrate } = useVibration()
  const { trackEvent } = useAnalytics()
  const { deviceType } = useDeviceDetection()
  const { segment } = useUserSegment()
  const enableNotificationDiscount = useFeatureFlag("enableNotificationDiscount", false) // Feature flag for discount
  const { requestPermission, sendNotification } = useNotifications()

  const [optInNotifications, setOptInNotifications] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

  const { formData, handleChange, setFormData } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const { errors, validateField, validateForm } = useFormValidation(formData, {
    firstName: (value) => (value ? null : "First name is required"),
    lastName: (value) => (value ? null : "Last name is required"),
    email: (value) => (value && /\S+@\S+\.\S+/.test(value) ? null : "Valid email is required"),
    phone: (value) => (value && /^\d{10}$/.test(value) ? null : "Valid 10-digit phone is required"),
    address: (value) => (value ? null : "Address is required"),
    city: (value) => (value ? null : "City is required"),
    state: (value) => (value ? null : "State is required"),
    zip: (value) => (value && /^\d{5}$/.test(value) ? null : "Valid 5-digit zip is required"),
  })

  useEffect(() => {
    if (cart.totalItems === 0) {
      router.push("/calculator") // Redirect if cart is empty
    }
    trackEvent("page_view", { page: "checkout" })
  }, [cart.totalItems, router, trackEvent])

  const subtotal = useMemo(() => cart.totalPrice, [cart.totalPrice])
  const notificationDiscount = useMemo(
    () => (optInNotifications && enableNotificationDiscount ? 0.99 : 0),
    [optInNotifications, enableNotificationDiscount],
  )
  const total = useMemo(() => Math.max(0, subtotal - notificationDiscount), [subtotal, notificationDiscount])

  const handlePlaceOrder = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      vibrate(200)
      return
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Required",
        description: "Please select a payment method.",
        variant: "destructive",
      })
      vibrate(200)
      return
    }

    setIsProcessing(true)
    vibrate(50)
    trackEvent("checkout_initiated", {
      cart_items: cart.totalItems,
      total_price: total,
      payment_method: paymentMethod,
      user_segment: segment,
    })

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // If notifications opted in, request permission and send
      if (optInNotifications) {
        const permission = await requestPermission()
        if (permission === "granted") {
          sendNotification("😊smileybrooms.com is waiting for you!", {
            body: "Your order has been placed successfully!",
            icon: "/favicon.png",
          })
        }
      }

      clearCart()
      trackEvent("checkout_completed", {
        cart_items: cart.totalItems,
        final_price: total,
        payment_method: paymentMethod,
        user_segment: segment,
      })
      router.push("/success")
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      vibrate(300)
      trackEvent("checkout_failed", { error: (error as Error).message })
    } finally {
      setIsProcessing(false)
    }
  }, [
    validateForm,
    paymentMethod,
    isOnline,
    vibrate,
    trackEvent,
    cart.totalItems,
    total,
    segment,
    optInNotifications,
    requestPermission,
    sendNotification,
    clearCart,
    router,
  ])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => validateField("firstName")}
                  placeholder="John"
                  autoComplete="given-name"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => validateField("lastName")}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => validateField("email")}
                placeholder="john.doe@example.com"
                autoComplete="email"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => validateField("phone")}
                placeholder="123-456-7890"
                autoComplete="tel"
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={() => validateField("address")}
                placeholder="123 Main St"
                autoComplete="street-address"
                required
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => validateField("city")}
                  placeholder="Anytown"
                  autoComplete="address-level2"
                  required
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={() => validateField("state")}
                  placeholder="CA"
                  autoComplete="address-level1"
                  required
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  onBlur={() => validateField("zip")}
                  placeholder="90210"
                  autoComplete="postal-code"
                  required
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Payment */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {enableNotificationDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Notification Opt-in Discount</span>
                  <span>-{formatCurrency(notificationDiscount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DynamicPaymentSelector onSelectPayment={setPaymentMethod} selectedPayment={paymentMethod} />
              {enableNotificationDiscount && (
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="optInNotifications"
                    checked={optInNotifications}
                    onCheckedChange={(checked) => setOptInNotifications(Boolean(checked))}
                  />
                  <Label
                    htmlFor="optInNotifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Opt-in for notifications and get ${notificationDiscount.toFixed(2)} off!
                  </Label>
                </div>
              )}
              <Button onClick={handlePlaceOrder} className="w-full" disabled={isProcessing || !isOnline}>
                {isProcessing ? "Processing..." : `Place Order ${formatCurrency(total)}`}
              </Button>
              {!isOnline && (
                <p className="text-red-500 text-sm text-center mt-2">You are offline. Please check your connection.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
