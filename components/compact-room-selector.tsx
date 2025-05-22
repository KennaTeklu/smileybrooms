"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  RoomCustomizationDrawer,
  type RoomConfiguration,
  type RoomTier,
  type RoomAddOn,
  type RoomReduction,
} from "./room-customization-drawer"

interface CompactRoomSelectorProps {
  roomId: string
  roomName: string
  roomIcon: React.ReactNode
  basePrice: number
  count: number
  onCountChange: (roomId: string, count: number) => void
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  onConfigChange: (roomId: string, config: RoomConfiguration) => void
  initialConfig?: RoomConfiguration
}

export function CompactRoomSelector({
  roomId,
  roomName,
  roomIcon,
  basePrice,
  count,
  onCountChange,
  baseTier,
  tiers,
  addOns,
  reductions,
  onConfigChange,
  initialConfig,
}: CompactRoomSelectorProps) {
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<RoomConfiguration>(
    initialConfig || {
      roomName,
      selectedTier: baseTier.name,
      selectedAddOns: [],
      selectedReductions: [],
      totalPrice: basePrice,
    },
  )

  const incrementCount = () => {
    onCountChange(roomId, count + 1)
  }

  const decrementCount = () => {
    if (count > 0) {
      onCountChange(roomId, count - 1)
    }
  }

  const handleConfigSave = (config: RoomConfiguration) => {
    setCurrentConfig(config)
    onConfigChange(roomId, config)
  }

  // Determine if room has customizations
  const hasCustomizations =
    currentConfig.selectedTier !== baseTier.name ||
    currentConfig.selectedAddOns.length > 0 ||
    currentConfig.selectedReductions.length > 0

  return (
    <>
      <Card
        className={cn(
          "border transition-all",
          count > 0
            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
            : "border-gray-200 dark:border-gray-800",
          hasCustomizations && count > 0 ? "border-green-300 dark:border-green-800" : "",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div
                className={cn(
                  "p-2 rounded-full mr-2",
                  count > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                {roomIcon}
              </div>
              <div>
                <p className="font-medium">{roomName}</p>
                <p className="text-xs text-gray-500">
                  ${currentConfig.totalPrice.toFixed(2)} per room
                  {hasCustomizations && <span className="ml-1 text-green-600">(Customized)</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementCount}
                disabled={count === 0}
                className="h-7 w-7"
                aria-label={`Decrease ${roomName} count`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center">{count}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementCount}
                className="h-7 w-7"
                aria-label={`Increase ${roomName} count`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* This is the customize button that was missing or not visible */}
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-1 text-xs mt-2"
            onClick={() => setIsCustomizing(true)}
          >
            <Settings className="h-3 w-3" />
            Customize
          </Button>

          {hasCustomizations && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {currentConfig.selectedTier !== baseTier.name && (
                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                    {currentConfig.selectedTier}
                  </Badge>
                )}
                {currentConfig.selectedAddOns.map((addOnId) => (
                  <Badge key={addOnId} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20">
                    {addOns.find((a) => a.id === addOnId)?.name}
                  </Badge>
                ))}
                {currentConfig.selectedReductions.map((reductionId) => (
                  <Badge key={reductionId} variant="outline" className="text-xs bg-red-50 dark:bg-red-900/20">
                    No {reductions.find((r) => r.id === reductionId)?.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RoomCustomizationDrawer
        open={isCustomizing}
        onOpenChange={setIsCustomizing}
        roomName={roomName}
        roomIcon={roomIcon}
        baseTier={baseTier}
        tiers={tiers}
        addOns={addOns}
        reductions={reductions}
        initialConfig={currentConfig}
        onSave={handleConfigSave}
      />
    </>
  )
}
