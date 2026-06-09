"use client"

import { useState } from "react"
import { PricingContent } from "@/components/pricing-content"
import { PriceCalculator } from "@/components/price-calculator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getRoomTiers } from "@/lib/room-tiers"

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("tiers")
  const [initialSelectedRooms, setInitialSelectedRooms] = useState<Record<string, number>>({})
  const [initialServiceType, setInitialServiceType] = useState<"standard" | "detailing">("standard")

  const handleSelectTier = (roomType: string, tierId: string) => {
    const selectedRooms: Record<string, number> = {}
    selectedRooms[roomType] = 1 // Set the selected room count to 1 for the chosen room

    setInitialSelectedRooms(selectedRooms)

    const tiers = getRoomTiers(roomType)
    const selectedTier = tiers.find((tier) => tier.id === tierId)

    let serviceType: "standard" | "detailing" = "standard"
    if (selectedTier) {
      // Determine service type based on tier name
      if (selectedTier.name.includes("PREMIUM CLEAN") || selectedTier.name.includes("ADVANCED CLEAN")) {
        serviceType = "detailing"
      } else {
        serviceType = "standard"
      }
    }
    setInitialServiceType(serviceType)
    setActiveTab("custom") // Switch to the custom plan tab
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <PricingContent onSelectTier={handleSelectTier} />
        <TabsContent value="custom">
          <div className="flex justify-center py-12 px-4 md:px-6">
            <PriceCalculator initialSelectedRooms={initialSelectedRooms} initialServiceType={initialServiceType} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
