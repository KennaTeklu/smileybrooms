"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { PlusIcon, MinusIcon, Settings } from "lucide-react"
import {
  roomDisplayNames,
  getRoomTiers,
  getRoomAddOns,
  getRoomReductions,
  fullHousePackages,
  type RoomTier,
  type RoomAddOn,
  type RoomReduction,
} from "@/lib/room-tiers"
import { formatCurrency } from "@/lib/utils"
import { RoomCustomizationDrawer } from "@/components/room-customization-drawer"
import { RoomVisualization } from "@/components/room-visualization" // Import RoomVisualization
import { defaultAddOns, defaultReductions, roomIcons } from "@/lib/default-values" // Import defaultAddOns, defaultReductions, and roomIcons

interface RoomConfig {
  cleanliness: number
  specialInstructions: string
}

interface PriceCalculatorProps {
  initialSelectedRooms?: Record<string, number>
  initialServiceType?: "essential" | "premium" | "luxury"
  onCalculationComplete?: (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "essential" | "premium" | "luxury"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
    selectedAddOns: string[]
    selectedReductions: string[]
  }) => void
}

export function PriceCalculator({
  initialSelectedRooms = {},
  initialServiceType = "essential",
  onCalculationComplete,
}: PriceCalculatorProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(initialSelectedRooms)
  const [selectedServiceType, setSelectedServiceType] = useState<"essential" | "premium" | "luxury">(initialServiceType)
  const [frequency, setFrequency] = useState("one-time")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(50) // 0-100 scale
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedReductions, setSelectedReductions] = useState<string[]>([]) // New state for reductions

  const [isCustomizationDrawerOpen, setIsCustomizationDrawerOpen] = useState(false)
  const [currentRoomForCustomization, setCurrentRoomForCustomization] = useState<string | null>(null)
  const [roomConfigs, setRoomConfigs] = useState<Record<string, RoomConfig>>({})

  // State for selected tier details for visualization
  const [selectedTierDetailsForViz, setSelectedTierDetailsForViz] = useState<RoomTier | undefined>(undefined)
  const [selectedAddOnsDetailsForViz, setSelectedAddOnsDetailsForViz] = useState<RoomAddOn[]>([])

  // Effect to initialize selected rooms and service type from props
  useEffect(() => {
    if (Object.keys(initialSelectedRooms).length > 0) {
      setSelectedRooms(initialSelectedRooms)
    }
    if (initialServiceType) {
      setSelectedServiceType(initialServiceType)
    }
  }, [initialSelectedRooms, initialServiceType])

  // Determine the base price per room based on selected service type
  const getBasePrice = useCallback(
    (roomType: string): number => {
      const tiers = getRoomTiers(roomType)
      const tier = tiers.find((t) => t.name.toLowerCase().includes(selectedServiceType))
      return tier ? tier.price : 0
    },
    [selectedServiceType],
  )

  // Calculate total price
  const { totalPrice, priceMultiplier, isServiceAvailable, selectedTierObject } = useMemo(() => {
    let currentTotalPrice = 0
    let currentPriceMultiplier = 1.0
    let serviceAvailable = true
    let tierObj: RoomTier | undefined = undefined

    // Handle full house packages first
    const selectedPackage = fullHousePackages.find(
      (pkg) => pkg.id === Object.keys(selectedRooms)[0] && Object.values(selectedRooms)[0] === 1,
    )
    if (selectedPackage) {
      currentTotalPrice = selectedPackage.basePrice
      // Set service type based on package tier
      setSelectedServiceType(selectedPackage.tier)
      // Find the corresponding default tier for visualization (e.g., "default-essential" for essential package)
      tierObj = getRoomTiers("default").find((t) => t.name.toLowerCase().includes(selectedPackage.tier))
    } else {
      // Calculate for individual rooms
      Object.entries(selectedRooms).forEach(([roomType, count]) => {
        if (count > 0) {
          const basePrice = getBasePrice(roomType)
          currentTotalPrice += basePrice * count

          // For visualization, if only one room is selected, use its tier details
          if (Object.keys(selectedRooms).length === 1 && count === 1) {
            tierObj = getRoomTiers(roomType).find((t) => t.name.toLowerCase().includes(selectedServiceType))
          }
        }
      })
    }

    // Apply add-on prices
    selectedAddOns.forEach((addOnId) => {
      // Find the add-on across all room types or a default set
      const allAddOns = Object.values(defaultAddOns).flat()
      const addOn = allAddOns.find((a) => a.id === addOnId)
      if (addOn) {
        currentTotalPrice += addOn.price
      }
    })

    // Apply reduction discounts
    selectedReductions.forEach((reductionId) => {
      // Find the reduction across all room types or a default set
      const allReductions = Object.values(defaultReductions).flat()
      const reduction = allReductions.find((r) => r.id === reductionId)
      if (reduction) {
        currentTotalPrice -= reduction.discount
      }
    })

    // Ensure total price doesn't go below zero
    currentTotalPrice = Math.max(0, currentTotalPrice)

    // Apply cleanliness level multiplier
    if (cleanlinessLevel < 50) {
      currentPriceMultiplier = 1 + (50 - cleanlinessLevel) * 0.01 // Up to 50% increase for very dirty
    } else if (cleanlinessLevel > 50) {
      currentPriceMultiplier = 1 - (cleanlinessLevel - 50) * 0.005 // Up to 25% decrease for very clean
    }
    currentTotalPrice *= currentPriceMultiplier

    // Placeholder for service availability logic
    // In a real app, this would check address, team availability, etc.
    if (currentTotalPrice === 0 && Object.values(selectedRooms).every((count) => count === 0)) {
      serviceAvailable = false // No rooms selected, no service
    } else {
      serviceAvailable = true // Assume available if rooms are selected
    }

    return {
      totalPrice: currentTotalPrice,
      priceMultiplier: currentPriceMultiplier,
      isServiceAvailable: serviceAvailable,
      selectedTierObject: tierObj,
    }
  }, [
    selectedRooms,
    selectedServiceType,
    frequency,
    cleanlinessLevel,
    selectedAddOns,
    selectedReductions,
    getBasePrice,
  ])

  // Update selected tier details for visualization whenever selectedServiceType or selectedRooms changes
  useEffect(() => {
    const vizRoomType = Object.keys(selectedRooms)[0] || "default"
    if (vizRoomType === "default" && Object.keys(selectedRooms).length === 0) {
      // If no rooms selected, default to a generic visualization
      setSelectedTierDetailsForViz(
        getRoomTiers("default").find((t) => t.name.toLowerCase().includes(selectedServiceType)),
      )
    } else if (vizRoomType) {
      // If a specific room is selected, use its tier details
      setSelectedTierDetailsForViz(
        getRoomTiers(vizRoomType).find((t) => t.name.toLowerCase().includes(selectedServiceType)),
      )
    } else {
      setSelectedTierDetailsForViz(undefined)
    }

    // Collect details for selected add-ons for visualization
    const allAvailableAddOns = Object.values(defaultAddOns).flat()
    const currentAddOnsDetails = selectedAddOns
      .map((id) => allAvailableAddOns.find((ao) => ao.id === id))
      .filter(Boolean) as RoomAddOn[]
    setSelectedAddOnsDetailsForViz(currentAddOnsDetails)
  }, [selectedRooms, selectedServiceType, selectedAddOns])

  const handleRoomCountChange = (roomType: string, change: number) => {
    setSelectedRooms((prev) => {
      const newCount = (prev[roomType] || 0) + change
      if (newCount < 0) return prev // Prevent negative counts
      const newRooms = { ...prev, [roomType]: newCount }
      // Remove room if count is 0
      if (newCount === 0) {
        delete newRooms[roomType]
      }
      return newRooms
    })
  }

  const handleCustomizeClick = (roomType: string) => {
    setCurrentRoomForCustomization(roomType)
    setIsCustomizationDrawerOpen(true)
  }

  const handleRoomConfigChange = (roomType: string, config: RoomConfig) => {
    setRoomConfigs((prev) => ({ ...prev, [roomType]: config }))
  }

  const getRoomConfig = (roomType: string) => {
    return roomConfigs[roomType] || { cleanliness: 50, specialInstructions: "" }
  }

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const handleReductionToggle = (reductionId: string) => {
    setSelectedReductions((prev) =>
      prev.includes(reductionId) ? prev.filter((id) => id !== reductionId) : [...prev, reductionId],
    )
  }

  // Callback for when calculation is complete (e.g., for parent component)
  useEffect(() => {
    if (onCalculationComplete) {
      onCalculationComplete({
        rooms: selectedRooms,
        frequency,
        totalPrice,
        serviceType: selectedServiceType,
        cleanlinessLevel,
        priceMultiplier,
        isServiceAvailable,
        addressId: "mock-address-id", // Placeholder
        paymentFrequency: "per_service", // Placeholder
        isRecurring: frequency !== "one-time",
        recurringInterval: frequency === "weekly" ? "week" : frequency === "monthly" ? "month" : "year", // Placeholder
        selectedAddOns,
        selectedReductions,
      })
    }
  }, [
    totalPrice,
    selectedRooms,
    frequency,
    selectedServiceType,
    cleanlinessLevel,
    priceMultiplier,
    isServiceAvailable,
    selectedAddOns,
    selectedReductions,
    onCalculationComplete,
  ])

  const availableAddOns = useMemo(() => {
    const allAvailable = new Set<RoomAddOn>()
    Object.keys(selectedRooms).forEach((roomType) => {
      getRoomAddOns(roomType).forEach((addOn) => allAvailable.add(addOn))
    })
    // Also add default add-ons if no specific rooms are selected or for general services
    if (Object.keys(selectedRooms).length === 0) {
      getRoomAddOns("default").forEach((addOn) => allAvailable.add(addOn))
    }
    return Array.from(allAvailable)
  }, [selectedRooms])

  const availableReductions = useMemo(() => {
    const allAvailable = new Set<RoomReduction>()
    Object.keys(selectedRooms).forEach((roomType) => {
      getRoomReductions(roomType).forEach((reduction) => allAvailable.add(reduction))
    })
    // Also add default reductions if no specific rooms are selected or for general services
    if (Object.keys(selectedRooms).length === 0) {
      getRoomReductions("default").forEach((reduction) => allAvailable.add(reduction))
    }
    return Array.from(allAvailable)
  }, [selectedRooms])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl font-bold text-center">Build Your Cleaning Plan</CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Select your rooms, service type, and customize your cleaning.
        </p>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Room Selection & Customization */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">1. Select Rooms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(roomDisplayNames).map(([roomType, displayName]) => {
              // Skip 'default' as it's not a selectable room for individual count
              if (roomType === "default") return null

              const count = selectedRooms[roomType] || 0
              return (
                <div key={roomType} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <span className="text-4xl">{roomIcons[roomType]}</span>
                  <span className="font-medium text-center">{displayName}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomCountChange(roomType, -1)}
                      disabled={count === 0}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-6 text-center">{count}</span>
                    <Button variant="outline" size="icon" onClick={() => handleRoomCountChange(roomType, 1)}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {count > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCustomizeClick(roomType)}
                      className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Settings className="h-4 w-4 mr-1" /> Customize
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          <h2 className="text-2xl font-semibold mt-8">2. Choose Service Type</h2>
          <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="essential">Essential Clean</SelectItem>
              <SelectItem value="premium">Premium Clean</SelectItem>
              <SelectItem value="luxury">Luxury Clean</SelectItem>
            </SelectContent>
          </Select>

          <h2 className="text-2xl font-semibold mt-8">3. Cleanliness Level</h2>
          <div className="flex items-center gap-4">
            <Slider
              min={0}
              max={100}
              step={10}
              value={[cleanlinessLevel]}
              onValueChange={(val) => setCleanlinessLevel(val[0])}
              className="w-full"
            />
            <span className="w-16 text-right font-medium">{cleanlinessLevel}%</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Adjust based on how dirty your home is. Lower percentage means more dirty, higher means less dirty.
          </p>

          {/* Add-ons Section */}
          {availableAddOns.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mt-8">4. Add-ons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableAddOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={() => handleAddOnToggle(addOn.id)}
                    />
                    <Label htmlFor={addOn.id} className="flex flex-col">
                      <span className="font-medium">{addOn.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(addOn.price)} - {addOn.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Reductions Section */}
          {availableReductions.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mt-8">5. Reductions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableReductions.map((reduction) => (
                  <div key={reduction.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={reduction.id}
                      checked={selectedReductions.includes(reduction.id)}
                      onCheckedChange={() => handleReductionToggle(reduction.id)}
                    />
                    <Label htmlFor={reduction.id} className="flex flex-col">
                      <span className="font-medium">{reduction.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Save {formatCurrency(reduction.discount)} - {reduction.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Price Breakdown & Visualization */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Estimate</h2>
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(selectedRooms).map(([roomType, count]) => {
                if (count === 0) return null
                const basePrice = getBasePrice(roomType)
                return (
                  <div key={roomType} className="flex justify-between text-sm">
                    <span>
                      {roomDisplayNames[roomType]} x {count} ({selectedServiceType} tier)
                    </span>
                    <span>{formatCurrency(basePrice * count)}</span>
                  </div>
                )
              })}
              {selectedAddOns.map((addOnId) => {
                const allAddOns = Object.values(defaultAddOns).flat()
                const addOn = allAddOns.find((a) => a.id === addOnId)
                return addOn ? (
                  <div key={addOn.id} className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                    <span>{addOn.name}</span>
                    <span>{formatCurrency(addOn.price)}</span>
                  </div>
                ) : null
              })}
              {selectedReductions.map((reductionId) => {
                const allReductions = Object.values(defaultReductions).flat()
                const reduction = allReductions.find((r) => r.id === reductionId)
                return reduction ? (
                  <div key={reduction.id} className="flex justify-between text-sm text-red-600 dark:text-red-400">
                    <span>{reduction.name} Discount</span>
                    <span>-{formatCurrency(reduction.discount)}</span>
                  </div>
                ) : null
              })}
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Cleanliness Adjustment ({cleanlinessLevel}%)</span>
                <span>{priceMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Estimated Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
            <CardFooter>
              {!isServiceAvailable && (
                <p className="text-red-500 text-sm">Please select at least one room to get an estimate.</p>
              )}
              {isServiceAvailable && <Button className="w-full">Proceed to Booking</Button>}
            </CardFooter>
          </Card>

          {/* Room Visualization */}
          {Object.keys(selectedRooms).length > 0 && (
            <RoomVisualization
              roomType={Object.keys(selectedRooms)[0]} // Show visualization for the first selected room
              selectedTierDetails={selectedTierObject}
              selectedAddOnsDetails={selectedAddOnsDetailsForViz}
            />
          )}
          {Object.keys(selectedRooms).length === 0 && (
            <RoomVisualization
              roomType="default" // Show default visualization if no rooms selected
              selectedTierDetails={getRoomTiers("default").find((t) =>
                t.name.toLowerCase().includes(selectedServiceType),
              )}
              selectedAddOnsDetails={selectedAddOnsDetailsForViz}
            />
          )}
        </div>
      </CardContent>

      {currentRoomForCustomization && (
        <RoomCustomizationDrawer
          isOpen={isCustomizationDrawerOpen}
          onOpenChange={setIsCustomizationDrawerOpen}
          roomType={currentRoomForCustomization}
          roomConfig={getRoomConfig(currentRoomForCustomization)}
          onSave={handleRoomConfigChange}
        />
      )}
    </Card>
  )
}
