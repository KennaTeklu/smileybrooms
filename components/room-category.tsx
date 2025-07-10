"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, PlusIcon, Settings } from "lucide-react"
import { roomDisplayNames, roomIcons } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import type { RoomConfig } from "@/lib/room-context"
import { RoomCustomizationDrawer } from "@/components/room-customization-drawer"

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  roomCounts: Record<string, number>
  onRoomCountChange: (roomType: string, count: number) => void
  onRoomConfigChange: (roomType: string, config: RoomConfig) => void
  getRoomConfig: (roomType: string) => RoomConfig
  variant: "primary" | "secondary"
  onRoomSelect: (roomType: string | null) => void
}

export function RoomCategory({
  title,
  description,
  rooms,
  roomCounts,
  onRoomCountChange,
  onRoomConfigChange,
  getRoomConfig,
  variant,
  onRoomSelect,
}: RoomCategoryProps) {
  const [isCustomizationDrawerOpen, setIsCustomizationDrawerOpen] = useState(false)
  const [currentRoomForCustomization, setCurrentRoomForCustomization] = useState<string | null>(null)

  const handleCustomizeClick = (roomType: string) => {
    setCurrentRoomForCustomization(roomType)
    setIsCustomizationDrawerOpen(true)
    onRoomSelect(roomType)
  }

  const handleAddRoom = (roomType: string) => {
    onRoomCountChange(roomType, 1)
    onRoomSelect(roomType)
  }

  const handleIncrement = (roomType: string) => {
    onRoomCountChange(roomType, (roomCounts[roomType] || 0) + 1)
    onRoomSelect(roomType)
  }

  const handleDecrement = (roomType: string) => {
    onRoomCountChange(roomType, Math.max(0, (roomCounts[roomType] || 0) - 1))
    if (roomCounts[roomType] === 1) {
      onRoomSelect(null) // Deselect if count goes to 0
    }
  }

  const accentColor = variant === "primary" ? "blue" : "purple"

  return (
    <Card className="shadow-sm">
      <CardHeader
        className={cn(
          "border-b",
          variant === "primary"
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30"
            : "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
        )}
      >
        <CardTitle className="text-2xl flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              variant === "primary"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            )}
          >
            {variant === "primary" ? "🏠" : "✨"}
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((roomType) => (
          <div
            key={roomType}
            className={cn(
              "border rounded-lg p-4 flex flex-col justify-between transition-all duration-200",
              roomCounts[roomType] > 0
                ? `border-${accentColor}-200 bg-${accentColor}-50 dark:border-${accentColor}-800 dark:bg-${accentColor}-900/20`
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
            )}
          >
            <div className="flex items-center mb-3">
              <div
                className={cn(
                  "p-2 rounded-full mr-3",
                  roomCounts[roomType] > 0
                    ? `bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 dark:text-${accentColor}-400`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                )}
              >
                {roomIcons[roomType]}
              </div>
              <h3 className="font-semibold text-lg">{roomDisplayNames[roomType]}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {roomCounts[roomType] > 0
                ? `Selected: ${roomCounts[roomType]} ${roomDisplayNames[roomType]}${roomCounts[roomType] > 1 ? "s" : ""}`
                : "Add this room to your cleaning plan."}
            </p>
            <div className="flex items-center justify-between mt-auto">
              {roomCounts[roomType] > 0 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDecrement(roomType)}
                      disabled={roomCounts[roomType] === 0}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-lg">{roomCounts[roomType]}</span>
                    <Button variant="outline" size="icon" onClick={() => handleIncrement(roomType)} className="h-8 w-8">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCustomizeClick(roomType)}
                    className={`text-${accentColor}-600 hover:text-${accentColor}-700 dark:text-${accentColor}-400 dark:hover:text-${accentColor}-300`}
                    aria-label={`Customize ${roomDisplayNames[roomType]}`}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleAddRoom(roomType)}
                  className={`w-full bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white`}
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Room
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      {currentRoomForCustomization && (
        <RoomCustomizationDrawer
          isOpen={isCustomizationDrawerOpen}
          onOpenChange={setIsCustomizationDrawerOpen}
          roomType={currentRoomForCustomization}
          roomConfig={getRoomConfig(currentRoomForCustomization)}
          onSave={onRoomConfigChange}
        />
      )}
    </Card>
  )
}
