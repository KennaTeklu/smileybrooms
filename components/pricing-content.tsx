"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, Settings } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { RoomCategory } from "./room-category"
import { useRoomContext } from "@/lib/room-context"
import { RoomCustomizationDrawer } from "./room-customization-drawer"
import { roomDisplayNames, roomIcons } from "@/lib/room-tiers" // Import roomDisplayNames and roomIcons

interface RoomConfiguratorProps {
  panelType?: "simple" | "enhanced" | "wizard"
}

export function PricingContent({ panelType = "enhanced" }: RoomConfiguratorProps) {
  const [isCustomizationDrawerOpen, setIsCustomizationDrawerOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<string | null>(null)

  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes } =
    useRoomContext()

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  const handleOpenCustomization = (roomType: string) => {
    setCurrentRoomToCustomize(roomType)
    setIsCustomizationDrawerOpen(true)
  }

  const handleCloseCustomization = () => {
    setCurrentRoomToCustomize(null)
    setIsCustomizationDrawerOpen(false)
  }

  const handleConfigChange = (roomType: string, config: any) => {
    updateRoomConfig(roomType, config)
  }

  return (
    <div className="container mx-auto p-4 pb-32">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <RoomCategory
          title="Common Areas"
          description="Select and customize your living spaces."
          rooms={["living_room", "dining_room", "hallway", "entryway", "stairs"]}
          roomCounts={roomCounts}
          onRoomCountChange={updateRoomCount}
          onRoomConfigChange={updateRoomConfig}
          getRoomConfig={(roomType) => roomConfigs[roomType]}
          variant="primary"
          onRoomSelect={handleOpenCustomization} // Pass handleOpenCustomization for direct customization
        />

        <RoomCategory
          title="Private Spaces"
          description="Customize your bedrooms and bathrooms."
          rooms={["bedroom", "bathroom", "home_office", "laundry_room"]}
          roomCounts={roomCounts}
          onRoomCountChange={updateRoomCount}
          onRoomConfigChange={updateRoomConfig}
          getRoomConfig={(roomType) => roomConfigs[roomType]}
          variant="secondary"
          onRoomSelect={handleOpenCustomization}
        />

        <RoomCategory
          title="Specialty Areas"
          description="For kitchens and other unique spaces."
          rooms={["kitchen"]}
          roomCounts={roomCounts}
          onRoomCountChange={updateRoomCount}
          onRoomConfigChange={updateRoomConfig}
          getRoomConfig={(roomType) => roomConfigs[roomType]}
          variant="primary"
          onRoomSelect={handleOpenCustomization}
        />
      </div>

      {/* Selected Rooms Summary */}
      {selectedRoomTypes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Selected Rooms</h3>
          <div className="space-y-4">
            {selectedRoomTypes.map((roomType) => {
              const count = roomCounts[roomType]
              const config = roomConfigs[roomType]
              return (
                <Card key={roomType}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{roomIcons[roomType] || "🏠"}</span>
                      <div>
                        <CardTitle className="text-lg">{roomDisplayNames[roomType]}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {config.selectedTier}
                          {config.selectedAddOns.length > 0 && ` + ${config.selectedAddOns.length} add-on(s)`}
                          {config.selectedReductions.length > 0 &&
                            ` - ${config.selectedReductions.length} reduction(s)`}
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(config.totalPrice)} x {count} = {formatCurrency(config.totalPrice * count)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateRoomCount(roomType, count - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-6 text-center">{count}</span>
                      <Button variant="outline" size="icon" onClick={() => updateRoomCount(roomType, count + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleOpenCustomization(roomType)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => updateRoomCount(roomType, 0)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-2xl font-bold mb-8">
        <span>Total Estimated Price:</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      {/* Customization Drawer */}
      {currentRoomToCustomize && (
        <RoomCustomizationDrawer
          isOpen={isCustomizationDrawerOpen}
          onOpenChange={setIsCustomizationDrawerOpen}
          roomType={currentRoomToCustomize}
          roomConfig={roomConfigs[currentRoomToCustomize]}
          onSave={handleConfigChange}
        />
      )}
    </div>
  )
}
