"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PricingWizard } from "@/components/pricing-wizard"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Shield, ShoppingCart, Check, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PricePreview } from "@/components/price-preview"
import { FeedbackCollector } from "@/components/feedback-collector"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the CalculatedService type for better type safety
interface CalculatedService {
  rooms: Record<string, number>
  frequency: string
  totalPrice: number
  basePrice: number
  discounts: Array<{ label: string; amount: number; percentage?: number }>
  surcharges: Array<{ label: string; amount: number; percentage?: number }>
  serviceType: "standard" | "detailing"
  cleanlinessLevel: number
  isServiceAvailable: boolean
  paymentFrequency: "per_service" | "monthly" | "yearly"
  allowVideoRecording?: boolean
}

// Define the user preferences type
interface UserPreferences {
  lastSelectedRooms?: Record<string, number>
  preferredServiceType?: "standard" | "detailing"
  preferredFrequency?: string
  preferredPaymentFrequency?: "per_service" | "monthly" | "yearly"
}

export default function PricingPage() {
  // State for calculation and UI
  const [calculatedService, setCalculatedService] = useState<CalculatedService | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(4)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [abTestVariant, setAbTestVariant] = useState<"A" | "B">("A")
  const [userPreferences, setUserPreferences] = useLocalStorage<UserPreferences>("user-preferences", {})
  const [activeTab, setActiveTab] = useState("wizard")

  // Refs for DOM elements
  const headerRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  // Media query for responsive design
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Hooks
  const { addItem } = useCart()
  const { toast } = useToast()

  // A/B testing setup
  useEffect(() => {
    // Randomly assign user to variant A or B (50/50 split)
    const variant = Math.random() < 0.5 ? "A" : "B"
    setAbTestVariant(variant)

    // Track which variant was shown to the user
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Pricing Page Viewed", {
        variant,
        timestamp: new Date().toISOString(),
      })
    }
  }, [])

  // Check if terms have been accepted on mount
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (accepted) {
      setTermsAccepted(true)
    }

    // Set up scroll listener for sticky header
    const handleScroll = () => {
      if (headerRef.current) {
        const shouldBeSticky = window.scrollY > headerRef.current.offsetTop + 100
        setIsHeaderSticky(shouldBeSticky)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle calculation updates from the wizard component
  const handleCalculationComplete = (data: CalculatedService) => {
    setCalculatedService(data)

    // Save user preferences
    setUserPreferences({
      ...userPreferences,
      lastSelectedRooms: data.rooms,
      preferredServiceType: data.serviceType,
      preferredFrequency: data.frequency,
      preferredPaymentFrequency: data.paymentFrequency,
    })

    // Save to session storage for persistence
    try {
      sessionStorage.setItem("currentCalculation", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save calculation to session storage:", error)
    }
  }

  // Handle step change
  const handleStepChange = useCallback(
    (step: number) => {
      // Only update if the step is actually different to prevent unnecessary renders
      if (currentStep !== step) {
        setCurrentStep(step)
      }
    },
    [currentStep],
  )

  // Restore from session storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("currentCalculation")
      if (saved) {
        setCalculatedService(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to restore calculation from session storage:", error)
    }
  }, [])

  // Scroll to terms section if needed
  const scrollToTerms = () => {
    const termsSection = document.querySelector("#terms-section")
    if (termsSection) {
      termsSection.scrollIntoView({ behavior: "smooth" })
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "warning",
      })
    }
  }

  // Handle adding service to cart
  const handleAddToCart = () => {
    if (!calculatedService) {
      toast({
        title: "No service selected",
        description: "Please select rooms and services before adding to cart",
        variant: "destructive",
      })
      return
    }

    if (!calculatedService.isServiceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Please contact us for a custom quote for extremely dirty conditions.",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      scrollToTerms()
      return
    }

    setShowAddressModal(true)

    // Track add to cart attempt for analytics
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Add To Cart Initiated", {
        serviceType: calculatedService.serviceType,
        frequency: calculatedService.frequency,
        totalPrice: calculatedService.totalPrice,
        variant: abTestVariant,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Process the address data and add to cart
  const handleAddressSubmit = (addressData: AddressData) => {
    if (!calculatedService) return

    setIsLoading(true)

    // Create descriptive service name
    const frequencyLabel =
      {
        one_time: "One-Time Cleaning",
        weekly: "Weekly Cleaning",
        biweekly: "Bi-weekly Cleaning",
        monthly: "Monthly Cleaning",
        semi_annual: "Semi-Annual Cleaning",
        annually: "Annual Cleaning",
      }[calculatedService.frequency] || "Cleaning Service"

    // Count total rooms
    const totalRooms = Object.values(calculatedService.rooms).reduce((sum, count) => sum + count, 0)

    // Create a descriptive name for the service
    const serviceTypeLabel = calculatedService.serviceType === "standard" ? "Standard" : "Premium Detailing"
    const serviceName = `${serviceTypeLabel} ${frequencyLabel} (${totalRooms} rooms)`

    // Get the room types that were selected
    const selectedRooms = Object.entries(calculatedService.rooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type.replace(/_/g, " ")} x${count}`)
      .join(", ")

    // Apply discount if video recording is allowed
    const finalPrice = addressData.allowVideoRecording
      ? calculatedService.totalPrice - addressData.videoRecordingDiscount
      : calculatedService.totalPrice

    // Generate a unique ID
    const itemId = `custom-cleaning-${Date.now()}`

    // Add to cart with customer data
    setTimeout(() => {
      addItem({
        id: itemId,
        name: serviceName,
        price: finalPrice,
        priceId: "price_custom_cleaning",
        image: "/sparkling-clean-home.png",
        quantity: 1,
        metadata: {
          rooms: selectedRooms,
          frequency: calculatedService.frequency,
          serviceType: calculatedService.serviceType,
          isRecurring: calculatedService.frequency !== "one_time",
          recurringInterval: calculatedService.frequency !== "one_time" ? calculatedService.frequency : null,
          customer: {
            name: addressData.fullName,
            email: addressData.email,
            phone: addressData.phone,
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
            specialInstructions: addressData.specialInstructions,
            allowVideoRecording: addressData.allowVideoRecording,
          },
        },
        paymentFrequency: calculatedService.paymentFrequency,
      })

      // Show confirmation
      setShowConfirmation(true)
      setIsLoading(false)
      setShowAddressModal(false)

      // Track successful add to cart for analytics
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("Add To Cart Completed", {
          serviceType: calculatedService.serviceType,
          frequency: calculatedService.frequency,
          totalPrice: finalPrice,
          variant: abTestVariant,
          timestamp: new Date().toISOString(),
        })
      }

      // Show feedback collector after successful add to cart
      setTimeout(() => {
        setShowConfirmation(false)
        setShowFeedback(true)
      }, 3000)
    }, 800) // Simulate network delay for better UX
  }

  // Function to open terms and conditions
  const handleOpenTerms = () => {
    setShowTermsModal(true)
  }

  // Handle terms acceptance
  const handleTermsAccept = () => {
    setTermsAccepted(true)
    localStorage.setItem("termsAccepted", "true")
    setShowTermsModal(false)

    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our terms and conditions.",
    })
  }

  // Handle feedback submission
  const handleFeedbackSubmit = (feedback: { rating: number; comment: string }) => {
    // Process feedback
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Feedback Submitted", {
        rating: feedback.rating,
        comment: feedback.comment,
        variant: abTestVariant,
        timestamp: new Date().toISOString(),
      })
    }

    setShowFeedback(false)

    toast({
      title: "Thank You!",
      description: "Your feedback helps us improve our service.",
    })
  }

  // Check if service is valid for adding to cart
  const isServiceValid =
    calculatedService &&
    Object.values(calculatedService.rooms).some((count) => count > 0) &&
    calculatedService.isServiceAvailable

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header with Price and Progress */}
      <div
        ref={headerRef}
        className={`transition-all duration-300 ${
          isHeaderSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md"
            : ""
        }`}
        aria-hidden={!isHeaderSticky}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className={`font-bold transition-all ${isHeaderSticky ? "text-xl" : "text-2xl"}`}>
                Cleaning Calculator
              </h2>

              {calculatedService && (
                <PricePreview
                  price={calculatedService.totalPrice}
                  paymentFrequency={calculatedService.paymentFrequency}
                  animate={true}
                />
              )}
            </div>

            {/* Progress indicator */}
            <div className="hidden md:flex items-center space-x-2 flex-1 max-w-xs mx-4">
              <span className="text-xs text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>

            <Button
              onClick={handleAddToCart}
              size={isMobile ? "sm" : "default"}
              disabled={!isServiceValid || !termsAccepted}
              className="transition-all"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span className="whitespace-nowrap">
                {isServiceValid
                  ? `Add to Cart ${calculatedService ? `(${formatCurrency(calculatedService.totalPrice)})` : ""}`
                  : "Configure Service"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-8 flex-1 ${isHeaderSticky ? "mt-16" : ""}`} ref={pricingRef}>
        <h1 className="text-4xl font-bold text-center mb-2">Pricing Calculator</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Configure your cleaning service below to get an instant price quote. Our interactive calculator helps you
          build the perfect cleaning package for your needs.
        </p>

        {/* Success Confirmation */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300 shadow-lg">
                <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                <AlertDescription className="font-medium">Service added to cart successfully!</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Collector */}
        <FeedbackCollector
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />

        {/* Interactive Price Preview (only shown when service is configured) */}
        {calculatedService && Object.values(calculatedService.rooms).some((count) => count > 0) && (
          <Card className="mb-8 overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Price Summary</span>
                <PricePreview
                  price={calculatedService.totalPrice}
                  paymentFrequency={calculatedService.paymentFrequency}
                  size="large"
                  animate={true}
                />
              </CardTitle>
              <CardDescription>
                {Object.values(calculatedService.rooms).reduce((sum, count) => sum + count, 0)} rooms,
                {calculatedService.serviceType === "standard" ? " Standard" : " Premium"} cleaning,
                {calculatedService.frequency === "one_time"
                  ? " One-time"
                  : calculatedService.frequency === "weekly"
                    ? " Weekly"
                    : calculatedService.frequency === "biweekly"
                      ? " Bi-weekly"
                      : calculatedService.frequency === "monthly"
                        ? " Monthly"
                        : calculatedService.frequency === "semi_annual"
                          ? " Semi-annual"
                          : " Annual"}{" "}
                service
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Base price */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span>Base Price</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">Base price info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">The base price for your selected rooms and service type.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>{formatCurrency(calculatedService.basePrice)}</span>
                </div>

                {/* Discounts */}
                {calculatedService.discounts.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Discounts</h4>
                      {calculatedService.discounts.map((discount, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{discount.label}</span>
                          <span className="text-green-600 dark:text-green-400">
                            {discount.percentage ? `-${discount.percentage}%` : `-${formatCurrency(discount.amount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Surcharges */}
                {calculatedService.surcharges.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400">Additional Charges</h4>
                      {calculatedService.surcharges.map((surcharge, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{surcharge.label}</span>
                          <span className="text-amber-600 dark:text-amber-400">
                            {surcharge.percentage
                              ? `+${surcharge.percentage}%`
                              : `+${formatCurrency(surcharge.amount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Total */}
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <PricePreview
                    price={calculatedService.totalPrice}
                    paymentFrequency={calculatedService.paymentFrequency}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  disabled={!isServiceValid || !termsAccepted}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart ({formatCurrency(calculatedService.totalPrice)})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Calculator Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wizard">Interactive Wizard</TabsTrigger>
            <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="pt-4">
            {/* Main Wizard */}
            <Card className="shadow-md border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-2xl">Calculate Your Cleaning Price</CardTitle>
                <CardDescription>Follow the steps below to configure your cleaning service</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PricingWizard
                  onCalculationComplete={handleCalculationComplete}
                  onStepChange={handleStepChange}
                  userPreferences={userPreferences}
                  abTestVariant={abTestVariant}
                />
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>
                    Need help?{" "}
                    <Button variant="link" className="h-auto p-0">
                      Chat with us
                    </Button>
                  </span>
                </div>
                <Button onClick={handleAddToCart} disabled={!isServiceValid || !termsAccepted} size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="pt-4">
            {/* Price Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Service Comparison</CardTitle>
                <CardDescription>Compare our different cleaning service options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Features</th>
                        <th className="text-left p-2">Standard Cleaning</th>
                        <th className="text-left p-2">Premium Detailing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Base Price (2BR, 1BA)</td>
                        <td className="p-2">$110</td>
                        <td className="p-2">$198</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Dusting & Vacuuming</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Bathroom Cleaning</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Kitchen Cleaning</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Deep Fixture Cleaning</td>
                        <td className="p-2">-</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Inside Appliances</td>
                        <td className="p-2">-</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Hard-to-Reach Areas</td>
                        <td className="p-2">-</td>
                        <td className="p-2">
                          <Check className="h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Weekly Frequency</td>
                        <td className="p-2">
                          $96.80 <Badge className="ml-1 bg-green-100 text-green-800">-12%</Badge>
                        </td>
                        <td className="p-2">
                          $174.24 <Badge className="ml-1 bg-green-100 text-green-800">-12%</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2"></td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveTab("wizard")
                              // Pre-select standard cleaning
                              // This would be handled by the wizard component
                            }}
                          >
                            Select Standard
                          </Button>
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setActiveTab("wizard")
                              // Pre-select premium detailing
                              // This would be handled by the wizard component
                            }}
                          >
                            Select Premium
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Messages */}
        {calculatedService && !calculatedService.isServiceAvailable && (
          <Alert variant="destructive" className="mt-6">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>
              The selected combination of service type and cleanliness level is not available online. Please contact us
              directly for a custom quote for extremely soiled conditions.
            </AlertDescription>
          </Alert>
        )}

        {/* Terms and Conditions Link */}
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={handleOpenTerms}
            className="text-sm md:text-base text-gray-600 hover:text-blue-600 flex items-center justify-center mx-auto"
          >
            <FileText className="h-4 w-4 mr-1" />
            View Terms and Conditions
          </Button>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div
        id="terms-section"
        className="mt-8 mb-12 mx-auto max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms and Conditions</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          By proceeding with your purchase, you agree to our Terms and Conditions and Privacy Policy. These terms
          outline important information about our services, payment processing, cancellation policies, and your rights
          as a customer.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Button onClick={handleOpenTerms} variant="outline" className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Read Full Terms
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="checkbox"
              id="accept-terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-describedby="terms-description"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-700 dark:text-gray-300">
              I have read and agree to the Terms and Conditions
            </label>
          </div>
        </div>
        <p id="terms-description" className="sr-only">
          Accepting terms and conditions is required to proceed with your purchase
        </p>

        {!termsAccepted && calculatedService && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r">
            Please accept the terms and conditions to proceed with your purchase.
          </div>
        )}
      </div>

      {/* Address Collection Modal */}
      <AddressCollectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleAddressSubmit}
        calculatedPrice={calculatedService?.totalPrice || 0}
        isLoading={isLoading}
      />

      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleAddToCart}
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl"
          disabled={!isServiceValid || !termsAccepted}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
