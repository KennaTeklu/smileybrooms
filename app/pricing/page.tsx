"use client"

import { useState, useEffect } from "react"
import PriceCalculator from "@/components/price-calculator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import EnhancedTermsModal from "@/components/enhanced-terms-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AccessibilityPanel from "@/components/accessibility-panel"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Sparkles, FileText, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const [calculatedService, setCalculatedService] = useState<{
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "standard" | "detailing"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    paymentFrequency: "per_service" | "monthly" | "yearly"
  } | null>(null)

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [calculatorKey, setCalculatorKey] = useState(0) // Used to reset calculator
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showStickyButton, setShowStickyButton] = useState(true)

  const { addItem } = useCart()
  const { toast } = useToast()

  // Check if terms have been accepted
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (accepted) {
      setTermsAccepted(true)
    } else {
      // Show terms popup if not accepted
      setShowTermsModal(true)
    }
  }, [])

  const handleCalculationComplete = (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "standard" | "detailing"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
  }) => {
    // Omit the addressId as we don't need it in our simplified approach
    const { addressId, ...rest } = data
    setCalculatedService(rest)
  }

  // Show address modal when Add to Cart is clicked
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

    setShowAddressModal(true)
  }

  // Process the address data and add to cart
  const handleAddressSubmit = (addressData: AddressData) => {
    if (!calculatedService) return

    const frequencyLabel = {
      one_time: "One-Time Cleaning",
      weekly: "Weekly Cleaning",
      biweekly: "Biweekly Cleaning",
      monthly: "Monthly Cleaning",
      semi_annual: "Semi-Annual Cleaning",
      annually: "Annual Cleaning",
      vip_daily: "VIP Daily Cleaning",
    }[calculatedService.frequency]

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

    // Generate a unique ID that includes the address to help with combining similar items
    const itemId = `custom-cleaning-${addressData.address.replace(/\s+/g, "-").toLowerCase()}-${calculatedService.serviceType}-${calculatedService.frequency}-${calculatedService.paymentFrequency}`

    // Add to cart with customer data
    addItem({
      id: itemId,
      name: serviceName,
      price: finalPrice,
      priceId: "price_custom_cleaning",
      image: "/placeholder.svg?height=100&width=100",
      paymentFrequency: calculatedService.paymentFrequency,
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
    })

    // Show success message
    toast({
      title: "Added to cart!",
      description: `${serviceName} has been added to your cart.`,
    })

    // Reset calculator
    resetCalculator()
  }

  // Reset calculator to initial state
  const resetCalculator = () => {
    setCalculatorKey((prevKey) => prevKey + 1) // Change key to force re-render
    setCalculatedService(null)
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pricing Calculator
        </motion.h1>

        <div className="max-w-6xl mx-auto">
          {/* Main Calculator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-2xl">Calculate Your Cleaning Price</CardTitle>
                <CardDescription>Configure the cleaning details for your location</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="calculator-container">
                  <PriceCalculator key={calculatorKey} onCalculationComplete={handleCalculationComplete} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

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

          {/* Add to Cart Button - Strategically placed */}
          <AnimatePresence>
            {calculatedService && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  disabled={!calculatedService.isServiceAvailable || !termsAccepted}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                  </span>
                  <ShoppingCart className="mr-2 h-5 w-5 inline-block" />
                  <span className="font-medium">Add to Cart - ${calculatedService.totalPrice.toFixed(2)}</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Terms and conditions section */}
      <div className="mt-8 mb-12 mx-auto max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
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
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-700 dark:text-gray-300">
              I have read and agree to the Terms and Conditions
            </label>
          </div>
        </div>

        {!termsAccepted && calculatedService && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r">
            Please accept the terms and conditions to proceed with your purchase.
          </div>
        )}
      </div>

      {/* Address Collection Modal */}
      {calculatedService && (
        <AddressCollectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
          calculatedPrice={calculatedService.totalPrice}
        />
      )}

      {/* Enhanced Terms Modal */}
      <EnhancedTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        initialTab="terms"
      />

      {/* Accessibility Panel */}
      <AccessibilityPanel />
    </div>
  )
}
