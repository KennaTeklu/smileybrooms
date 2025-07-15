"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Package,
  Shield,
  MapPin,
  CreditCard,
  Check,
  Tag,
  User,
  Phone,
  Mail,
  Home,
  Calendar,
  DollarSign,
  Gift,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { createCheckoutSession } from "@/lib/actions"
import type { CheckoutData } from "@/lib/types"
import { requiresEmailPricing, CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"

interface ReviewStepProps {
  checkoutData: CheckoutData
  onPrevious: () => void
}

export default function ReviewStep({ checkoutData, onPrevious }: ReviewStepProps) {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponApplied, setCouponApplied] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const { contact: contactData, address: addressData, payment: paymentData } = checkoutData

  // Filter items for online payment
  const onlinePaymentItems = cart.items.filter((item) => item.paymentType !== "in_person")
  const inPersonPaymentItems = cart.items.filter((item) => item.paymentType === "in_person")

  // Calculate totals for online payment
  const subtotalOnline = onlinePaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = paymentData?.allowVideoRecording ? (subtotalOnline >= 250 ? 25 : subtotalOnline * 0.1) : 0
  const totalBeforeTaxOnline = subtotalOnline - videoDiscount - couponDiscount
  const tax = totalBeforeTaxOnline * 0.08 // 8% tax
  const totalOnline = totalBeforeTaxOnline + tax

  // Total for in-person payment
  const totalInPerson = inPersonPaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    // Reset coupon discount if cart items or other discounts change
    setCouponDiscount(0)
    setCouponCode("")
    setCouponError(null)
    setCouponApplied(false)
  }, [cart.items, videoDiscount])

  const handleApplyCoupon = () => {
    setCouponError(null)
    // Simulate coupon application
    if (couponCode.toLowerCase() === "v0discount") {
      const discountAmount = Math.min(totalBeforeTaxOnline * 0.15, 50) // 15% off, max $50
      setCouponDiscount(discountAmount)
      setCouponApplied(true)
      toast({
        title: "🎉 Coupon Applied!",
        description: `You saved ${formatCurrency(discountAmount)} with code "${couponCode}".`,
      })
    } else if (couponCode.toLowerCase() === "welcome10") {
      const discountAmount = Math.min(totalBeforeTaxOnline * 0.1, 30) // 10% off, max $30
      setCouponDiscount(discountAmount)
      setCouponApplied(true)
      toast({
        title: "🎉 Welcome Discount Applied!",
        description: `You saved ${formatCurrency(discountAmount)} with your welcome code!`,
      })
    } else if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code.")
    } else {
      setCouponDiscount(0)
      setCouponApplied(false)
      setCouponError("Invalid coupon code. Please try again.")
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!contactData || !addressData || !paymentData) {
      toast({
        title: "Missing Information",
        description: "Please complete all previous steps before checkout.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Prepare line items for Stripe (only online payment items)
      const customLineItems = onlinePaymentItems.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.metadata?.description || `Service: ${item.name}`,
        images: item.image ? [item.image] : [],
        metadata: {
          itemId: item.id,
          ...item.metadata,
        },
      }))

      // Add video discount if applicable
      if (videoDiscount > 0) {
        customLineItems.push({
          name: "Video Recording Discount",
          amount: -videoDiscount, // Negative amount for discount
          quantity: 1,
          description: "Discount for allowing video recording during service",
        })
      }

      // Add coupon discount if applicable
      if (couponDiscount > 0) {
        customLineItems.push({
          name: `Coupon Discount: ${couponCode}`,
          amount: -couponDiscount, // Negative amount for discount
          quantity: 1,
          description: `Discount applied with coupon code: ${couponCode}`,
        })
      }

      setProcessingProgress(50)

      // Create checkout session with Stripe
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: contactData.email,
        customerData: {
          name: `${contactData.firstName} ${contactData.lastName}`,
          email: contactData.email,
          phone: contactData.phone,
          address: {
            line1: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.zipCode,
            country: "US",
          },
        },
        allowPromotions: true,
        paymentMethodTypes: paymentData.paymentMethod === "card" ? ["card"] : undefined,
      })

      setProcessingProgress(90)

      if (checkoutUrl) {
        setProcessingProgress(100)

        // Clear checkout data from localStorage
        localStorage.removeItem("checkout-contact")
        localStorage.removeItem("checkout-address")
        localStorage.removeItem("checkout-payment")
        clearCart() // Clear cart after successful checkout initiation

        // Small delay to show completion
        setTimeout(() => {
          window.location.href = checkoutUrl
        }, 500)
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      if (!isProcessing) {
        setIsProcessing(false)
        setProcessingProgress(0)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Review Your Order
              </CardTitle>
              <CardDescription className="text-lg mt-1">Final step - review and complete your purchase</CardDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {[
              { step: 1, label: "Contact", completed: true },
              { step: 2, label: "Address", completed: true },
              { step: 3, label: "Payment", completed: true },
              { step: 4, label: "Review", completed: false, current: true },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                    item.completed
                      ? "bg-green-500 text-white"
                      : item.current
                        ? "bg-blue-500 text-white ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {item.completed ? <Check className="h-4 w-4" /> : item.step}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    item.current ? "text-blue-600" : item.completed ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
                {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </CardHeader>
      </motion.div>

      <CardContent className="space-y-8">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl">Order Summary</span>
                  <Badge variant="secondary" className="ml-3">
                    {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center py-4 px-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-2 rounded-lg">
                            <Sparkles className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                              {item.metadata?.frequency && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>Frequency: {item.metadata.frequency.replace(/_/g, " ")}</span>
                                </div>
                              )}
                              {item.metadata?.rooms && (
                                <div className="flex items-center gap-2">
                                  <Home className="h-3 w-3" />
                                  <span>Rooms: {item.metadata.rooms}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3" />
                                <span>Quantity: {item.quantity}</span>
                              </div>
                              {item.paymentType === "in_person" && (
                                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                  Payment in person
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.paymentType === "in_person" || requiresEmailPricing(item.metadata?.roomType) ? (
                          <div className="text-orange-600 font-semibold">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email for Pricing
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Separator className="my-8" />

              {/* Coupon Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Promo Code</h3>
                  {couponApplied && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Gift className="h-3 w-3 mr-1" />
                      Applied
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Enter promo code (try: V0DISCOUNT)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className={`pr-10 ${couponError ? "border-red-500 focus:border-red-500" : couponApplied ? "border-green-500 focus:border-green-500" : ""}`}
                      disabled={isProcessing}
                    />
                    {couponApplied && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {couponError && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isProcessing || !couponCode.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Apply
                  </Button>
                </div>

                <AnimatePresence>
                  {couponError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {couponError}
                    </motion.p>
                  )}
                  {couponApplied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-green-600 text-sm flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Promo code applied: -{formatCurrency(couponDiscount)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <Separator className="my-8" />

              {/* Pricing Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Subtotal (Online Payment)
                      </span>
                      <span className="font-semibold">{formatCurrency(subtotalOnline)}</span>
                    </div>

                    <AnimatePresence>
                      {videoDiscount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-lg text-green-600"
                        >
                          <span className="flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            Video Recording Discount
                          </span>
                          <span className="font-semibold">-{formatCurrency(videoDiscount)}</span>
                        </motion.div>
                      )}

                      {couponDiscount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-lg text-green-600"
                        >
                          <span className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Promo Discount
                          </span>
                          <span className="font-semibold">-{formatCurrency(couponDiscount)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center text-lg">
                      <span>Tax (8%)</span>
                      <span className="font-semibold">{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-green-600">Total (Online Payment)</span>
                    <span className="text-green-600">{formatCurrency(totalOnline)}</span>
                  </div>

                  {totalInPerson > 0 && (
                    <div className="flex justify-between items-center text-xl font-bold text-orange-600 mt-4 pt-4 border-t border-orange-200">
                      <span className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Custom Services
                      </span>
                      <span>Email for Pricing</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer & Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Contact & Address Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 pl-6">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {contactData.firstName} {contactData.lastName}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{contactData.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{contactData.phone}</span>
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Address Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-500" />
                    Service Address
                  </h4>
                  <div className="space-y-2 pl-6">
                    <p className="font-medium">{addressData.fullName}</p>
                    <p>{addressData.address}</p>
                    {addressData.address2 && <p>{addressData.address2}</p>}
                    <p>
                      {addressData.city}, {addressData.state} {addressData.zipCode}
                    </p>

                    {addressData.specialInstructions && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <p className="font-medium text-sm text-gray-600 mb-1">Special Instructions:</p>
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            {addressData.specialInstructions}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/10">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {paymentData.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : paymentData.paymentMethod === "paypal"
                          ? "PayPal"
                          : paymentData.paymentMethod === "apple"
                            ? "Apple Pay"
                            : "Google Pay"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {paymentData.paymentMethod === "card"
                        ? "Visa, Mastercard, American Express"
                        : paymentData.paymentMethod === "paypal"
                          ? "Pay with your PayPal account"
                          : "Touch ID or Face ID"}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Billing address same as service address</span>
                  </div>
                  {paymentData.allowVideoRecording && (
                    <div className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Video recording discount applied</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Processing Progress */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="w-96 p-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
                  <h3 className="text-lg font-semibold">Processing Your Order</h3>
                  <Progress value={processingProgress} className="w-full" />
                  <p className="text-sm text-gray-600">
                    {processingProgress < 30
                      ? "Preparing your order..."
                      : processingProgress < 60
                        ? "Contacting payment processor..."
                        : processingProgress < 90
                          ? "Securing your transaction..."
                          : "Redirecting to checkout..."}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-between gap-4 pt-8"
        >
          <Button
            variant="outline"
            size="lg"
            className="px-8 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onPrevious}
            disabled={isProcessing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>

          <Button
            onClick={handleCheckout}
            size="lg"
            className="flex-1 sm:flex-none h-16 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Processing Your Order...
              </>
            ) : (
              <>
                <Shield className="mr-3 h-5 w-5" />
                {totalInPerson > 0
                  ? `Complete Online Payment - ${formatCurrency(totalOnline)}`
                  : `Complete Order - ${formatCurrency(totalOnline)}`}
              </>
            )}
          </Button>
        </motion.div>

        {/* Legal Disclaimers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 text-center"
        >
          {totalInPerson > 0 && (
            <p className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {CUSTOM_SPACE_LEGAL_DISCLAIMER}
            </p>
          )}

          <p className="text-sm text-gray-500">
            <Lock className="h-4 w-4 inline mr-1" />
            By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy. Your payment information
            is encrypted and secure.
          </p>
        </motion.div>
      </CardContent>
    </motion.div>
  )
}
