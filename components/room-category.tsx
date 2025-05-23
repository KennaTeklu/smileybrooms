"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Settings } from "lucide-react"
import { roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { RoomCustomizationDrawer } from "./room-customization-drawer"

interface RoomCount {
  [key: string]: number
}

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  roomCounts: RoomCount
  onRoomCountChange: (roomType: string, count: number) => void
  onRoomConfigChange: (roomId: string, config: RoomConfig) => void
  getRoomConfig: (roomType: string) => RoomConfig
  variant?: "primary" | "secondary"
}

export function RoomCategory({
  title,
  description,
  rooms,
  roomCounts,
  onRoomCountChange,
  onRoomConfigChange,
  getRoomConfig,
  variant = "primary",
}: RoomCategoryProps) {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null)

  const handleOpenDrawer = (roomType: string) => {
    // Ensure at least one room is selected before customizing
    if (roomCounts[roomType] === 0) {
      onRoomCountChange(roomType, 1)
    }
    setActiveDrawer(roomType)
  }

  const handleCloseDrawer = () => {
    setActiveDrawer(null)
  }

  const handleRoomConfigChange = (config: RoomConfig) => {
    if (activeDrawer) {
      onRoomConfigChange(activeDrawer, config)
    }
  }

  const getBgColor = () => {
    if (variant === "primary") {
      return "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"
    }
    return "bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/30"
  }

  const getIconBgColor = () => {
    if (variant === "primary") {
      return "bg-blue-100 dark:bg-blue-900/30"
    }
    return "bg-gray-200 dark:bg-gray-700/30"
  }

  const getIconTextColor = () => {
    if (variant === "primary") {
      return "text-blue-600 dark:text-blue-400"
    }
    return "text-gray-600 dark:text-gray-400"
  }

  const getActiveBorderColor = () => {
    if (variant === "primary") {
      return "border-blue-500 dark:border-blue-400"
    }
    return "border-gray-500 dark:border-gray-400"
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className={getBgColor()}>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full ${getIconBgColor()} ${getIconTextColor()}`}
            >
              {variant === "primary" ? (
                <span className="text-lg" aria-hidden="true">
                  🏠
                </span>
              ) : (
                <span className="text-lg" aria-hidden="true">
                  🧹
                </span>
              )}
            </span>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            className={`grid grid-cols-2 md:grid-cols-3 ${
              rooms.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-4`}
          >
            {rooms.map((roomType) => (
              <Card
                key={roomType}
                className={`border ${
                  roomCounts[roomType] > 0 ? getActiveBorderColor() : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="text-3xl mb-2" aria-hidden="true">
                    {roomIcons[roomType]}
                  </div>
                  <h3 className="font-medium mb-2">{roomDisplayNames[roomType]}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRoomCountChange(roomType, (roomCounts[roomType] || 0) - 1)}
                      disabled={roomCounts[roomType] <= 0}
                      className="h-8 w-8"
                      aria-label={`Decrease ${roomDisplayNames[roomType]} count`}
                    >
                      <MinusCircle className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="font-medium text-lg">{roomCounts[roomType] || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRoomCountChange(roomType, (roomCounts[roomType] || 0) + 1)}
                      className="h-8 w-8"
                      aria-label={`Increase ${roomDisplayNames[roomType]} count`}
                    >
                      <PlusCircle className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {/* Only show Customize button when rooms are selected */}
                  {roomCounts[roomType] > 0 && (
                    <Button
                      id={`customize-${roomType}`}
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => handleOpenDrawer(roomType)}
                      aria-label={`Customize ${roomDisplayNames[roomType]}`}
                    >
                      <Settings className="h-3 w-3 mr-1" aria-hidden="true" />
                      Customize
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Customization Drawers */}
      {rooms.map((roomType) => (
        <RoomCustomizationDrawer
          key={roomType}
          isOpen={activeDrawer === roomType}
          onClose={handleCloseDrawer}
          roomType={roomType}
          roomName={roomDisplayNames[roomType]}
          roomIcon={roomIcons[roomType]}
          roomCount={roomCounts[roomType] || 0}
          config={getRoomConfig(roomType)}
          onConfigChange={handleRoomConfigChange}
        />
      ))}
    </>
  )
}
