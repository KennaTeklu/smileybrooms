"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import TermsAgreementPopup from "@/components/terms-agreement-popup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import EmailFormData from "@/components/email-form-data"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

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
  const [formDataForEmail, setFormDataForEmail] = useState<Record<string, any> | null>(null)

  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

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

    // Prepare data for email
    const emailData = {
      ...waitlistData,
      rooms: selectedRoomsList,
      frequency: calculatedService.frequency,
      serviceType: calculatedService.serviceType,
      isRecurring: calculatedService.isRecurring,
      recurringInterval: calculatedService.recurringInterval,
      price: finalPrice,
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
    }
    setFormDataForEmail(emailData)

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

    // Store data for email summary page
    localStorage.setItem("serviceFormData", JSON.stringify(emailData))

    // Show success message
    toast({
      title: "Added to cart!",
      description: `${serviceName} has been added to your cart.`,
    })

    // Ask if they want to email the details
    toast({
      title: "Send service details via email?",
      description: (
        <div className="mt-2">
          <Button onClick={() => router.push("/email-summary")} variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Email Service Details
          </Button>
        </div>
      ),
      duration: 10000,
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
      {/* Sticky Book Now Button */}
      {calculatedService && calculatedService.totalPrice > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xl font-bold">${calculatedService.totalPrice.toFixed(2)}</div>
                <p className="text-sm text-gray-500">
                  {calculatedService.frequency !== "one_time" ? "Recurring" : "One-time"} service
                </p>
              </div>

              <div className="flex-1 hidden sm:block">
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(calculatedService.rooms)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {type.replace(/_/g, " ")} x{count}
                      </span>
                    ))}
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!calculatedService.isServiceAvailable}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg"
              >
                {calculatedService.isServiceAvailable ? "Book Now" : "Service Unavailable"}
              </Button>
            </div>
          </div>
        </div>
      )}

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

      {/* Email Form Data Button */}
      {formDataForEmail && (
        <div className="fixed bottom-24 right-4 z-50">
          <EmailFormData
            formData={formDataForEmail}
            variant="default"
            size="lg"
            className="shadow-lg"
            onSuccess={() => setFormDataForEmail(null)}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}
