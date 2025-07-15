"use client"

import { useEffect } from "react"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { type RoomTierEnum, getRoomTiers, getRoomReductions } from "@/lib/room-tiers"
import { useToast } from "@/components/ui/use-toast"
import { Check, Star, Zap, Shield } from "lucide-react"

interface RoomConfiguratorProps {
  roomType: string
  initialConfig: {
    selectedTier: RoomTierEnum
    selectedReductions: string[]
  }
  onConfigChange: (newConfig: { selectedTier: RoomTierEnum; selectedReductions: string[] }) => void
}

export function RoomConfigurator({ roomType, initialConfig, onConfigChange }: RoomConfiguratorProps) {
  const { toast } = useToast()
  const [selectedTier, setSelectedTier] = useState<RoomTierEnum>(initialConfig.selectedTier)
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig.selectedReductions)

  const tiers = useMemo(() => getRoomTiers(roomType), [roomType])
  const reductions = useMemo(() => getRoomReductions(roomType), [roomType])

  // Update local state when initialConfig changes (e.g., when a new room type is selected)
  useEffect(() => {
    setSelectedTier(initialConfig.selectedTier)
    setSelectedReductions(initialConfig.selectedReductions)
  }, [initialConfig])

  const calculateCurrentPrice = useCallback(() => {
    const selectedTierObj = tiers.find((tier) => tier.name === selectedTier)
    let price = selectedTierObj ? selectedTierObj.price : 0

    selectedReductions.forEach((reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      if (reduction) {
        price -= reduction.discount
      }
    })
    return Math.max(0, price)
  }, [selectedTier, selectedReductions, tiers, reductions])

  const handleTierChange = (tierName: RoomTierEnum) => {
    setSelectedTier(tierName)
    onConfigChange({ selectedTier: tierName, selectedReductions })
  }

  const handleReductionToggle = (reductionId: string, checked: boolean) => {
    const newReductions = checked
      ? [...selectedReductions, reductionId]
      : selectedReductions.filter((id) => id !== reductionId)
    setSelectedReductions(newReductions)
    onConfigChange({ selectedTier, selectedReductions: newReductions })
  }

  const getTierIcon = (tierName: string) => {
    if (tierName.includes("LUXURY")) return <Star className="h-4 w-4" />
    if (tierName.includes("PREMIUM")) return <Zap className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-6">
        {/* Service Tiers */}
        <div>
          <h3 className="text-lg font-medium mb-4">Select Cleaning Tier</h3>
          <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedTier === tier.name
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <RadioGroupItem value={tier.name} id={tier.id} className="mt-1" />
                <div className="grid gap-1.5 leading-none flex-1">
                  <Label
                    htmlFor={tier.id}
                    className="text-base font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {getTierIcon(tier.name)}
                      {tier.name}
                    </span>
                    <span>{formatCurrency(tier.price)}</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  {tier.detailedTasks && (
                    <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      {tier.detailedTasks.map((task, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" /> {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Reductions */}
        {reductions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Service Reductions (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">Select services to skip for a reduced price.</p>
            <div className="space-y-3">
              {reductions.map((reduction) => (
                <div
                  key={reduction.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedReductions.includes(reduction.id)
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Checkbox
                    id={reduction.id}
                    checked={selectedReductions.includes(reduction.id)}
                    onCheckedChange={(checked) => handleReductionToggle(reduction.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={reduction.id}
                      className="text-base font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{reduction.name}</span>
                      <span className="text-red-600 dark:text-red-400">-{formatCurrency(reduction.discount)}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">{reduction.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Price Breakdown for this room */}
        <div>
          <h3 className="text-lg font-medium mb-4">Price Breakdown for this {roomType.replace(/-/g, " ")}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Tier ({selectedTier})</span>
              <span>{formatCurrency(tiers.find((t) => t.name === selectedTier)?.price || 0)}</span>
            </div>
            {selectedReductions.length > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Reductions</span>
                <span>
                  -
                  {formatCurrency(
                    selectedReductions.reduce(
                      (sum, id) => sum + (reductions.find((r) => r.id === id)?.discount || 0),
                      0,
                    ),
                  )}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Price Per {roomType.replace(/-/g, " ")}</span>
              <span>{formatCurrency(calculateCurrentPrice())}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
