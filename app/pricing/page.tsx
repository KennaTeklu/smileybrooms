"use client"

import { useState } from "react"
import { PricingContent } from "@/components/pricing-content"
import { PriceCalculator } from "@/components/price-calculator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getRoomTiers } from "@/lib/room-tiers"

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("tiers")
  const [initialSelectedRooms, setInitialSelectedRooms] = useState<Record<string, number>>({})
  const [initialServiceType, setInitialServiceType] = useState<"essential" | "premium" | "luxury">("essential") // Updated type

  const handleSelectTier = (roomType: string, tierId: string) => {
    const selectedRooms: Record<string, number> = {}
    // When a tier is selected, set the count for that room type to 1
    // This ensures the PriceCalculator starts with the selected room pre-filled
    selectedRooms[roomType] = 1

    setInitialSelectedRooms(selectedRooms)

    const tiers = getRoomTiers(roomType)
    const selectedTier = tiers.find((tier) => tier.id === tierId)

    let serviceType: "essential" | "premium" | "luxury" = "essential" // Default
    if (selectedTier) {
      // Determine service type based on tier name
      if (selectedTier.name.includes("ESSENTIAL")) {
        serviceType = "essential"
      } else if (selectedTier.name.includes("PREMIUM")) {
        serviceType = "premium"
      } else if (selectedTier.name.includes("LUXURY")) {
        serviceType = "luxury"
      }
    }
    setInitialServiceType(serviceType)
    setActiveTab("custom") // Switch to the custom plan tab
  }

  // This function will be called by PriceCalculator when calculation is complete
  const handleCalculationComplete = (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "essential" | "premium" | "luxury"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
  }) => {
    console.log("Price calculation complete:", data)
    // Here you can use the calculated data, e.g., update a summary,
    // store it in context, or trigger other actions.
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <PricingContent onSelectTier={handleSelectTier} />
        <TabsContent value="custom">
          <div className="flex justify-center py-12 px-4 md:px-6">
            {/* Render the PriceCalculator here, passing initial props and the callback */}
            <PriceCalculator
              initialSelectedRooms={initialSelectedRooms}
              initialServiceType={initialServiceType}
              onCalculationComplete={handleCalculationComplete}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
