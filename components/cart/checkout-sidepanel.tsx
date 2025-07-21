"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreditCard, MapPin, User, Package, Check, Shield } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence } from "framer-motion"
import ContactStep from "@/components/checkout/contact-step"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"
import type { CheckoutData } from "@/lib/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type CheckoutStepId = "contact" | "address" | "payment" | "review"

const steps = [
  { id: "contact", title: "Contact Info", icon: User },
  { id: "address", title: "Service Address", icon: MapPin },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review Order", icon: Package },
]

interface CheckoutSidePanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCheckoutComplete: (data: CheckoutData) => void
}

export default function CheckoutSidePanel({ isOpen, onOpenChange, onCheckoutComplete }: CheckoutSidePanelProps) {
  const { cart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

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

  // Load initial data from localStorage if available (for returning users or partial completion)
  useEffect(() => {
    if (!isOpen) return // Only load when panel opens

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
      } else {
        setCurrentStep("contact") // Start from contact if no data
        setCompletedSteps([])
      }
    } catch (e) {
      console.error("Failed to load saved checkout data from localStorage", e)
      // Optionally clear corrupted data
      localStorage.removeItem("checkout-contact")
      localStorage.removeItem("checkout-address")
      localStorage.removeItem("checkout-payment")
    }
  }, [isOpen]) // Re-run when sheet opens

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
    } else if (currentStep === "review") {
      // If on the review step and trying to go "next", it means checkout is complete
      onCheckoutComplete(checkoutData)
      onOpenChange(false) // Close the side panel
    }
  }, [currentStepIndex, currentStep, checkoutData, onCheckoutComplete, onOpenChange])

  const handlePrevious = useCallback(() => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id)
    }
  }, [currentStepIndex])

  const handleStepClick = useCallback(
    (stepId: CheckoutStepId) => {
      const stepIndex = steps.findIndex((step) => step.id === stepId)
      // Allow navigating to any previous completed step or the immediate next step
      if (stepIndex < currentStepIndex || (stepIndex === currentStepIndex && completedSteps.includes(stepId))) {
        setCurrentStep(stepId)
      } else if (stepIndex === currentStepIndex + 1) {
        // Allow moving to the next step if the current one is completed
        if (completedSteps.includes(currentStep)) {
          setCurrentStep(stepId)
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-auto h-full md:h-[90vh] overflow-y-auto flex flex-col"
      >
        <SheetHeader className="mb-8 text-center">
          <SheetTitle className="text-4xl font-bold mb-2">Secure Checkout</SheetTitle>
          <p className="text-xl text-muted-foreground">Complete your order in just a few simple steps</p>
        </SheetHeader>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8 w-full">
          <Progress value={progress} className="h-2 mb-4" />
          <p className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* Step Navigation */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg">
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
                    className={`group flex items-center space-x-2 px-4 py-3 rounded-full transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md group-hover:bg-blue-700"
                        : isCompleted
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                          : isClickable
                            ? "hover:bg-gray-50 dark:hover:bg-gray-700"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 transition-all group-hover:scale-105" />
                    ) : (
                      <Icon className="h-5 w-5 transition-all group-hover:scale-105 group-hover:text-white" />
                    )}
                    <span className="font-medium hidden sm:block">{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0 mb-12 rounded-xl flex-grow">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-auto text-center py-4">
          <div className="flex justify-center items-center space-x-4 md:space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span className="font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span className="font-medium">Encrypted Payment</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              <span className="font-medium">100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
