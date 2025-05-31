"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, Settings } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { SimpleCustomizationPanel } from "./simple-customization-panel"
import { RoomCategory } from "./room-category"
import { useRoomContext } from "@/lib/room-context"

interface RoomConfiguratorProps {
  panelType?: "simple" | "enhanced" | "wizard"
}

export function RoomConfigurator({ panelType = "enhanced" }: RoomConfiguratorProps) {
  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<string | null>(null)

  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes } =
    useRoomContext()

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  const handleOpenCustomization = (roomType: string) => {
    setCurrentRoomToCustomize(roomType)
    setIsCustomizationPanelOpen(true)
  }

  const handleCloseCustomization = () => {
    setCurrentRoomToCustomize(null)
    setIsCustomizationPanelOpen(false)
  }

  const handleConfigChange = (config: any) => {
    if (currentRoomToCustomize) {
      updateRoomConfig(currentRoomToCustomize, config)
    }
    handleCloseCustomization()
  }

  const CustomizationPanelComponent = useMemo(() => {
    if (panelType === "enhanced") return EnhancedRoomCustomizationPanel
    if (panelType === "wizard") return MultiStepCustomizationWizard
    return SimpleCustomizationPanel
  }, [panelType])

  return (
    <div className="container mx-auto p-4 pb-32">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <RoomCategory
          title="Common Areas"
          description="Select and customize your living spaces."
          rooms={["living_room", "dining_room", "hallway", "entryway", "stairs"]}
          variant="primary"
        />

        <RoomCategory
          title="Private Spaces"
          description="Customize your bedrooms and bathrooms."
          rooms={["bedroom", "bathroom", "home_office", "laundry_room"]}
          variant="secondary"
        />

        <RoomCategory
          title="Specialty Areas"
          description="For kitchens and other unique spaces."
          rooms={["kitchen"]}
          variant="primary"
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
                      <span className="text-3xl">🏠</span>
                      <div>
                        <CardTitle className="text-lg">{config.roomName}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {config.selectedTier}
                          {config.selectedAddOns.length > 0 && ` + ${config.selectedAddOns.length} add-on(s)`}
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

      {/* Customization Panel */}
      {currentRoomToCustomize && (
        <CustomizationPanelComponent
          isOpen={isCustomizationPanelOpen}
          onClose={handleCloseCustomization}
          roomType={currentRoomToCustomize}
          roomName={roomConfigs[currentRoomToCustomize].roomName}
          roomIcon="🏠"
          roomCount={roomCounts[currentRoomToCustomize]}
          config={roomConfigs[currentRoomToCustomize]}
          onConfigChange={handleConfigChange}
        />
      )}
    </div>
  )
}
