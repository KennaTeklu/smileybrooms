"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CreditCard, MapPin, User, Package, Check, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence } from "framer-motion"
import ContactStep from "@/components/checkout/contact-step"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"
import type { CheckoutData } from "@/lib/types"

type CheckoutStepId = "contact" | "address" | "payment" | "review"

const steps = [
  { id: "contact", title: "Contact Info", icon: User },
  { id: "address", title: "Service Address", icon: MapPin },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review Order", icon: Package },
]

export default function CheckoutPage() {
  const { cart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState<CheckoutStepId>("contact")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStepId[]>([])
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    address: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      addressType: "residential",
    },
    payment: {
      paymentMethod: "card",
      allowVideoRecording: false,
      agreeToTerms: false,
    },
  })
  const [isLoading, setIsLoading] = useState(true) // New loading state

  // Redirect if cart is empty or load data
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
      return
    }

    try {
      const savedContact = localStorage.getItem("checkout-contact")
      const savedAddress = localStorage.getItem("checkout-address")
      const savedPayment = localStorage.getItem("checkout-payment")

      setCheckoutData((prev) => ({
        contact: savedContact ? JSON.parse(savedContact) : prev.contact,
        address: savedAddress ? JSON.parse(savedAddress) : prev.address,
        payment: savedPayment ? JSON.parse(savedPayment) : prev.payment,
      }))

      // Determine the last completed step to resume
      if (savedPayment) {
        setCurrentStep("review")
        setCompletedSteps(["contact", "address", "payment"])
      } else if (savedAddress) {
        setCurrentStep("payment")
        setCompletedSteps(["contact", "address"])
      } else if (savedContact) {
        setCurrentStep("address")
        setCompletedSteps(["contact"])
      }
    } catch (e) {
      console.error("Failed to load saved checkout data from localStorage", e)
      // Optionally clear corrupted data
      localStorage.removeItem("checkout-contact")
      localStorage.removeItem("checkout-address")
      localStorage.removeItem("checkout-payment")
    } finally {
      setIsLoading(false) // Set loading to false after data is loaded or attempted
    }
  }, [cart.items.length, router])

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleSaveStepData = useCallback(
    (stepId: CheckoutStepId, data: any) => {
      setCheckoutData((prev) => ({
        ...prev,
        [stepId]: data,
      }))
      // Persist to localStorage
      localStorage.setItem(`checkout-${stepId}`, JSON.stringify(data))

      if (!completedSteps.includes(stepId)) {
        setCompletedSteps((prev) => [...prev, stepId])
      }
    },
    [completedSteps],
  )

  const handleNext = useCallback(() => {
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id)
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) // Scroll to top
    }
  }, [currentStepIndex])

  const handlePrevious = useCallback(() => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id)
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) // Scroll to top
    }
  }, [currentStepIndex])

  const handleStepClick = useCallback(
    (stepId: CheckoutStepId) => {
      const stepIndex = steps.findIndex((step) => step.id === stepId)
      // Allow navigating to any previous completed step or the immediate next step
      if (stepIndex < currentStepIndex || (stepIndex === currentStepIndex && completedSteps.includes(stepId))) {
        setCurrentStep(stepId)
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) // Scroll to top
      } else if (stepIndex === currentStepIndex + 1) {
        // Allow moving to the next step if the current one is completed
        if (completedSteps.includes(currentStep)) {
          setCurrentStep(stepId)
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) // Scroll to top
        } else {
          toast({
            title: "Please complete current step",
            description: "You must complete the current step before moving forward.",
            variant: "destructive",
          })
        }
      }
    },
    [currentStep, currentStepIndex, completedSteps, toast],
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading checkout...</p>
      </div>
    )
  }

  if (cart.items.length === 0 && !isLoading) {
    return null // Will redirect via useEffect after loading check
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "contact":
        return (
          <ContactStep
            key="contact-step"
            data={checkoutData.contact}
            onSave={(data) => handleSaveStepData("contact", data)}
            onNext={handleNext}
          />
        )
      case "address":
        return (
          <AddressStep
            key="address-step"
            data={checkoutData.address}
            onSave={(data) => handleSaveStepData("address", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case "payment":
        return (
          <PaymentStep
            key="payment-step"
            data={checkoutData.payment}
            onSave={(data) => handleSaveStepData("payment", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            checkoutData={checkoutData}
          />
        )
      case "review":
        return <ReviewStep key="review-step" checkoutData={checkoutData} onPrevious={handlePrevious} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div ref={contentRef} className="container mx-auto px-4 py-8 max-w-6xl">
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
                const isCompleted = completedSteps.includes(step.id)
                const isClickable = index <= currentStepIndex || isCompleted

                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && handleStepClick(step.id)}
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
        <Card className="shadow-lg border-0 mb-12">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Encrypted Payment
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              100% Satisfaction Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
