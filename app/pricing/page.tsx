"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { roomConfig } from "@/lib/room-config"
import PricingContent from "@/components/pricing-content"
import PriceCalculator from "@/components/price-calculator"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { Home, Sparkles, Calculator } from "lucide-react"
import { getServiceFeatures } from "@/lib/service-features"
import type { RoomTier } from "@/lib/room-tiers" // Import RoomTier type

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState("tiers")
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null)
  const [calculatorInitialRooms, setCalculatorInitialRooms] = useState<Record<string, number>>({})
  const [calculatorInitialServiceType, setCalculatorInitialServiceType] = useState<"standard" | "detailing">("standard")

  const handleTierSelect = (tier: RoomTier) => {
    // Find the room ID based on the tier's name (e.g., "Bedroom Essential Clean" -> "bedroom")
    const roomNameFromTier = tier.name.split(" ")[0].toLowerCase()
    const roomTypeId =
      roomConfig.roomTypes.find((r) => r.name.toLowerCase().includes(roomNameFromTier))?.id || selectedRoomType

    if (roomTypeId) {
      setCalculatorInitialRooms({ [roomTypeId]: 1 }) // Set count to 1 for the selected room

      let serviceType: "standard" | "detailing" = "standard"
      if (tier.name.includes("ADVANCED") || tier.name.includes("PREMIUM") || tier.name.includes("LUXURY")) {
        serviceType = "detailing"
      }
      setCalculatorInitialServiceType(serviceType)
      setSelectedTab("custom-plan") // Switch to the custom plan tab
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center">Build Your Cleaning Plan</h1>
        <p className="text-lg text-muted-foreground text-center mt-2">
          Choose a pre-defined tier for a specific room or create a custom plan.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tiers" className="text-sm md:text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Choose a Tier
          </TabsTrigger>
          <TabsTrigger value="custom-plan" className="text-sm md:text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" /> Build Your Custom Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" /> Select a Room Type
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {roomConfig.roomTypes.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoomType === room.id ? "default" : "outline"}
                    onClick={() => setSelectedRoomType(room.id)}
                    className={cn(
                      "flex flex-col items-center justify-center h-24 text-center",
                      selectedRoomType === room.id && "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    <span className="text-2xl mb-1">{room.icon}</span>
                    <span className="text-sm font-medium">{room.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedRoomType && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Cleaning Tiers for {roomConfig.roomTypes.find((r) => r.id === selectedRoomType)?.name}
                  </h2>
                  <PricingContent roomType={selectedRoomType} onSelect={handleTierSelect} />
                </CardContent>
              </Card>
              <ServiceComparisonTable
                roomType={roomConfig.roomTypes.find((r) => r.id === selectedRoomType)?.name || ""}
                features={getServiceFeatures(selectedRoomType)}
              />
            </>
          )}

          {!selectedRoomType && (
            <div className="text-center text-muted-foreground p-8 border rounded-lg">
              Please select a room type above to view its cleaning tiers and features.
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom-plan" className="space-y-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">Design Your Perfect Clean</h3>
            <p className="text-sm text-muted-foreground">
              Select individual rooms, frequency, and cleanliness level to get a custom quote.
            </p>
          </div>
          <PriceCalculator
            initialSelectedRooms={calculatorInitialRooms}
            initialServiceType={calculatorInitialServiceType}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
