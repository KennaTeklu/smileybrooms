"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  STRATEGIC_ADDONS,
  PREMIUM_EXCLUSIVE_SERVICES,
} from "@/lib/pricing-config"
import { usePriceWorker } from "@/lib/use-price-worker"
import type { PriceBreakdownItem, ServiceConfig } from "@/lib/workers/price-calculator.worker"
import { cn } from "@/lib/utils"

// Helper to format currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

export default function ServiceCalculatorPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { calculatePrice, result, loading, error } = usePriceWorker()

  const [rooms, setRooms] = useState<Record<string, number>>({
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    livingRoom: 0,
    diningRoom: 0,
    hallway: 0,
    entryway: 0,
    stairs: 0,
    homeOffice: 0,
    laundryRoom: 0,
  })
  const [serviceTier, setServiceTier] = useState<keyof typeof SERVICE_TIERS>("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState<number>(CLEANLINESS_DIFFICULTY.NORMAL.level)
  const [frequency, setFrequency] = useState<string>("one_time")
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; quantity?: number }[]>([])
  const [selectedExclusiveServices, setSelectedExclusiveServices] = useState<string[]>([])
  const [waiverSigned, setWaiverSigned] = useState(false)
  const [propertySizeSqFt, setPropertySizeSqFt] = useState<number | string>("")
  const [propertyType, setPropertyType] = useState<ServiceConfig["propertyType"]>(null)
  const [isRentalProperty, setIsRentalProperty] = useState(false)
  const [hasPets, setHasPets] = useState(false)
  const [isPostRenovation, setIsPostRenovation] = useState(false)
  const [hasMoldWaterDamage, setHasMoldWaterDamage] = useState(false)

  const handleRoomChange = (roomType: string, change: number) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] + change),
    }))
  }

  const handleAddonToggle = (addonId: string, isChecked: boolean) => {
    setSelectedAddons((prev) => {
      if (isChecked) {
        const addon = STRATEGIC_ADDONS.find((a) => a.id === addonId)
        return addon ? [...prev, { id: addonId, quantity: addon.unit ? 1 : undefined }] : prev
      } else {
        return prev.filter((addon) => addon.id !== addonId)
      }
    })
  }

  const handleAddonQuantityChange = (addonId: string, quantity: number) => {
    setSelectedAddons((prev) =>
      prev.map((addon) => (addon.id === addonId ? { ...addon, quantity: Math.max(1, quantity) } : addon)),
    )
  }

  const handleExclusiveServiceToggle = (serviceId: string, isChecked: boolean) => {
    setSelectedExclusiveServices((prev) => (isChecked ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)))
  }

  const currentConfig: ServiceConfig = useMemo(
    () => ({
      rooms,
      serviceTier,
      cleanlinessLevel,
      frequency,
      paymentFrequency: "monthly", // Placeholder, not used in current worker logic
      selectedAddons,
      selectedExclusiveServices,
      waiverSigned,
      propertySizeSqFt: typeof propertySizeSqFt === "string" ? 0 : propertySizeSqFt,
      propertyType,
      isRentalProperty,
      hasPets,
      isPostRenovation,
      hasMoldWaterDamage,
    }),
    [
      rooms,
      serviceTier,
      cleanlinessLevel,
      frequency,
      selectedAddons,
      selectedExclusiveServices,
      waiverSigned,
      propertySizeSqFt,
      propertyType,
      isRentalProperty,
      hasPets,
      isPostRenovation,
      hasMoldWaterDamage,
    ],
  )

  useEffect(() => {
    calculatePrice(currentConfig)
  }, [currentConfig, calculatePrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (result) {
      localStorage.setItem("serviceSummary", JSON.stringify(result))
      toast({
        title: "Calculation Complete!",
        description: "Your service summary is ready.",
      })
      router.push("/email-summary")
    } else {
      toast({
        title: "Calculation Error",
        description: "Please ensure all fields are filled correctly.",
        variant: "destructive",
      })
    }
  }

  const cleanlinessLevelsArray = Object.values(CLEANLINESS_DIFFICULTY).sort((a, b) => a.level - b.level)

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Service Price Calculator</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Rooms & Property Details */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="property-type" className="text-base">
                Property Type
              </Label>
              <Select
                onValueChange={(value: ServiceConfig["propertyType"]) => setPropertyType(value)}
                value={propertyType || ""}
              >
                <SelectTrigger id="property-type">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio Apartment</SelectItem>
                  <SelectItem value="3br_home">3 Bedroom Home</SelectItem>
                  <SelectItem value="5br_mansion">5 Bedroom Mansion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property-size" className="text-base">
                Property Size (Sq Ft)
              </Label>
              <Input
                id="property-size"
                type="number"
                placeholder="e.g., 1500"
                value={propertySizeSqFt}
                onChange={(e) => setPropertySizeSqFt(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rooms</h3>
              {Object.entries(rooms).map(([roomType, count]) => (
                <div key={roomType} className="flex items-center justify-between">
                  <Label htmlFor={`room-${roomType}`} className="capitalize">
                    {roomType.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomChange(roomType, -1)}
                      disabled={count === 0}
                    >
                      -
                    </Button>
                    <Input id={`room-${roomType}`} type="number" value={count} readOnly className="w-16 text-center" />
                    <Button type="button" variant="outline" size="icon" onClick={() => handleRoomChange(roomType, 1)}>
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Property Factors</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-rental"
                  checked={isRentalProperty}
                  onCheckedChange={(checked: boolean) => setIsRentalProperty(checked)}
                />
                <Label htmlFor="is-rental">Is this a rental property?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="has-pets" checked={hasPets} onCheckedChange={(checked: boolean) => setHasPets(checked)} />
                <Label htmlFor="has-pets">Do you have pets?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="post-renovation"
                  checked={isPostRenovation}
                  onCheckedChange={(checked: boolean) => setIsPostRenovation(checked)}
                />
                <Label htmlFor="post-renovation">Post-renovation cleaning?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mold-water-damage"
                  checked={hasMoldWaterDamage}
                  onCheckedChange={(checked: boolean) => setHasMoldWaterDamage(checked)}
                />
                <Label htmlFor="mold-water-damage">Mold or water damage present?</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column: Service Options */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Service Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="service-tier" className="text-base">
                Service Tier
              </Label>
              <Select onValueChange={(value: keyof typeof SERVICE_TIERS) => setServiceTier(value)} value={serviceTier}>
                <SelectTrigger id="service-tier">
                  <SelectValue placeholder="Select service tier" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SERVICE_TIERS).map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cleanliness-level" className="text-base block mb-2">
                Current Cleanliness Level:{" "}
                <span className="font-semibold">
                  {cleanlinessLevelsArray.find((c) => c.level === cleanlinessLevel)?.name}
                </span>
              </Label>
              <Slider
                id="cleanliness-level"
                min={cleanlinessLevelsArray[0].level}
                max={cleanlinessLevelsArray[cleanlinessLevelsArray.length - 1].level}
                step={1}
                value={[cleanlinessLevel]}
                onValueChange={(val) => setCleanlinessLevel(val[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{cleanlinessLevelsArray[0].name}</span>
                <span>{cleanlinessLevelsArray[cleanlinessLevelsArray.length - 1].name}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Strategic Add-Ons</h3>
              {STRATEGIC_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some((sa) => sa.id === addon.id)
                const currentQuantity = selectedAddons.find((sa) => sa.id === addon.id)?.quantity || 1
                return (
                  <div key={addon.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked: boolean) => handleAddonToggle(addon.id, checked)}
                      />
                      <Label htmlFor={`addon-${addon.id}`}>
                        {addon.name} ({formatCurrency(addon.prices[serviceTier])}
                        {addon.unit ? ` ${addon.unit}` : ""})
                      </Label>
                    </div>
                    {addon.unit && isSelected && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddonQuantityChange(addon.id, currentQuantity - 1)}
                          disabled={currentQuantity <= 1}
                        >
                          -
                        </Button>
                        <Input type="number" value={currentQuantity} readOnly className="w-16 text-center" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddonQuantityChange(addon.id, currentQuantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Premium Exclusive Services (Elite Tier Only)</h3>
              {PREMIUM_EXCLUSIVE_SERVICES.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exclusive-${service.id}`}
                    checked={selectedExclusiveServices.includes(service.id)}
                    onCheckedChange={(checked: boolean) => handleExclusiveServiceToggle(service.id, checked)}
                    disabled={serviceTier !== SERVICE_TIERS.ELITE.id}
                  />
                  <Label
                    htmlFor={`exclusive-${service.id}`}
                    className={cn(serviceTier !== SERVICE_TIERS.ELITE.id && "text-gray-400 dark:text-gray-600")}
                  >
                    {service.name} ({formatCurrency(service.price)}
                    {service.unit ? ` ${service.unit}` : ""})
                  </Label>
                </div>
              ))}
              {serviceTier !== SERVICE_TIERS.ELITE.id && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  *These services are only available with the Elite tier.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <Label htmlFor="frequency" className="text-base">
                Cleaning Frequency
              </Label>
              <RadioGroup onValueChange={setFrequency} value={frequency} className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one_time" id="one_time" />
                  <Label htmlFor="one_time">One-Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biweekly" id="biweekly" />
                  <Label htmlFor="biweekly">Bi-Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="waiver-signed"
                checked={waiverSigned}
                onCheckedChange={(checked: boolean) => setWaiverSigned(checked)}
              />
              <Label htmlFor="waiver-signed">Sign waiver for 15% discount</Label>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Summary & Breakdown */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Price Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center h-48">
                <p className="text-lg text-gray-500 dark:text-gray-400">Calculating price...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-500 dark:text-red-400 h-48 flex items-center justify-center">
                <p>Error: {error}</p>
              </div>
            )}
            {result && !loading && !error && (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Estimated First Service Price:</p>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(result.firstServicePrice)}</p>
                  {frequency !== "one_time" && (
                    <>
                      <p className="text-lg font-semibold mt-4">Estimated Recurring Service Price:</p>
                      <p className="text-3xl font-bold text-secondary">
                        {formatCurrency(result.recurringServicePrice)}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Estimated Duration: {result.estimatedDuration} minutes
                  </p>
                  {result.enforcedTierReason && (
                    <p className="text-sm text-orange-500 dark:text-orange-400 mt-2">
                      *Note: {result.enforcedTierReason}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Detailed Breakdown:</h3>
                  {result.breakdown.map((item: PriceBreakdownItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={cn(item.type === "discount" && "text-green-600 dark:text-green-400")}>
                        {item.item}
                        {item.description && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                        )}
                      </span>
                      <span className={cn(item.type === "discount" && "text-green-600 dark:text-green-400")}>
                        {item.value < 0 ? "-" : ""}
                        {formatCurrency(Math.abs(item.value))}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button type="submit" className="w-full mt-6" disabled={loading || !result}>
              Proceed to Summary
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
