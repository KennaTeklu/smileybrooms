"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Check } from "lucide-react"
import { getRoomTiers, getRoomAddOns } from "@/lib/room-tiers"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface SimpleCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
  roomIcon?: string
  roomCount?: number
  config: RoomConfig
  onConfigChange: (config: RoomConfig) => void
}

export function SimpleCustomizationPanel({
  isOpen,
  onClose,
  roomType,
  roomName,
  roomIcon = "🏠",
  roomCount = 1,
  config,
  onConfigChange,
}: SimpleCustomizationPanelProps) {
  const [selectedTier, setSelectedTier] = useState(config?.selectedTier || "ESSENTIAL CLEAN")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(config?.selectedAddOns || [])

  const roomData = useMemo(() => {
    try {
      return {
        tiers: getRoomTiers(roomType) || [],
        addOns: getRoomAddOns(roomType) || [],
      }
    } catch (error) {
      console.error("Error getting room data:", error)
      return {
        tiers: [],
        addOns: [],
      }
    }
  }, [roomType])

  const pricing = useMemo(() => {
    try {
      if (roomData.tiers.length === 0) {
        return {
          basePrice: 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: 0,
        }
      }

      const baseTier = roomData.tiers[0]
      const currentTier = roomData.tiers.find((t) => t.name === selectedTier) || baseTier

      const tierUpgradePrice = Math.max(0, currentTier.price - baseTier.price)

      const addOnsPrice = selectedAddOns.reduce((sum, addOnId) => {
        const addOn = roomData.addOns.find((a) => a.id === addOnId)
        return sum + (addOn?.price || 0)
      }, 0)

      const totalPrice = currentTier.price + addOnsPrice

      return {
        basePrice: baseTier.price,
        tierUpgradePrice,
        addOnsPrice,
        totalPrice: Math.max(0, totalPrice),
      }
    } catch (error) {
      console.error("Error calculating pricing:", error)
      return {
        basePrice: 0,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        totalPrice: 0,
      }
    }
  }, [selectedTier, selectedAddOns, roomData])

  const currentConfig = useMemo(
    () => ({
      roomName: roomType,
      selectedTier,
      selectedAddOns,
      ...pricing,
    }),
    [roomType, selectedTier, selectedAddOns, pricing],
  )

  const handleTierSelect = useCallback((tierName: string) => {
    setSelectedTier(tierName)
  }, [])

  const toggleAddOn = useCallback((addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }, [])

  const handleApplyChanges = useCallback(() => {
    try {
      if (onConfigChange) {
        onConfigChange(currentConfig)
      }
      onClose()
    } catch (error) {
      console.error("Error applying changes:", error)
      onClose()
    }
  }, [onConfigChange, currentConfig, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{roomIcon}</span>
              <div>
                <h2 className="text-lg font-semibold">{roomName}</h2>
                <p className="text-sm text-gray-500">
                  {roomCount} room{roomCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {roomData.tiers.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Cleaning Level</h3>
                <div className="space-y-2">
                  {roomData.tiers.map((tier, index) => (
                    <Card
                      key={tier.id || tier.name || index}
                      className={`cursor-pointer transition-colors ${
                        selectedTier === tier.name
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleTierSelect(tier.name)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tier.name}</span>
                              {selectedTier === tier.name && <Check className="h-4 w-4 text-blue-600" />}
                            </div>
                            {tier.description && <p className="text-sm text-gray-500">{tier.description}</p>}
                          </div>
                          <span className="font-medium">${tier.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {roomData.addOns.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {roomData.addOns.map((addOn, index) => (
                    <Card
                      key={addOn.id || index}
                      className={`cursor-pointer transition-colors ${
                        selectedAddOns.includes(addOn.id)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => toggleAddOn(addOn.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{addOn.name}</span>
                              {selectedAddOns.includes(addOn.id) && <Check className="h-4 w-4 text-green-600" />}
                            </div>
                            {addOn.description && <p className="text-sm text-gray-500">{addOn.description}</p>}
                          </div>
                          <span className="font-medium">+${addOn.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {roomData.tiers.length === 0 && roomData.addOns.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No customization options available for this room type.</p>
                <p className="text-sm text-gray-400 mt-2">Room type: {roomType}</p>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total per room:</span>
              <span className="text-xl font-bold">${pricing.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleApplyChanges} className="flex-1">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
