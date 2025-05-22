"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ShoppingCart, CheckCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { useState, useMemo } from "react"
import { TIER_FEATURES, ADD_ON_FEATURES, REDUCTION_FEATURES } from "@/lib/room-tiers"

interface RoomConfig {
  id: string
  name: string
  tier: string
  addOns: string[]
  reductions: string[]
  basePrice: number
  tierUpgrade: number
  addOnPrice: number
  reductionPrice: number
  totalPrice: number
}

interface ServiceSummaryCardProps {
  roomConfigurations?: RoomConfig[]
  frequency?: string
  basePrice?: number
  tierUpgrade?: number
  addOnPrice?: number
  reductionPrice?: number
  serviceFee?: number
  frequencyMultiplier?: number
  subtotal?: number
  total?: number
  onAddToCart?: () => void
  isLoading?: boolean
}

export function ServiceSummaryCard({
  roomConfigurations = [],
  frequency = "weekly",
  basePrice = 0,
  tierUpgrade = 0,
  addOnPrice = 0,
  reductionPrice = 0,
  serviceFee = 0,
  frequencyMultiplier = 1,
  subtotal = 0,
  total = 0,
  onAddToCart,
  isLoading = false,
}: ServiceSummaryCardProps) {
  const [isIncludedOpen, setIsIncludedOpen] = useState(false)

  const includedServices = useMemo(() => {
    const services = new Set<string>()
    const roomServices: Array<{ room: string; tier: string; features: string[] }> = []

    // Determine highest tier selected
    const tiers = roomConfigurations.map((config) => config.tier)
    const hasEssential = tiers.includes("essential")
    const hasAdvanced = tiers.includes("advanced")
    const hasPremium = tiers.includes("premium")

    // Add general services based on highest tier
    if (hasEssential || hasAdvanced || hasPremium) {
      services.add("Professional cleaning team")
      services.add("All basic cleaning supplies included")
      services.add("Dusting and surface cleaning")
      services.add("Vacuuming and floor care")
      services.add("Trash removal")
    }

    if (hasAdvanced || hasPremium) {
      services.add("Deep cleaning with attention to detail")
      services.add("Bathroom deep scrubbing")
      services.add("Kitchen appliance exterior cleaning")
      services.add("Baseboards and window sills")
      services.add("Mirror and glass cleaning")
    }

    if (hasPremium) {
      services.add("Complete top-to-bottom service")
      services.add("Inside microwave cleaning")
      services.add("Cabinet front cleaning")
      services.add("Ceiling fan cleaning")
      services.add("Detailed furniture dusting")
    }

    // Add room-specific services
    roomConfigurations.forEach((config) => {
      const tierFeatures = TIER_FEATURES[config.tier]
      if (tierFeatures) {
        roomServices.push({
          room: config.name,
          tier: tierFeatures.name,
          features: tierFeatures.features,
        })
      }
    })

    // Add add-on services
    const allAddOns = roomConfigurations.flatMap((config) => config.addOns)
    const uniqueAddOns = [...new Set(allAddOns)]
    uniqueAddOns.forEach((addOn) => {
      const addOnFeatures = ADD_ON_FEATURES[addOn]
      if (addOnFeatures) {
        services.add(addOnFeatures.name)
      }
    })

    // Add reduction services
    const allReductions = roomConfigurations.flatMap((config) => config.reductions)
    const uniqueReductions = [...new Set(allReductions)]
    uniqueReductions.forEach((reduction) => {
      const reductionFeatures = REDUCTION_FEATURES[reduction]
      if (reductionFeatures) {
        services.add(reductionFeatures.name)
      }
    })

    return {
      generalServices: Array.from(services),
      roomServices,
      totalCount: services.size + roomServices.reduce((acc, room) => acc + room.features.length, 0),
    }
  }, [roomConfigurations])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const formatFrequency = (freq: string) => {
    const frequencies: Record<string, string> = {
      one_time: "One-time",
      weekly: "Weekly",
      biweekly: "Bi-weekly",
      monthly: "Monthly",
      semi_annual: "Semi-annual",
      annually: "Annual",
      vip_daily: "VIP Daily",
    }
    return frequencies[freq] || freq
  }

  const hasRooms = roomConfigurations.length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Service Summary
        </CardTitle>
        <CardDescription>
          {hasRooms
            ? `${roomConfigurations.length} room${roomConfigurations.length !== 1 ? "s" : ""} • ${formatFrequency(frequency)}`
            : "Configure your service above"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasRooms ? (
          <>
            {/* Room List */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Selected Rooms</h4>
              {roomConfigurations.map((config) => (
                <div key={config.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{config.name.replace(/_/g, " ")}</span>
                    <Badge variant="outline" className="text-xs">
                      {TIER_FEATURES[config.tier]?.name || config.tier}
                    </Badge>
                  </div>
                  <span className="font-medium">{formatCurrency(config.totalPrice || 0)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* What's Included */}
            <Collapsible open={isIncludedOpen} onOpenChange={setIsIncludedOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  What's Included ({includedServices.totalCount} services)
                </h4>
                {isIncludedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {/* General Services */}
                {includedServices.generalServices.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      General Service Inclusions
                    </h5>
                    <div className="space-y-1">
                      {includedServices.generalServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room-Specific Services */}
                {includedServices.roomServices.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Room-Specific Services
                    </h5>
                    <div className="space-y-2">
                      {includedServices.roomServices.map((roomService, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-3">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {roomService.room.replace(/_/g, " ")} - {roomService.tier}
                          </div>
                          <div className="space-y-1">
                            {roomService.features.slice(0, 3).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                              </div>
                            ))}
                            {roomService.features.length > 3 && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 ml-4">
                                +{roomService.features.length - 3} more services
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Price Breakdown</h4>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price ({roomConfigurations.length} rooms)</span>
                  <span>{formatCurrency(basePrice)}</span>
                </div>

                {tierUpgrade > 0 && (
                  <div className="flex justify-between">
                    <span>Tier Upgrades</span>
                    <span>+{formatCurrency(tierUpgrade)}</span>
                  </div>
                )}

                {addOnPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Add-on Services</span>
                    <span>+{formatCurrency(addOnPrice)}</span>
                  </div>
                )}

                {reductionPrice < 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discounts</span>
                    <span>{formatCurrency(reductionPrice)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frequency ({formatFrequency(frequency)})</span>
                  <span>×{frequencyMultiplier}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>+{formatCurrency(serviceFee)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price includes all selected services and fees</p>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={onAddToCart} disabled={isLoading || !hasRooms} className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">No rooms selected</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add rooms above to see your service summary and pricing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
