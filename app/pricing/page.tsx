"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import TermsAgreementPopup from "@/components/terms-agreement-popup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
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
}

export default function PricingPage() {
  const [calculatedServices, setCalculatedServices] = useState<Record<string, CalculatedService>>({})
  const [activeAddressId, setActiveAddressId] = useState<string>(`address-${Date.now()}`)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [calculatorKey, setCalculatorKey] = useState(0) // Used to reset calculator
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)

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
    setCalculatedServices((prev) => ({
      ...prev,
      [data.addressId]: data,
    }))

    // Show add location button after first calculation
    if (data.totalPrice > 0 && !showAddLocation) {
      setShowAddLocation(true)
    }
  }

  // Show address modal when Add to Cart is clicked
  const handleAddToCart = () => {
    const service = calculatedServices[activeAddressId]
    if (!service) return
    if (!service.isServiceAvailable) {
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
    const service = calculatedServices[activeAddressId]
    if (!service) return

    const frequencyLabel = {
      one_time: "One-Time Cleaning",
      weekly: "Weekly Cleaning",
      biweekly: "Biweekly Cleaning",
      monthly: "Monthly Cleaning",
      semi_annual: "Semi-Annual Cleaning",
      annually: "Annual Cleaning",
      vip_daily: "VIP Daily Cleaning",
    }[service.frequency]

    // Count total rooms
    const totalRooms = Object.values(service.rooms).reduce((sum, count) => sum + count, 0)

    // Create a descriptive name for the service
    const serviceTypeLabel = service.serviceType === "standard" ? "Standard" : "Premium Detailing"
    const serviceName = `${serviceTypeLabel} ${frequencyLabel} (${totalRooms} rooms)`

    // Get the room types that were selected
    const selectedRooms = Object.entries(service.rooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type.replace(/_/g, " ")} x${count}`)
      .join(", ")

    // Apply discount if video recording is allowed
    const finalPrice = addressData.allowVideoRecording
      ? service.totalPrice - addressData.videoRecordingDiscount
      : service.totalPrice

    // Add to cart with customer data
    addItem({
      id: `custom-cleaning-${Date.now()}`,
      name: serviceName,
      price: finalPrice,
      priceId: "price_custom_cleaning",
      image: "/placeholder.svg?height=100&width=100",
      metadata: {
        rooms: selectedRooms,
        frequency: service.frequency,
        serviceType: service.serviceType,
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
    setActiveAddressId(`address-${Date.now()}`)
  }

  // Add a new address
  const addNewAddress = () => {
    const newAddressId = `address-${Date.now()}`
    setActiveAddressId(newAddressId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

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
                <PriceCalculator
                  key={`${calculatorKey}-${activeAddressId}`}
                  onCalculationComplete={handleCalculationComplete}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {/* Only show Add Location after first selection */}
              {showAddLocation && (
                <Button variant="outline" onClick={addNewAddress}>
                  <Plus className="h-4 w-4 mr-2" /> Add Another Location
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Summary of all locations - only show if we have more than one location */}
          {Object.keys(calculatedServices).length > 1 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Summary of All Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculatedServices).map(([id, service], index) => (
                    <div key={id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Location {index + 1}</h3>
                        <p className="text-sm text-gray-500">
                          {service.serviceType === "standard" ? "Standard" : "Premium Detailing"} -
                          {Object.values(service.rooms).reduce((sum, count) => sum + count, 0)} rooms
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(service.totalPrice)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                    <h3 className="font-bold">Total for all locations:</h3>
                    <p className="font-bold text-xl">
                      {formatCurrency(
                        Object.values(calculatedServices)
                          .filter((service) => service.isServiceAvailable)
                          .reduce((sum, service) => sum + service.totalPrice, 0),
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Address Collection Modal */}
      {calculatedServices[activeAddressId] && (
        <AddressCollectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
          calculatedPrice={calculatedServices[activeAddressId].totalPrice}
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
