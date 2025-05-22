"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ServiceSummaryCardProps {
  roomConfigurations: any[]
  calculatedTotals: {
    basePrice: number
    tierUpgradePrice: number
    addOnsPrice: number
    reductionsPrice: number
    serviceFee: number
    totalPrice: number
  }
  onAddToCart: () => void
}

export function ServiceSummaryCard({
  roomConfigurations = [],
  calculatedTotals = {
    basePrice: 0,
    tierUpgradePrice: 0,
    addOnsPrice: 0,
    reductionsPrice: 0,
    serviceFee: 0,
    totalPrice: 0,
  },
  onAddToCart,
}: ServiceSummaryCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isWhatsIncludedOpen, setIsWhatsIncludedOpen] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await onAddToCart()
      // Success handling can go here
    } catch (error) {
      console.error("Error adding to cart:", error)
      // Error handling can go here
    } finally {
      setIsLoading(false)
    }
  }

  // Count total services included based on selected tiers
  const countIncludedServices = () => {
    let count = 0

    // Base services that are always included
    count += 10

    // Count additional services based on tier selections
    roomConfigurations.forEach((room) => {
      if (room.selectedTier === "Advanced Clean") {
        count += 5
      } else if (room.selectedTier === "Premium Clean") {
        count += 12
      }

      // Count add-ons
      if (room.selectedAddOns) {
        count += room.selectedAddOns.length
      }

      // Subtract reductions
      if (room.selectedReductions) {
        count -= room.selectedReductions.length
      }
    })

    return count
  }

  // Get tier-specific inclusions
  const getTierInclusions = () => {
    const essentialInclusions = [
      "Basic surface cleaning",
      "Vacuuming and sweeping",
      "Dusting accessible surfaces",
      "Trash removal",
      "Bathroom sink & toilet cleaning",
    ]

    const advancedInclusions = [
      "Deep cleaning of all surfaces",
      "Detailed kitchen cleaning",
      "Inside microwave cleaning",
      "Thorough bathroom sanitization",
      "Baseboards dusting",
    ]

    const premiumInclusions = [
      "Inside cabinet organization",
      "Inside refrigerator cleaning",
      "Detailed fixture cleaning",
      "Window sill & track cleaning",
      "Ceiling fan dusting",
      "Wall spot cleaning",
    ]

    // Determine which tiers are selected
    const hasEssential = true // Always included
    const hasAdvanced = roomConfigurations.some(
      (room) => room.selectedTier === "Advanced Clean" || room.selectedTier === "Premium Clean",
    )
    const hasPremium = roomConfigurations.some((room) => room.selectedTier === "Premium Clean")

    const inclusions = [...essentialInclusions]

    if (hasAdvanced) {
      inclusions.push(...advancedInclusions)
    }

    if (hasPremium) {
      inclusions.push(...premiumInclusions)
    }

    return inclusions
  }

  // Get room-specific inclusions
  const getRoomInclusions = () => {
    return roomConfigurations.map((room) => {
      const inclusions = []

      // Add basic inclusions based on room type
      if (room.roomName === "Bedroom") {
        inclusions.push("Bed making", "Dusting surfaces")
      } else if (room.roomName === "Bathroom") {
        inclusions.push("Sink & counter cleaning", "Toilet cleaning")
      } else if (room.roomName === "Kitchen") {
        inclusions.push("Countertop cleaning", "Sink cleaning")
      } else if (room.roomName === "Living Room") {
        inclusions.push("Dusting surfaces", "Vacuuming")
      }

      // Add tier-specific inclusions
      if (room.selectedTier === "Advanced Clean" || room.selectedTier === "Premium Clean") {
        if (room.roomName === "Bedroom") {
          inclusions.push("Under bed cleaning", "Baseboards dusting")
        } else if (room.roomName === "Bathroom") {
          inclusions.push("Shower/tub cleaning", "Cabinet fronts")
        } else if (room.roomName === "Kitchen") {
          inclusions.push("Appliance exteriors", "Microwave interior")
        } else if (room.roomName === "Living Room") {
          inclusions.push("Under furniture", "Detailed dusting")
        }
      }

      if (room.selectedTier === "Premium Clean") {
        if (room.roomName === "Bedroom") {
          inclusions.push("Ceiling fan cleaning", "Window sill cleaning")
        } else if (room.roomName === "Bathroom") {
          inclusions.push("Grout cleaning", "Fixture polishing")
        } else if (room.roomName === "Kitchen") {
          inclusions.push("Inside cabinets", "Inside refrigerator")
        } else if (room.roomName === "Living Room") {
          inclusions.push("Upholstery vacuuming", "Decor item cleaning")
        }
      }

      return {
        roomName: room.roomName,
        tier: room.selectedTier,
        inclusions,
      }
    })
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b">
        <CardTitle className="flex justify-between items-center">
          <span>Service Summary</span>
          <Badge variant="outline" className="text-lg font-bold bg-white dark:bg-gray-800">
            ${calculatedTotals.totalPrice.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* What's Included Section */}
        <Collapsible
          open={isWhatsIncludedOpen}
          onOpenChange={setIsWhatsIncludedOpen}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>What's Included ({countIncludedServices()} services)</span>
            </div>
            {isWhatsIncludedOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t">
            <div className="space-y-4">
              {/* General Service Inclusions */}
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">General Service Inclusions</h4>
                <ul className="space-y-1">
                  {getTierInclusions().map((inclusion, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Room-Specific Inclusions */}
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Room-Specific Services</h4>
                <div className="space-y-3">
                  {getRoomInclusions().map((room, roomIndex) => (
                    <div key={roomIndex} className="border-l-2 border-blue-200 pl-3">
                      <h5 className="font-medium text-sm">
                        {room.roomName} ({room.tier})
                      </h5>
                      <ul className="mt-1 space-y-1">
                        {room.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" />
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2">
                <p>All services include professional cleaning staff, equipment, and supplies.</p>
                <p className="mt-1">100% satisfaction guarantee or we'll re-clean at no additional cost.</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Breakdown */}
        <div className="space-y-2">
          <h3 className="font-medium">Price Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span>Base Price (Essential Clean)</span>
              <span>${calculatedTotals.basePrice.toFixed(2)}</span>
            </div>

            {calculatedTotals.tierUpgradePrice > 0 && (
              <div className="flex justify-between items-center text-blue-600">
                <span>Tier Upgrades</span>
                <span>+${calculatedTotals.tierUpgradePrice.toFixed(2)}</span>
              </div>
            )}

            {calculatedTotals.addOnsPrice > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Add-on Services</span>
                <span>+${calculatedTotals.addOnsPrice.toFixed(2)}</span>
              </div>
            )}

            {calculatedTotals.reductionsPrice > 0 && (
              <div className="flex justify-between items-center text-red-600">
                <span>Service Reductions</span>
                <span>-${calculatedTotals.reductionsPrice.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span>Service Fee (5%)</span>
              <span>${calculatedTotals.serviceFee.toFixed(2)}</span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>${calculatedTotals.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-0">
        <Button className="w-full flex items-center gap-2" size="lg" onClick={handleAddToCart} disabled={isLoading}>
          <ShoppingCart className="h-5 w-5" />
          {isLoading ? "Adding to Cart..." : "Add to Cart"}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          No payment required until service is completed.
          <br />
          Free cancellation up to 24 hours before appointment.
        </div>
      </CardFooter>
    </Card>
  )
}
