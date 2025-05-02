"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import TermsAgreementPopup from "@/components/terms-agreement-popup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import StickyCartButton from "@/components/sticky-cart-button"

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
  const [showStickyButton, setShowStickyButton] = useState(true)

  const { addItem } = useCart()
  const { toast } = useToast()

  // Check if terms have been accepted
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (accepted) {
      setTermsAccepted(true)
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
        isRecurring: calculatedService.isRecurring,
        recurringInterval: calculatedService.recurringInterval,
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Sticky Add to Cart Button */}
      {calculatedService && calculatedService.totalPrice > 0 && (
        <StickyCartButton
          totalPrice={calculatedService.totalPrice}
          isServiceAvailable={calculatedService.isServiceAvailable}
          onAddToCart={handleAddToCart}
          visible={showStickyButton}
        />
      )}

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Pricing Calculator</h1>

        <div className="max-w-6xl mx-auto">
          {/* Main Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Cleaning Price</CardTitle>
              <CardDescription>Configure the cleaning details for your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="calculator-container">
                <PriceCalculator key={calculatorKey} onCalculationComplete={handleCalculationComplete} />
              </div>
            </CardContent>
          </Card>
        </div>
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

      {/* Terms Agreement Popup */}
      <TermsAgreementPopup onAccept={() => setTermsAccepted(true)} />

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />

      <Footer />
    </div>
  )
}
