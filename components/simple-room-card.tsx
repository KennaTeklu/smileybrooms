"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MinusCircle, Settings } from "lucide-react"
import { RoomCustomizationModal } from "./room-customization-modal"
import { getRoomTiers } from "@/lib/room-tiers"

interface SimpleRoomCardProps {
  roomType: string
  roomName: string
  roomIcon: string
  count: number
  onCountChange: (increment: boolean) => void
  customization?: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    matrixAddServices: string[]
    matrixRemoveServices: string[]
    totalPrice: number
  }
  onCustomizationChange: (config: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    matrixAddServices: string[]
    matrixRemoveServices: string[]
    totalPrice: number
  }) => void
}

export function SimpleRoomCard({
  roomType,
  roomName,
  roomIcon,
  count,
  onCountChange,
  customization,
  onCustomizationChange,
}: SimpleRoomCardProps) {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

  const tiers = getRoomTiers(roomType)
  const basePrice = tiers[0].price
  const currentPrice = customization?.totalPrice || basePrice
  const isCustomized =
    customization &&
    (customization.selectedTier !== tiers[0].name ||
      customization.selectedAddOns.length > 0 ||
      customization.selectedReductions.length > 0 ||
      customization.matrixAddServices.length > 0 ||
      customization.matrixRemoveServices.length > 0)

  return (
    <>
      <Card className={`border ${count > 0 ? "border-blue-500 bg-blue-50/50" : "border-gray-200"} transition-all`}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Room Icon and Name */}
            <div className="text-3xl">{roomIcon}</div>
            <h3 className="font-medium text-sm">{roomName}</h3>

            {/* Price Display */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold">${currentPrice.toFixed(2)}</div>
              {isCustomized && <div className="text-xs text-gray-500 line-through">${basePrice.toFixed(2)}</div>}
            </div>

            {/* Count Selector */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCountChange(false)}
                disabled={count <= 0}
                className="h-8 w-8"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="font-medium text-lg w-6 text-center">{count}</span>
              <Button variant="outline" size="icon" onClick={() => onCountChange(true)} className="h-8 w-8">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* Customize Button */}
            {count > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomizationOpen(true)}
                className="w-full flex items-center gap-2"
              >
                <Settings className="h-3 w-3" />
                Customize
                {isCustomized && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    Modified
                  </Badge>
                )}
              </Button>
            )}

            {/* Customization Summary */}
            {count > 0 && isCustomized && (
              <div className="text-xs text-gray-600 space-y-1">
                {customization.selectedTier !== tiers[0].name && <div>• {customization.selectedTier}</div>}
                {customization.selectedAddOns.length + customization.matrixAddServices.length > 0 && (
                  <div>• {customization.selectedAddOns.length + customization.matrixAddServices.length} add-ons</div>
                )}
                {customization.selectedReductions.length + customization.matrixRemoveServices.length > 0 && (
                  <div>
                    • {customization.selectedReductions.length + customization.matrixRemoveServices.length} reductions
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customization Modal */}
      <RoomCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        roomName={roomName}
        roomIcon={roomIcon}
        roomType={roomType}
        initialConfig={customization}
        onSave={onCustomizationChange}
      />
    </>
  )
}
