"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"

export default function CalculatorPage() {
  const [calculatedService, setCalculatedService] = useState<{
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
  } | null>(null)

  const { addItem } = useCart()
  const { toast } = useToast()

  const handleCalculationComplete = (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
  }) => {
    setCalculatedService(data)
  }

  // Update the addToCart function to properly handle custom cleaning services
  const addToCart = () => {
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

    addItem({
      id: `custom-cleaning-${Date.now()}`,
      name: serviceName,
      price: calculatedService.totalPrice,
      priceId: "price_custom_cleaning", // This is a marker for custom services
      image: "/placeholder.svg?height=100&width=100",
      description: `Includes: ${selectedRooms}`,
    })

    toast({
      title: "Added to cart!",
      description: `${serviceName} has been added to your cart.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Cleaning Price Calculator</h1>

        <div className="max-w-6xl mx-auto">
          <PriceCalculator onCalculationComplete={handleCalculationComplete} />

          {calculatedService && calculatedService.totalPrice > 0 && (
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={addToCart} className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
