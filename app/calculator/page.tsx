"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { AddressData } from "@/components/address-collection-modal"
import TermsAgreementPopup from "@/components/terms-agreement-popup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AccessibilityToolbar from "@/components/accessibility-toolbar"

type CalculatedService = {
  rooms: Record<string, number>
  frequency: string
  totalPrice: number
  serviceType: "standard" | "detailing"
  cleanlinessLevel: number
  priceMultiplier: number
  isServiceAvailable: boolean
  addressId: string
  paymentFrequency: "per_service" | "monthly" | "yearly"
  isRecurring: boolean
  recurringInterval: "week" | "month" | "year"
}

export default function CalculatorPage() {
  const [calculatedService, setCalculatedService] = useState<CalculatedService | null>(null)
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

  const handleCalculationComplete = (data: CalculatedService) => {
    setCalculatedService(data)
  }

  // Add to cart directly without showing address modal
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

    // Create default address data
    const defaultAddress = {
      fullName: "Guest Customer",
      email: "guest@example.com",
      phone: "555-555-5555",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      specialInstructions: "",
      allowVideoRecording: false,
      videoRecordingDiscount: 0,
    }

    // Directly handle the submission with default data
    handleAddressSubmit(defaultAddress)
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
    const selectedRoomsList = Object.entries(calculatedService.rooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type.replace(/_/g, " ")} x${count}`)
      .join(", ")

    // Apply discount if video recording is allowed
    const finalPrice = addressData.allowVideoRecording
      ? calculatedService.totalPrice - addressData.videoRecordingDiscount
      : calculatedService.totalPrice

    // Create Google Maps link for the address
    const fullAddress = `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

    // Build the message for the waitlist API
    const formattedMessage = `
    Service: ${serviceName}
    Rooms: ${selectedRoomsList}
    Frequency: ${frequencyLabel}
    Address: ${fullAddress}
    Special Instructions: ${addressData.specialInstructions || "None"}
    Video Recording: ${addressData.allowVideoRecording ? "Yes" : "No"}
    Maps Link: ${googleMapsLink}
    Recurring: ${calculatedService.isRecurring ? `Yes (${calculatedService.recurringInterval}ly)` : "No"}
  `.trim()

    // Submit to waitlist API
    const waitlistData = {
      name: addressData.fullName,
      email: addressData.email,
      phone: addressData.phone,
      message: formattedMessage,
      source: "Calculator Form",
    }

    // Submit to waitlist API (using the Google Sheets script URL)
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(waitlistData),
    }).catch((error) => {
      console.error("Error submitting to waitlist:", error)
    })

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
        rooms: selectedRoomsList,
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
          googleMapsLink: googleMapsLink,
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

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Cleaning Price Calculator</h1>

        <div className="max-w-6xl mx-auto">
          {/* Main Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Cleaning Price</CardTitle>
              <CardDescription>Configure the cleaning details for your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="calculator-container">
                <PriceCalculator
                  key={calculatorKey}
                  onCalculationComplete={handleCalculationComplete}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Address Collection Modal removed to prevent pop-up */}

      {/* Terms Agreement Popup */}
      <TermsAgreementPopup onAccept={() => setTermsAccepted(true)} />

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />

      <Footer />
    </div>
  )
}
