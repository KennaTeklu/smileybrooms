"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY, // Corrected export name
  BASE_ROOM_RATES,
  STRATEGIC_ADDONS,
  PREMIUM_EXCLUSIVE_SERVICES,
  BUNDLE_NAMING,
} from "@/lib/pricing-config"
import { calculatePrice } from "@/lib/use-price-worker" // Assuming this is where the calculation logic resides
import type { RoomConfig } from "@/lib/room-config"
import { RoomCategory } from "./room-category"
import { ServiceSummaryCard } from "./service-summary-card"
import { PriceBreakdownDetailed } from "./price-breakdown-detailed"
import { Badge } from "./ui/badge"
import { AlertCircle, Info } from "lucide-react" // Using Lucide React icons
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export default function PriceCalculator() {
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    bedroom: 1,
    bathroom: 1,
    kitchen: 1,
    livingRoom: 0,
    diningRoom: 0,
    homeOffice: 0,
    laundryRoom: 0,
    entryway: 0,
    hallway: 0,
    stairs: 0,
  })
  const [serviceTier, setServiceTier] = useState<keyof typeof SERVICE_TIERS>("STANDARD")
  const [cleanlinessLevel, setCleanlinessLevel] = useState<keyof typeof CLEANLINESS_DIFFICULTY>("LIGHT")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [squareFootage, setSquareFootage] = useState<number>(1500)
  const [isRentalProperty, setIsRentalProperty] = useState<boolean>(false)
  const [hasPets, setHasPets] = useState<boolean>(false)
  const [isPostRenovation, setIsPostRenovation] = useState<boolean>(false)
  const [hasMoldWaterDamage, setHasMoldWaterDamage] = useState<boolean>(false)
  const [hasBiohazard, setHasBiohazard] = useState<boolean>(false)

  const handleRoomChange = useCallback((room: keyof RoomConfig, value: number) => {
    setRoomConfig((prev) => ({ ...prev, [room]: value }))
  }, [])

  const handleAddonToggle = useCallback((addonId: string) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }, [])

  const allAddons = useMemo(() => [...STRATEGIC_ADDONS, ...PREMIUM_EXCLUSIVE_SERVICES], [])

  const { totalPrice, breakdown, appliedUpgrades, warnings, recommendedTier } = useMemo(() => {
    const result = calculatePrice({
      roomConfig,
      serviceTier,
      cleanlinessLevel,
      selectedAddons,
      squareFootage,
      isRentalProperty,
      hasPets,
      isPostRenovation,
      hasMoldWaterDamage,
      hasBiohazard,
    })

    // If a higher tier is recommended, update the serviceTier state
    if (
      result.recommendedTier &&
      SERVICE_TIERS[result.recommendedTier].multiplier > SERVICE_TIERS[serviceTier].multiplier
    ) {
      setServiceTier(result.recommendedTier)
    }

    return result
  }, [
    roomConfig,
    serviceTier,
    cleanlinessLevel,
    selectedAddons,
    squareFootage,
    isRentalProperty,
    hasPets,
    isPostRenovation,
    hasMoldWaterDamage,
    hasBiohazard,
  ])

  const currentBundleName = BUNDLE_NAMING[serviceTier]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Configure Your Cleaning Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Tier Selection */}
          <div>
            <Label htmlFor="service-tier" className="text-lg font-semibold mb-2 block">
              Service Tier
            </Label>
            <Select value={serviceTier} onValueChange={(value: keyof typeof SERVICE_TIERS) => setServiceTier(value)}>
              <SelectTrigger id="service-tier">
                <SelectValue placeholder="Select a service tier" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERVICE_TIERS).map(([key, tier]) => (
                  <SelectItem key={key} value={key}>
                    {tier.name} ({BUNDLE_NAMING[key as keyof typeof BUNDLE_NAMING]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {recommendedTier && recommendedTier !== serviceTier && (
              <p className="text-sm text-orange-500 mt-2 flex items-center">
                <Info className="h-4 w-4 mr-1" /> Recommended: {SERVICE_TIERS[recommendedTier].name} tier due to your
                selections.
              </p>
            )}
          </div>

          {/* Cleanliness Level */}
          <div>
            <Label htmlFor="cleanliness-level" className="text-lg font-semibold mb-2 block">
              Current Cleanliness Level
            </Label>
            <Select
              value={cleanlinessLevel}
              onValueChange={(value: keyof typeof CLEANLINESS_DIFFICULTY) => setCleanlinessLevel(value)}
            >
              <SelectTrigger id="cleanliness-level">
                <SelectValue placeholder="Select cleanliness level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CLEANLINESS_DIFFICULTY).map(([key, level]) => (
                  <SelectItem key={key} value={key}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Room Configuration */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Room Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(BASE_ROOM_RATES).map((room) => {
                if (room === "default") return null // Skip the default key
                return (
                  <RoomCategory
                    key={room}
                    roomName={room as keyof RoomConfig}
                    count={roomConfig[room as keyof RoomConfig]}
                    onCountChange={handleRoomChange}
                  />
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Add-ons */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Strategic Add-ons</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAddons.map((addon) => (
                <div key={addon.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={addon.id}
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={() => handleAddonToggle(addon.id)}
                    disabled={addon.includedInElite && serviceTier === "ELITE"}
                  />
                  <Label htmlFor={addon.id} className="flex-1 cursor-pointer">
                    {addon.name}
                    {addon.unit && <span className="text-gray-500 text-sm"> {addon.unit}</span>}
                    {addon.includedInElite && serviceTier === "ELITE" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                              Included in Elite
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            This add-on is automatically included with the Elite service tier.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                  <span className="font-medium">
                    {addon.prices[serviceTier.toLowerCase() as keyof typeof addon.prices] > 0
                      ? `$${addon.prices[serviceTier.toLowerCase() as keyof typeof addon.prices]}`
                      : "Included"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Property Details */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Property Details</Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="square-footage" className="block mb-2">
                  Square Footage: {squareFootage} sq ft
                </Label>
                <Slider
                  id="square-footage"
                  min={500}
                  max={5000}
                  step={100}
                  value={[squareFootage]}
                  onValueChange={(val) => setSquareFootage(val[0])}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rental-property"
                  checked={isRentalProperty}
                  onCheckedChange={(checked) => setIsRentalProperty(!!checked)}
                />
                <Label htmlFor="rental-property">Rental Property</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="has-pets" checked={hasPets} onCheckedChange={(checked) => setHasPets(!!checked)} />
                <Label htmlFor="has-pets">Pets Present</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="post-renovation"
                  checked={isPostRenovation}
                  onCheckedChange={(checked) => setIsPostRenovation(!!checked)}
                />
                <Label htmlFor="post-renovation">Post-Renovation Cleaning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mold-water-damage"
                  checked={hasMoldWaterDamage}
                  onCheckedChange={(checked) => setHasMoldWaterDamage(!!checked)}
                />
                <Label htmlFor="mold-water-damage">Mold/Water Damage Present</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="biohazard"
                  checked={hasBiohazard}
                  onCheckedChange={(checked) => setHasBiohazard(!!checked)}
                />
                <Label htmlFor="biohazard">Biohazard Situation</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-1 space-y-8">
        <ServiceSummaryCard
          totalPrice={totalPrice}
          serviceTier={SERVICE_TIERS[serviceTier].name}
          bundleName={currentBundleName}
          cleanlinessLevel={CLEANLINESS_DIFFICULTY[cleanlinessLevel].name}
          roomCount={Object.values(roomConfig).reduce((sum, count) => sum + count, 0)}
          addonCount={selectedAddons.length}
        />

        <PriceBreakdownDetailed breakdown={breakdown} />

        {appliedUpgrades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertCircle className="h-5 w-5 mr-2" /> Important Service Upgrades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {appliedUpgrades.map((upgrade, index) => (
                  <li key={index} className="text-sm">
                    {upgrade.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {warnings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" /> Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
