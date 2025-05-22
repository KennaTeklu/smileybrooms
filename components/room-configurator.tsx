"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

export interface RoomTier {
  name: string
  description: string
  price: number
  features: string[]
  multiplier?: number
}

export interface RoomAddOn {
  id: string
  name: string
  price: number
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
}

export interface RoomConfiguratorProps {
  roomName: string
  roomIcon: string
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  onConfigChange: (config: RoomConfiguration) => void
  initialConfig?: RoomConfiguration
}

export interface RoomConfiguration {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number // Essential Clean price
  tierUpgradePrice: number // Additional cost for tier upgrade
  addOnsPrice: number // Total cost of add-ons
  reductionsPrice: number // Total savings from reductions
  totalPrice: number // Final price for this room
}

export function RoomConfigurator({
  roomName,
  roomIcon,
  baseTier,
  tiers,
  addOns,
  reductions,
  onConfigChange,
  initialConfig,
}: RoomConfiguratorProps) {
  const [selectedTier, setSelectedTier] = useState<string>(initialConfig?.selectedTier || baseTier.name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig?.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig?.selectedReductions || [])

  // Calculate the price components
  const calculatePrices = () => {
    // Base price is always the Essential Clean price
    const basePrice = baseTier.price

    // Get selected tier
    const selectedTierObj = tiers.find((tier) => tier.name === selectedTier)

    // Calculate tier upgrade price (difference between selected tier and base tier)
    const tierUpgradePrice = selectedTierObj && selectedTier !== baseTier.name ? selectedTierObj.price - basePrice : 0

    // Calculate add-ons price
    const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Calculate reductions price
    const reductionsPrice = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    // Calculate total price
    const totalPrice = basePrice + tierUpgradePrice + addOnsPrice - reductionsPrice

    return {
      basePrice,
      tierUpgradePrice,
      addOnsPrice,
      reductionsPrice,
      totalPrice,
    }
  }

  // Update parent component when configuration changes
  const updateConfiguration = () => {
    const prices = calculatePrices()

    onConfigChange({
      roomName,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      ...prices,
    })
  }

  // Update configuration when selections change
  useEffect(() => {
    updateConfiguration()
  }, [selectedTier, selectedAddOns, selectedReductions])

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier)
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns((prev) => {
      if (checked) {
        return [...prev, addOnId]
      } else {
        return prev.filter((id) => id !== addOnId)
      }
    })
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    setSelectedReductions((prev) => {
      if (checked) {
        return [...prev, reductionId]
      } else {
        return prev.filter((id) => id !== reductionId)
      }
    })
  }

  // Calculate prices for display
  const { totalPrice } = calculatePrices()

  return (
    <Card className="w-full mb-6 border-2 border-blue-100">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roomIcon}</span>
            <CardTitle>{roomName}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            ${totalPrice.toFixed(2)}
          </Badge>
        </div>
        <CardDescription>Customize your cleaning options for this room</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">TIER OPTIONS</h3>
            <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-3">
              {tiers.map((tier, index) => {
                // Calculate multiplier for display
                const multiplier = tier.multiplier || (index === 0 ? 1 : index === 1 ? 3 : 9)
                const multiplierText = index === 0 ? "Basic" : `${multiplier}x Basic`

                return (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border ${selectedTier === tier.name ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  >
                    <div className="flex items-start">
                      <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                      <div className="ml-3 w-full">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`tier-${tier.name}`} className="font-medium text-base">
                            {tier.name}
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">${tier.price.toFixed(2)}</span>
                            <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}>
                              {multiplierText}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                        <ul className="mt-2 space-y-1">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">ADD SERVICES</h3>
              <div className="space-y-3 border-l-4 border-green-200 pl-4">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-start">
                    <Checkbox
                      id={`addon-${addOn.id}`}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label htmlFor={`addon-${addOn.id}`} className="flex items-center">
                        {addOn.name}
                        <Badge variant="outline" className="ml-2">
                          +${addOn.price.toFixed(2)}
                        </Badge>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-700">REMOVE SERVICES</h3>
              <div className="space-y-3 border-l-4 border-red-200 pl-4">
                {reductions.map((reduction) => (
                  <div key={reduction.id} className="flex items-start">
                    <Checkbox
                      id={`reduction-${reduction.id}`}
                      checked={selectedReductions.includes(reduction.id)}
                      onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label htmlFor={`reduction-${reduction.id}`} className="flex items-center">
                        {reduction.name}
                        <Badge variant="outline" className="ml-2 text-red-500">
                          -${reduction.discount.toFixed(2)}
                        </Badge>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Specialty Options
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Room Total</p>
                <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
