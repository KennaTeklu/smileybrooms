"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  roomDisplayNames,
  getRoomTiers,
  getRoomAddOns,
  getRoomReductions,
  fullHousePackages,
  type RoomAddOn,
  defaultTiers,
} from "@/lib/room-tiers"
import { formatCurrency } from "@/lib/utils"
import { PlusCircle, MinusCircle, Info, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RoomVisualization } from "./room-visualization"
import { VALID_COUPONS } from "@/lib/constants"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

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
  }) => void
}

export function PriceCalculator({
  initialSelectedRooms = {},
  initialServiceType = "essential",
  onCalculationComplete,
}: PriceCalculatorProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(initialSelectedRooms)
  const [selectedTierIds, setSelectedTierIds] = useState<Record<string, string>>({})
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({})
  const [selectedReductions, setSelectedReductions] = useState<Record<string, string[]>>({})
  const [frequency, setFrequency] = useState("one-time")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(50) // 0-100 scale
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringInterval, setRecurringInterval] = useState<"week" | "month" | "year">("month")
  const [paymentFrequency, setPaymentFrequency] = useState<"per_service" | "monthly" | "yearly">("per_service")
  const [addressId, setAddressId] = useState("") // Placeholder for address ID
  const [isServiceAvailable, setIsServiceAvailable] = useState(true) // Placeholder for service availability
  const [isProcessing, setIsProcessing] = useState(false) // New state for loading indicator

  const { addItem, clearCart } = useCart()
  const router = useRouter()

  // Effect to initialize selected tiers based on initialServiceType
  useEffect(() => {
    const initialTiers: Record<string, string> = {}
    Object.keys(selectedRooms).forEach((roomType) => {
      const tiers = getRoomTiers(roomType)
      const defaultTier = tiers.find((tier) => tier.name.includes(initialServiceType.toUpperCase()))
      if (defaultTier) {
        initialTiers[roomType] = defaultTier.id
      } else if (tiers.length > 0) {
        initialTiers[roomType] = tiers[0].id // Fallback to first tier if specific not found
      }
    })
    setSelectedTierIds(initialTiers)
  }, [initialSelectedRooms, initialServiceType, selectedRooms])

  const handleRoomCountChange = (roomType: string, change: number) => {
    setSelectedRooms((prev) => {
      const newCount = (prev[roomType] || 0) + change
      if (newCount < 0) return prev
      const newRooms = { ...prev, [roomType]: newCount }
      if (newCount === 0) {
        delete newRooms[roomType]
        // Also remove tier, add-ons, and reductions for removed room
        setSelectedTierIds((prevTiers) => {
          const newTiers = { ...prevTiers }
          delete newTiers[roomType]
          return newTiers
        })
        setSelectedAddOns((prevAddOns) => {
          const newAddOns = { ...prevAddOns }
          delete newAddOns[roomType]
          return newAddOns
        })
        setSelectedReductions((prevReductions) => {
          const newReductions = { ...prevReductions }
          delete newReductions[roomType]
          return newReductions
        })
      } else if (!(roomType in prev) && newCount === 1) {
        // If adding a new room, set its default tier
        const tiers = getRoomTiers(roomType)
        const defaultTier = tiers.find((tier) => tier.name.includes(initialServiceType.toUpperCase()))
        if (defaultTier) {
          setSelectedTierIds((prevTiers) => ({ ...prevTiers, [roomType]: defaultTier.id }))
        } else if (tiers.length > 0) {
          setSelectedTierIds((prevTiers) => ({ ...prevTiers, [roomType]: tiers[0].id }))
        }
      }
      return newRooms
    })
  }

  const handleTierChange = (roomType: string, tierId: string) => {
    setSelectedTierIds((prev) => ({ ...prev, [roomType]: tierId }))
  }

  const handleAddOnToggle = (roomType: string, addOnId: string) => {
    setSelectedAddOns((prev) => {
      const currentAddOns = prev[roomType] || []
      if (currentAddOns.includes(addOnId)) {
        return { ...prev, [roomType]: currentAddOns.filter((id) => id !== addOnId) }
      } else {
        return { ...prev, [roomType]: [...currentAddOns, addOnId] }
      }
    })
  }

  const handleReductionToggle = (roomType: string, reductionId: string) => {
    setSelectedReductions((prev) => {
      const currentReductions = prev[roomType] || []
      if (currentReductions.includes(reductionId)) {
        return { ...prev, [roomType]: currentReductions.filter((id) => id !== reductionId) }
      } else {
        return { ...prev, [roomType]: [...currentReductions, reductionId] }
      }
    })
  }

  const handleApplyCoupon = () => {
    const coupon = VALID_COUPONS.find((c) => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      setCouponDiscount(coupon.discount)
      setAppliedCoupon(coupon.code)
    } else {
      setCouponDiscount(0)
      setAppliedCoupon(null)
      alert("Invalid coupon code!")
    }
  }

  const priceMultiplier = useMemo(() => {
    // Adjust multiplier based on cleanliness level
    if (cleanlinessLevel <= 20) return 1.5 // Very dirty
    if (cleanlinessLevel <= 50) return 1.2 // Moderately dirty
    if (cleanlinessLevel <= 80) return 1.0 // Normal
    return 0.9 // Already quite clean
  }, [cleanlinessLevel])

  const calculateTotalPrice = useCallback(() => {
    let total = 0
    let totalTimeEstimateMinutes = 0

    // Calculate price for individual rooms
    Object.entries(selectedRooms).forEach(([roomType, count]) => {
      const selectedTierId = selectedTierIds[roomType]
      const tiers = getRoomTiers(roomType)
      const tier = tiers.find((t) => t.id === selectedTierId)

      if (tier) {
        total += tier.price * count
        totalTimeEstimateMinutes += Number.parseInt(tier.timeEstimate.split(" ")[0]) * count // Assuming "X minutes"
      }

      // Add-ons for this room type
      const roomAddOns = getRoomAddOns(roomType)
      ;(selectedAddOns[roomType] || []).forEach((addOnId) => {
        const addOn = roomAddOns.find((a) => a.id === addOnId)
        if (addOn) {
          total += addOn.price * count
        }
      })

      // Reductions for this room type
      const roomReductions = getRoomReductions(roomType)
      ;(selectedReductions[roomType] || []).forEach((reductionId) => {
        const reduction = roomReductions.find((r) => r.id === reductionId)
        if (reduction) {
          total -= reduction.discount * count
        }
      })
    })

    // Apply cleanliness level multiplier
    total *= priceMultiplier

    // Apply frequency discount/premium
    if (frequency === "weekly") {
      total *= 0.8 // 20% discount for weekly
    } else if (frequency === "bi-weekly") {
      total *= 0.9 // 10% discount for bi-weekly
    }

    // Apply coupon discount
    total *= 1 - couponDiscount

    return Math.max(0, total) // Ensure total doesn't go below zero
  }, [selectedRooms, selectedTierIds, selectedAddOns, selectedReductions, frequency, couponDiscount, priceMultiplier])

  const totalPrice = calculateTotalPrice()

  // Determine the overall service type based on selected tiers
  const currentServiceType: "essential" | "premium" | "luxury" = useMemo(() => {
    const selectedTierNames = Object.keys(selectedRooms).map((roomType) => {
      const tier = getRoomTiers(roomType).find((t) => t.id === selectedTierIds[roomType])
      return tier?.name.toLowerCase()
    })

    if (selectedTierNames.some((name) => name?.includes("luxury"))) {
      return "luxury"
    }
    if (selectedTierNames.some((name) => name?.includes("premium"))) {
      return "premium"
    }
    return "essential"
  }, [selectedRooms, selectedTierIds])

  useEffect(() => {
    if (onCalculationComplete) {
      onCalculationComplete({
        rooms: selectedRooms,
        frequency,
        totalPrice,
        serviceType: currentServiceType,
        cleanlinessLevel,
        priceMultiplier,
        isServiceAvailable,
        addressId,
        paymentFrequency,
        isRecurring,
        recurringInterval,
      })
    }
  }, [
    selectedRooms,
    frequency,
    totalPrice,
    currentServiceType,
    cleanlinessLevel,
    priceMultiplier,
    isServiceAvailable,
    addressId,
    paymentFrequency,
    isRecurring,
    recurringInterval,
    onCalculationComplete,
  ])

  const roomTypes = Object.keys(roomDisplayNames).filter(
    (key) => key !== "default" && key !== "other" && !fullHousePackages.some((pkg) => pkg.includedRooms.includes(key)),
  )

  // Get the first selected room type for visualization, or 'default' if none selected
  const roomTypeForVisualization = Object.keys(selectedRooms)[0] || "default"
  const selectedTierDetailsForVisualization = selectedTierIds[roomTypeForVisualization]
    ? getRoomTiers(roomTypeForVisualization).find((t) => t.id === selectedTierIds[roomTypeForVisualization])
    : defaultTiers.default[0] // Fallback to default essential tier
  const selectedAddOnsDetailsForVisualization = (selectedAddOns[roomTypeForVisualization] || [])
    .map((id) => getRoomAddOns(roomTypeForVisualization).find((ao) => ao.id === id))
    .filter(Boolean) as RoomAddOn[]

  const handleProceedToCheckout = () => {
    setIsProcessing(true) // Start processing state
    // Clear existing cart items to ensure only the new custom service is added
    clearCart()

    // Construct a single CartItem representing the entire custom cleaning service
    const customServiceItem = {
      id: `custom-cleaning-${Date.now()}`, // Unique ID for this custom service instance
      name: "Custom Cleaning Service",
      price: totalPrice,
      quantity: 1,
      image: "/custom-cleaning-service-icon.png", // Placeholder image
      sourceSection: "price-calculator",
      paymentFrequency: paymentFrequency,
      metadata: {
        rooms: selectedRooms,
        selectedTierIds: selectedTierIds,
        selectedAddOns: selectedAddOns,
        selectedReductions: selectedReductions,
        frequency: frequency,
        cleanlinessLevel: cleanlinessLevel,
        priceMultiplier: priceMultiplier,
        isRecurring: isRecurring,
        recurringInterval: isRecurring ? recurringInterval : undefined,
        appliedCoupon: appliedCoupon,
        couponDiscount: couponDiscount,
        serviceType: currentServiceType,
      },
    }

    addItem(customServiceItem)
    router.push("/checkout")
    // Note: isProcessing will likely remain true as the page redirects before it can be set to false.
    // This is acceptable for a full page redirect.
  }

  const isCheckoutButtonDisabled = isProcessing || totalPrice <= 0 || Object.keys(selectedRooms).length === 0

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Build Your Custom Cleaning Plan</CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Select rooms, service tiers, and add-ons to get an instant quote.
        </p>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">1. Select Rooms & Quantity</h3>
          <div className="grid grid-cols-2 gap-4">
            {roomTypes.map((roomType) => (
              <div key={roomType} className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor={`room-${roomType}`} className="capitalize">
                  {roomDisplayNames[roomType]}
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRoomCountChange(roomType, -1)}
                    disabled={!selectedRooms[roomType] || selectedRooms[roomType] === 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{selectedRooms[roomType] || 0}</span>
                  <Button variant="outline" size="icon" onClick={() => handleRoomCountChange(roomType, 1)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <h3 className="text-xl font-semibold">2. Choose Service Tier per Room</h3>
          {Object.entries(selectedRooms).length === 0 && (
            <p className="text-gray-500">Add rooms above to select their service tiers.</p>
          )}
          {Object.entries(selectedRooms).map(([roomType, count]) => (
            <div key={`tier-${roomType}`} className="space-y-2 p-3 border rounded-md">
              <Label className="capitalize text-base">
                {roomDisplayNames[roomType]} ({count})
              </Label>
              <Select
                value={selectedTierIds[roomType] || ""}
                onValueChange={(value) => handleTierChange(roomType, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select tier for ${roomDisplayNames[roomType]}`} />
                </SelectTrigger>
                <SelectContent>
                  {getRoomTiers(roomType).map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.name} - {formatCurrency(tier.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTierIds[roomType] && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getRoomTiers(roomType).find((t) => t.id === selectedTierIds[roomType])?.description}
                </div>
              )}
            </div>
          ))}

          <Separator />

          <h3 className="text-xl font-semibold">3. Add-ons & Reductions</h3>
          {Object.entries(selectedRooms).length === 0 && (
            <p className="text-gray-500">Add rooms above to customize with add-ons and reductions.</p>
          )}
          {Object.entries(selectedRooms).map(([roomType]) => (
            <div key={`addons-reductions-${roomType}`} className="space-y-4 p-3 border rounded-md">
              <h4 className="text-lg font-medium capitalize">{roomDisplayNames[roomType]} Customizations</h4>
              {getRoomAddOns(roomType).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Add-ons:</p>
                  {getRoomAddOns(roomType).map((addOn) => (
                    <div key={addOn.id} className="flex items-center justify-between">
                      <Label htmlFor={`addon-${addOn.id}`} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id={`addon-${addOn.id}`}
                          checked={selectedAddOns[roomType]?.includes(addOn.id) || false}
                          onCheckedChange={() => handleAddOnToggle(roomType, addOn.id)}
                        />
                        {addOn.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{addOn.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium">{formatCurrency(addOn.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {getRoomReductions(roomType).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reductions:</p>
                  {getRoomReductions(roomType).map((reduction) => (
                    <div key={reduction.id} className="flex items-center justify-between">
                      <Label htmlFor={`reduction-${reduction.id}`} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id={`reduction-${reduction.id}`}
                          checked={selectedReductions[roomType]?.includes(reduction.id) || false}
                          onCheckedChange={() => handleReductionToggle(roomType, reduction.id)}
                        />
                        {reduction.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{reduction.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-red-500">-{formatCurrency(reduction.discount)}</span>
                    </div>
                  ))}
                </div>
              )}
              {getRoomAddOns(roomType).length === 0 && getRoomReductions(roomType).length === 0 && (
                <p className="text-gray-500 text-sm">No specific add-ons or reductions for this room type.</p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">4. Service Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency">Cleaning Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="weekly">Weekly (20% off)</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly (10% off)</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cleanliness">Current Cleanliness Level</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="cleanliness"
                  min={0}
                  max={100}
                  step={10}
                  value={[cleanlinessLevel]}
                  onValueChange={(val) => setCleanlinessLevel(val[0])}
                  className="w-full"
                />
                <span className="w-12 text-right text-sm">{cleanlinessLevel}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {cleanlinessLevel <= 20 && "Very Dirty (1.5x price)"}
                {cleanlinessLevel > 20 && cleanlinessLevel <= 50 && "Moderately Dirty (1.2x price)"}
                {cleanlinessLevel > 50 && cleanlinessLevel <= 80 && "Normal (1.0x price)"}
                {cleanlinessLevel > 80 && "Quite Clean (0.9x price)"}
              </p>
            </div>

            <div>
              <Label htmlFor="coupon">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button onClick={handleApplyCoupon}>Apply</Button>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Coupon "{appliedCoupon}" applied!
                </p>
              )}
              {couponDiscount > 0 && <p className="text-sm text-green-600 mt-1">Discount: {couponDiscount * 100}%</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(Boolean(checked))}
              />
              <Label htmlFor="recurring">Set as Recurring Service</Label>
            </div>

            {isRecurring && (
              <div>
                <Label htmlFor="recurring-interval">Recurring Interval</Label>
                <Select
                  value={recurringInterval}
                  onValueChange={(value) => setRecurringInterval(value as "week" | "month" | "year")}
                >
                  <SelectTrigger id="recurring-interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="payment-frequency">Payment Frequency</Label>
              <Select
                value={paymentFrequency}
                onValueChange={(value) => setPaymentFrequency(value as "per_service" | "monthly" | "yearly")}
              >
                <SelectTrigger id="payment-frequency">
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_service">Per Service</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <h3 className="text-xl font-semibold">5. Room Visualization</h3>
            <RoomVisualization
              roomType={roomTypeForVisualization}
              selectedTierDetails={selectedTierDetailsForVisualization}
              selectedAddOnsDetails={selectedAddOnsDetailsForVisualization}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-6 border-t">
        <div className="flex justify-between w-full text-lg font-bold">
          <span>Estimated Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handleProceedToCheckout} disabled={isCheckoutButtonDisabled}>
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              Adding to Cart...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
