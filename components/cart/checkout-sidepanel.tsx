"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, User, Check, Shield, ArrowLeft, ArrowRight, X, Home, Building, Navigation } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import type { CheckoutData } from "@/lib/types"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { US_STATES } from "@/lib/location-data"

type CheckoutStepId = "contact" | "address"

const steps = [
  { id: "contact", title: "Contact Info", icon: User, description: "Your contact details" },
  { id: "address", title: "Service Address", icon: MapPin, description: "Where we'll clean" },
]

interface CheckoutSidePanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCheckoutComplete: (data: CheckoutData) => void
}

export default function CheckoutSidePanel({ isOpen, onOpenChange, onCheckoutComplete }: CheckoutSidePanelProps) {
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<CheckoutStepId>("contact")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStepId[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Load saved data when panel opens
  useEffect(() => {
    if (!isOpen) return

    try {
      const savedContact = localStorage.getItem("checkout-contact")
      const savedAddress = localStorage.getItem("checkout-address")

      if (savedContact || savedAddress) {
        setCheckoutData((prev) => ({
          ...prev,
          contact: savedContact ? JSON.parse(savedContact) : prev.contact,
          address: savedAddress ? JSON.parse(savedAddress) : prev.address,
        }))

        // Set completed steps and current step based on saved data
        const completed: CheckoutStepId[] = []
        if (savedContact) completed.push("contact")
        if (savedAddress) completed.push("address")

        setCompletedSteps(completed)

        if (savedAddress) {
          setCurrentStep("address")
        } else if (savedContact) {
          setCurrentStep("address")
        }
      }
    } catch (e) {
      console.error("Failed to load saved checkout data", e)
      localStorage.removeItem("checkout-contact")
      localStorage.removeItem("checkout-address")
    }
  }, [isOpen])

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const validateContactStep = () => {
    const newErrors: Record<string, string> = {}
    const { firstName, lastName, email, phone } = checkoutData.contact

    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!phone.trim()) newErrors.phone = "Phone is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAddressStep = () => {
    const newErrors: Record<string, string> = {}
    const { address, city, state, zipCode } = checkoutData.address

    if (!address.trim()) newErrors.address = "Address is required"
    if (!city.trim()) newErrors.city = "City is required"
    if (!state) newErrors.state = "State is required"
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (section: "contact" | "address", field: string, value: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNext = async () => {
    setIsSubmitting(true)

    try {
      if (currentStep === "contact") {
        if (!validateContactStep()) {
          toast({
            title: "Please check your information",
            description: "Some required fields are missing or invalid.",
            variant: "destructive",
          })
          return
        }

        // Auto-populate address fields from contact
        setCheckoutData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            fullName: `${prev.contact.firstName} ${prev.contact.lastName}`,
            email: prev.contact.email,
            phone: prev.contact.phone,
          },
        }))

        localStorage.setItem("checkout-contact", JSON.stringify(checkoutData.contact))
        setCompletedSteps((prev) => [...prev.filter((s) => s !== "contact"), "contact"])
        setCurrentStep("address")
      } else if (currentStep === "address") {
        if (!validateAddressStep()) {
          toast({
            title: "Please check your address",
            description: "Some required fields are missing or invalid.",
            variant: "destructive",
          })
          return
        }

        localStorage.setItem("checkout-address", JSON.stringify(checkoutData.address))
        setCompletedSteps((prev) => [...prev.filter((s) => s !== "address"), "address"])

        // Complete the checkout process
        onCheckoutComplete(checkoutData)
        onOpenChange(false)

        toast({
          title: "Information saved successfully!",
          description: "You can now review your order and proceed to payment.",
          variant: "default",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep === "address") {
      setCurrentStep("contact")
    }
  }

  const handleStepClick = (stepId: CheckoutStepId) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId)
    const currentIndex = steps.findIndex((step) => step.id === currentStep)

    if (stepIndex <= currentIndex || completedSteps.includes(stepId)) {
      setCurrentStep(stepId)
    }
  }

  const renderContactStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          Contact Information
        </CardTitle>
        <p className="text-muted-foreground">We'll use this to contact you about your service</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={checkoutData.contact.firstName}
              onChange={(e) => handleInputChange("contact", "firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
              placeholder="John"
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={checkoutData.contact.lastName}
              onChange={(e) => handleInputChange("contact", "lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={checkoutData.contact.email}
            onChange={(e) => handleInputChange("contact", "email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={checkoutData.contact.phone}
            onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                Continue to Address
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </motion.div>
  )

  const renderAddressStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          Service Address
        </CardTitle>
        <p className="text-muted-foreground">Where would you like us to provide the cleaning service?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Type Selection */}
        <div className="space-y-3">
          <Label>Property Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "residential", icon: Home, label: "Residential" },
              { value: "commercial", icon: Building, label: "Commercial" },
              { value: "other", icon: Navigation, label: "Other" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange("address", "addressType", value)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                  checkoutData.address.addressType === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={checkoutData.address.address}
            onChange={(e) => handleInputChange("address", "address", e.target.value)}
            className={errors.address ? "border-red-500" : ""}
            placeholder="123 Main Street"
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Apartment, Suite, etc. (Optional)</Label>
          <Input
            id="address2"
            value={checkoutData.address.address2}
            onChange={(e) => handleInputChange("address", "address2", e.target.value)}
            placeholder="Apt 4B, Suite 200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={checkoutData.address.city}
              onChange={(e) => handleInputChange("address", "city", e.target.value)}
              className={errors.city ? "border-red-500" : ""}
              placeholder="New York"
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={checkoutData.address.state}
              onValueChange={(value) => handleInputChange("address", "state", value)}
            >
              <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={checkoutData.address.zipCode}
              onChange={(e) => handleInputChange("address", "zipCode", e.target.value)}
              className={errors.zipCode ? "border-red-500" : ""}
              placeholder="10001"
            />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
          <Textarea
            id="specialInstructions"
            value={checkoutData.address.specialInstructions}
            onChange={(e) => handleInputChange("address", "specialInstructions", e.target.value)}
            placeholder="Entry instructions, pets, areas to avoid, etc."
            className="h-24"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contact
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                Review My Order
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </motion.div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl p-0 flex flex-col">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <SheetTitle className="text-2xl font-bold">Secure Checkout</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
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
                    className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : isCompleted
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : isClickable
                            ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            : "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    <div className="text-left hidden sm:block">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Card className="border-0 shadow-none">
            <AnimatePresence mode="wait">
              {currentStep === "contact" && renderContactStep()}
              {currentStep === "address" && renderAddressStep()}
            </AnimatePresence>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
