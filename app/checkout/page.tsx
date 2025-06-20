"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CreditCard, Shield, Truck, Clock, MapPin, Check, Package, Calendar } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { createCheckoutSession } from "@/lib/actions" // Import the server action

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth"
import { initializeApp, getApps, getApp } from "firebase/app"
import { FrequencySelector } from "@/components/frequency-selector"
import { InlineAddressForm, type AddressFormData } from "@/components/inline-address-form"
import { usePricingContext } from "@/contexts/pricing-context"
import { STRATEGIC_ADDONS, PREMIUM_EXCLUSIVE_SERVICES } from "@/lib/pricing-config"

type PaymentMethod = "card" | "paypal" | "apple_pay" | "google_pay"

type CheckoutStep = "service_config" | "contact_address" | "payment" | "review"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6-06eF-9sbElj_WBJSPyAHSScbLkr-5Q",
  authDomain: "authentication-1affb.firebaseapp.com",
  projectId: "authentication-1affb",
  storageBucket: "authentication-1affb.firebasestorage.app",
  messagingSenderId: "990305079253",
  appId: "1:990305079253:web:419522b1045262f0e3b75c",
  measurementId: "G-N4F17SYW6G",
}

// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const steps = [
  { id: "service_config", title: "Service Details", icon: Calendar },
  { id: "contact_address", title: "Contact & Address", icon: MapPin },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review Order", icon: Package },
]

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { selectedFrequency, setSelectedFrequency, roomConfigs } = usePricingContext()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("service_config")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])

  const [customerFormData, setCustomerFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
    allowVideoRecording: false,
  })
  const [isCustomerDataSaved, setIsCustomerDataSaved] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false)
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
    }
  }, [cart.items.length, router])

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    let itemPrice = item.price * item.quantity
    // Apply add-on prices if they are part of the item's metadata
    if (item.metadata?.selectedAddOns && Array.isArray(item.metadata.selectedAddOns)) {
      item.metadata.selectedAddOns.forEach((addOnId: string) => {
        const addOn =
          STRATEGIC_ADDONS.find((a) => a.id === addOnId) || PREMIUM_EXCLUSIVE_SERVICES.find((a) => a.id === addOnId)
        if (addOn) {
          // Assuming add-on price is fixed or based on standard tier if not specified
          const addOnPrice = addOn.prices ? addOn.prices.standard : addOn.price
          itemPrice += addOnPrice * item.quantity // Apply add-on price per quantity of the room
        }
      })
    }
    return sum + itemPrice
  }, 0)

  const frequencyDiscountRate = selectedFrequency
    ? selectedFrequency === "one_time"
      ? 0
      : selectedFrequency === "weekly"
        ? 0.15
        : selectedFrequency === "biweekly"
          ? 0.1
          : 0.05
    : 0
  const frequencyDiscountAmount = subtotal * frequencyDiscountRate

  const videoDiscountAmount = customerFormData.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - frequencyDiscountAmount - videoDiscountAmount) * 0.08 // 8% tax
  const total = subtotal - frequencyDiscountAmount - videoDiscountAmount + tax

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleCustomerFormChange = useCallback((data: AddressFormData) => {
    setCustomerFormData(data)
    setIsCustomerDataSaved(false)
  }, [])

  const handleCustomerFormSubmit = useCallback(() => {
    setIsCustomerDataSaved(true)
    toast({
      title: "Information Saved",
      description: "Your contact and address details have been saved.",
      duration: 3000,
    })
  }, [toast])

  const validateStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case "service_config":
        return !!selectedFrequency
      case "contact_address":
        // Validate using InlineAddressForm's internal validation logic
        // For simplicity here, we'll just check if it's marked as saved
        return isCustomerDataSaved
      case "payment":
        return !!paymentMethod
      case "review":
        return agreeToTerms && (isPhoneVerified || isGoogleAuthenticated)
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

    // Allow going back to completed steps or the next step if current is valid
    if (stepIndex <= currentIndex || (stepIndex === currentIndex + 1 && validateStep(currentStep))) {
      setCurrentStep(stepId)
    }
  }

  useEffect(() => {
    if (currentStep === "review" && !isPhoneVerified && !isGoogleAuthenticated) {
      if (recaptchaRef.current && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: "invisible",
          callback: (response: any) => {
            // reCAPTCHA solved, this callback is fired.
            console.log("Recaptcha solved!")
          },
          "expired-callback": () => {
            console.log("Recaptcha expired!")
            toast({
              title: "Verification Expired",
              description: "Please re-verify your phone number.",
              variant: "destructive",
            })
            if (window.grecaptcha) {
              window.grecaptcha.reset(window.recaptchaVerifier.widgetId)
            }
          },
        })
        window.recaptchaVerifier.render().then((widgetId: number) => {
          // Store widget ID if needed for manual reset
          window.recaptchaVerifier.widgetId = widgetId
        })
      }
    }
  }, [currentStep, isPhoneVerified, isGoogleAuthenticated, auth, toast])

  const handleSendOtp = async () => {
    if (!customerFormData.phone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to verify.",
        variant: "destructive",
      })
      return
    }

    setIsPhoneVerifying(true)
    try {
      // Firebase expects phone numbers in E.164 format (e.g., +15551234567)
      const phoneNumber = customerFormData.phone.startsWith("+")
        ? customerFormData.phone
        : `+1${customerFormData.phone.replace(/\D/g, "")}` // Assuming US numbers, adjust as needed

      const appVerifier = window.recaptchaVerifier

      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      setConfirmationResult(result)
      setShowOtpInput(true)
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${phoneNumber}.`,
      })
      setIsGoogleAuthenticated(false) // Reset Google auth if phone verification is initiated
    } catch (error: any) {
      console.error("Error sending OTP:", error)
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please check your phone number and try again.",
        variant: "destructive",
      })
      if (window.grecaptcha && window.recaptchaVerifier) {
        window.grecaptcha.reset(window.recaptchaVerifier.widgetId)
      }
    } finally {
      setIsPhoneVerifying(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code.",
        variant: "destructive",
      })
      return
    }
    if (!confirmationResult) {
      toast({
        title: "Error",
        description: "No verification request found. Please send code again.",
        variant: "destructive",
      })
      return
    }

    setIsPhoneVerifying(true)
    try {
      await confirmationResult.confirm(otp)
      setIsPhoneVerified(true)
      toast({
        title: "Phone Number Verified!",
        description: "Your phone number has been successfully verified.",
      })
      setIsGoogleAuthenticated(false) // Reset Google auth if phone verification succeeds
      setShowOtpInput(false) // Hide OTP input
      setOtp("") // Clear OTP
    } catch (error: any) {
      console.error("Error verifying OTP:", error)
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPhoneVerifying(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleAuthenticating(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Auto-fill customer data from Google profile if available
      if (user.displayName) {
        const nameParts = user.displayName.split(" ")
        setCustomerFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || prev.email,
        }))
      }

      setIsGoogleAuthenticated(true)
      toast({
        title: "Signed in with Google!",
        description: "Your Google account has been linked successfully.",
      })
      setIsPhoneVerified(false) // Reset phone verification if Google auth succeeds
      setShowOtpInput(false) // Hide OTP input
      setOtp("") // Clear OTP
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleAuthenticating(false)
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
    // Check if either phone is verified OR Google is authenticated
    if (!isPhoneVerified && !isGoogleAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please verify your phone number or sign in with Google before completing the order.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Prepare line items from cart
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price, // Base price per unit
        quantity: item.quantity,
        description: item.sourceSection,
        metadata: item.metadata,
      }))

      // Add frequency discount as a line item if applicable
      if (frequencyDiscountAmount > 0) {
        customLineItems.push({
          name: `${selectedFrequency.replace("_", " ")} Discount`,
          amount: -frequencyDiscountAmount, // Negative amount for discount
          quantity: 1,
          description: `Discount for ${selectedFrequency.replace("_", " ")} service frequency`,
        })
      }

      // Add video recording discount as a line item if applicable
      if (customerFormData.allowVideoRecording && videoDiscountAmount > 0) {
        customLineItems.push({
          name: "Video Recording Discount",
          amount: -videoDiscountAmount, // Negative amount for discount
          quantity: 1,
          description: "Discount for allowing video recording",
        })
      }

      const checkoutUrl = await createCheckoutSession({
        customLineItems: customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerFormData.email,
        customerData: {
          name: `${customerFormData.firstName} ${customerFormData.lastName}`,
          email: customerFormData.email,
          phone: customerFormData.phone,
          address: {
            line1: customerFormData.address,
            city: customerFormData.city,
            state: customerFormData.state,
            postal_code: customerFormData.zipCode,
            country: "US", // Assuming US, adjust if country selection is added
          },
        },
        paymentMethodTypes: [paymentMethod],
        automaticTax: { enabled: true }, // Enable automatic tax calculation on Stripe
        allowPromotions: true, // Allow promotion codes if applicable
      })

      if (checkoutUrl) {
        clearCart() // Clear cart only if Stripe checkout is successfully initiated
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
      case "service_config":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <Calendar className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Service Configuration</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred cleaning frequency and review your selected services.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <FrequencySelector
                onFrequencyChange={(freq, discount) => setSelectedFrequency(freq)}
                selectedFrequency={selectedFrequency}
              />
              {/* You can add a summary of selected rooms here if desired */}
              <Card>
                <CardHeader>
                  <CardTitle>Selected Rooms Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {roomConfigs.filter((r) => r.count > 0).length === 0 ? (
                    <p className="text-gray-500">No rooms selected yet. Please go back to pricing to select rooms.</p>
                  ) : (
                    <ul className="space-y-2">
                      {roomConfigs
                        .filter((r) => r.count > 0)
                        .map((room) => (
                          <li key={room.roomType} className="flex justify-between items-center">
                            <span className="font-medium">
                              {room.roomName} ({room.count})
                            </span>
                            <span className="text-sm text-gray-600">{room.selectedTier} Tier</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )

      case "contact_address":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <MapPin className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Contact & Service Address</h2>
              <p className="text-gray-600 dark:text-gray-400">Tell us where to clean and how to reach you.</p>
            </div>

            <div className="max-w-md mx-auto">
              <InlineAddressForm
                formData={customerFormData}
                onFormChange={handleCustomerFormChange}
                onSubmit={handleCustomerFormSubmit}
                isSubmitting={false} // Managed by parent now
                isSaved={isCustomerDataSaved} // Managed by parent now
              />
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
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="card" id="card" className="h-5 w-5" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-lg">Credit or Debit Card</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Visa</Badge>
                          <Badge variant="outline">Mastercard</Badge>
                          <Badge variant="outline">Amex</Badge>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" className="h-5 w-5" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-lg">PayPal</div>
                          <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          PayPal
                        </Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="apple_pay" id="apple_pay" className="h-5 w-5" />
                    <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-lg">Apple Pay</div>
                          <div className="text-sm text-gray-500">Touch ID or Face ID</div>
                        </div>
                        <Badge variant="outline" className="bg-gray-50">
                          Apple Pay
                        </Badge>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Stripe Elements Placeholder */}
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
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-500 space-y-1">
                            {item.metadata?.frequency && <p>Frequency: {item.metadata.frequency.replace(/_/g, " ")}</p>}
                            {item.metadata?.rooms && <p>Rooms: {item.metadata.rooms}</p>}
                            <p>Quantity: {item.quantity}</p>
                            {item.metadata?.selectedAddOns && item.metadata.selectedAddOns.length > 0 && (
                              <p>
                                Add-ons:{" "}
                                {item.metadata.selectedAddOns
                                  .map((id: string) => {
                                    const addOn =
                                      STRATEGIC_ADDONS.find((a) => a.id === id) ||
                                      PREMIUM_EXCLUSIVE_SERVICES.find((a) => a.id === id)
                                    return addOn ? addOn.name : id
                                  })
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
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
                      {customerFormData.firstName} {customerFormData.lastName}
                    </p>
                    <p className="text-gray-600">{customerFormData.email}</p>
                    <p className="text-gray-600">{customerFormData.phone}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Service Address</h4>
                    <p className="text-gray-600">{customerFormData.address}</p>
                    <p className="text-gray-600">
                      {customerFormData.city}, {customerFormData.state} {customerFormData.zipCode}
                    </p>
                    {customerFormData.specialInstructions && (
                      <p className="text-gray-600 mt-2">Instructions: {customerFormData.specialInstructions}</p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Service Frequency</h4>
                    <p className="text-gray-600">{selectedFrequency.replace(/_/g, " ")}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPhoneVerified ? (
                    <div className="flex items-center text-green-600 font-medium">
                      <Check className="h-5 w-5 mr-2" />
                      Phone number verified!
                    </div>
                  ) : isGoogleAuthenticated ? (
                    <div className="flex items-center text-green-600 font-medium">
                      <Check className="h-5 w-5 mr-2" />
                      Signed in with Google!
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Please verify your identity to proceed with the booking. You can either verify your phone number
                        or sign in with Google.
                      </p>
                      <Separator />
                      {/* Phone Verification */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Verify Phone Number ({customerFormData.phone})</h4>
                        {!showOtpInput ? (
                          <Button
                            onClick={handleSendOtp}
                            disabled={isPhoneVerifying || !customerFormData.phone}
                            className="w-full"
                          >
                            {isPhoneVerifying ? "Sending Code..." : "Send Verification Code"}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="otp" className="text-base font-medium">
                                Enter 6-digit code
                              </Label>
                              <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-2 h-12"
                                placeholder="XXXXXX"
                                maxLength={6}
                                required
                              />
                            </div>
                            <Button
                              onClick={handleVerifyOtp}
                              disabled={isPhoneVerifying || otp.length !== 6}
                              className="w-full"
                            >
                              {isPhoneVerifying ? "Verifying..." : "Verify Code"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowOtpInput(false)
                                setOtp("")
                                if (window.grecaptcha && window.recaptchaVerifier) {
                                  window.grecaptcha.reset(window.recaptchaVerifier.widgetId)
                                }
                              }}
                              className="w-full"
                            >
                              Resend Code
                            </Button>
                          </div>
                        )}
                        {/* This div is where reCAPTCHA will render invisibly */}
                        <div ref={recaptchaRef} id="recaptcha-container" className="hidden"></div>
                      </div>
                      <Separator />
                      {/* Google Sign-In */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Or Sign in with Google</h4>
                        <Button
                          onClick={handleGoogleSignIn}
                          disabled={isGoogleAuthenticating}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {isGoogleAuthenticating ? "Signing in..." : "Sign in with Google"}
                        </Button>
                      </div>
                    </>
                  )}
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
                      id="videoRecording"
                      checked={customerFormData.allowVideoRecording}
                      onCheckedChange={(checked) =>
                        handleCustomerFormChange({ ...customerFormData, allowVideoRecording: checked as boolean })
                      }
                    />
                    <Label htmlFor="videoRecording" className="text-base">
                      Allow video recording for quality assurance and social media use
                      <span className="text-green-600 font-medium ml-2">
                        (Save {videoDiscountAmount > 0 ? formatCurrency(videoDiscountAmount) : "10%"})
                      </span>
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
                    {frequencyDiscountAmount > 0 && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>{selectedFrequency.replace("_", " ")} Discount</span>
                        <span>-{formatCurrency(frequencyDiscountAmount)}</span>
                      </div>
                    )}
                    {videoDiscountAmount > 0 && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>Video Recording Discount</span>
                        <span>-{formatCurrency(videoDiscountAmount)}</span>
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
            href="/pricing"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
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
              disabled={isProcessing || !agreeToTerms || (!isPhoneVerified && !isGoogleAuthenticated)}
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
