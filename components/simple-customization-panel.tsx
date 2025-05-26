"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Check } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"

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
  const [selectedTier, setSelectedTier] = useState(config.selectedTier)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(config.selectedAddOns)
  const [selectedReductions, setSelectedReductions] = useState<string[]>(config.selectedReductions)

  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)
  const reductions = getRoomReductions(roomType)

  // Calculate pricing
  const calculatePricing = () => {
    const baseTier = tiers[0]
    const currentTier = tiers.find((t) => t.name === selectedTier) || baseTier

    const tierUpgradePrice = currentTier.price - baseTier.price
    const addOnsPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return sum + (addOn?.price || 0)
    }, 0)

    const reductionsPrice = selectedReductions.reduce((sum, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return sum + (reduction?.discount || 0)
    }, 0)

    const totalPrice = currentTier.price + addOnsPrice - reductionsPrice

    return {
      basePrice: baseTier.price,
      tierUpgradePrice,
      addOnsPrice,
      reductionsPrice,
      totalPrice: Math.max(0, totalPrice),
    }
  }

  const pricing = calculatePricing()

  // Update config when selections change
  useEffect(() => {
    const newConfig: RoomConfig = {
      roomName: roomType,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      ...pricing,
    }
    onConfigChange(newConfig)
  }, [selectedTier, selectedAddOns, selectedReductions, roomType, onConfigChange])

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const toggleReduction = (reductionId: string) => {
    setSelectedReductions((prev) =>
      prev.includes(reductionId) ? prev.filter((id) => id !== reductionId) : [...prev, reductionId],
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Cleaning Tiers */}
            <div>
              <h3 className="font-medium mb-3">Cleaning Level</h3>
              <div className="space-y-2">
                {tiers.map((tier) => (
                  <Card
                    key={tier.name}
                    className={`cursor-pointer transition-colors ${
                      selectedTier === tier.name
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedTier(tier.name)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tier.name}</span>
                            {selectedTier === tier.name && <Check className="h-4 w-4 text-blue-600" />}
                          </div>
                          <p className="text-sm text-gray-500">{tier.description}</p>
                        </div>
                        <span className="font-medium">${tier.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {addOns.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {addOns.map((addOn) => (
                    <Card
                      key={addOn.id}
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
                            <p className="text-sm text-gray-500">{addOn.description}</p>
                          </div>
                          <span className="font-medium">+${addOn.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Reductions */}
            {reductions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Skip Services (Discounts)</h3>
                <div className="space-y-2">
                  {reductions.map((reduction) => (
                    <Card
                      key={reduction.id}
                      className={`cursor-pointer transition-colors ${
                        selectedReductions.includes(reduction.id)
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => toggleReduction(reduction.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{reduction.name}</span>
                              {selectedReductions.includes(reduction.id) && (
                                <Check className="h-4 w-4 text-orange-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{reduction.description}</p>
                          </div>
                          <span className="font-medium text-orange-600">-${reduction.discount}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total per room:</span>
              <span className="text-xl font-bold">${pricing.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onClose} className="flex-1">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
