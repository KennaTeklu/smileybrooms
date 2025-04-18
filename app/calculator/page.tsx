"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"

export default function CalculatorPage() {
  const [calculatedService, setCalculatedService] = useState<{
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
  } | null>(null)

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [calculatorKey, setCalculatorKey] = useState(0) // Used to reset calculator

  const { addItem } = useCart()
  const { toast } = useToast()

  const handleCalculationComplete = (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
  }) => {
    setCalculatedService(data)
  }

  // Show address modal when Add to Cart is clicked
  const handleAddToCart = () => {
    if (!calculatedService) return
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
    const serviceName = `${frequencyLabel} (${totalRooms} rooms)`

    // Get the room types that were selected
    const selectedRooms = Object.entries(calculatedService.rooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type.replace(/_/g, " ")} x${count}`)
      .join(", ")

    // Apply discount if video recording is allowed
    const finalPrice = addressData.allowVideoRecording
      ? calculatedService.totalPrice - addressData.videoRecordingDiscount
      : calculatedService.totalPrice

    // Add to cart with customer data
    addItem({
      id: `custom-cleaning-${Date.now()}`,
      name: serviceName,
      price: finalPrice,
      priceId: "price_custom_cleaning",
      image: "/placeholder.svg?height=100&width=100",
      metadata: {
        rooms: selectedRooms,
        frequency: calculatedService.frequency,
        customer: {
          name: addressData.fullName,
          email: addressData.email,
          phone: addressData.phone,
          address: `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`,
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

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Cleaning Price Calculator</h1>

        <div className="max-w-6xl mx-auto">
          <PriceCalculator key={calculatorKey} onCalculationComplete={handleCalculationComplete} />

          {calculatedService && calculatedService.totalPrice > 0 && (
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handleAddToCart} className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}
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

      <Footer />
    </div>
  )
}
