"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bath,
  Bed,
  Home,
  CookingPotIcon as Kitchen,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  SquareDot,
  Sparkles,
  Lightbulb,
  Info,
  ShoppingCart,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRoomContext } from "@/lib/room-context"
import {
  ROOM_TIERS,
  ADD_ONS,
  REDUCTIONS,
  type RoomType,
  calculateRoomPrice,
  generateDetailedTasks,
  requiresEmailPricing,
  CUSTOM_SPACE_LEGAL_DISCLAIMER,
} from "@/lib/room-tiers"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCart } from "@/lib/cart-context"
import { createCartItemFromRoomConfig } from "@/lib/cart/item-utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollapsibleAddAllPanel } from "./collapsible-add-all-panel"

const roomIcons: Record<RoomType, React.ElementType> = {
  bedroom: Bed,
  bathroom: Bath,
  kitchen: Kitchen,
  "living-room": Home,
  "dining-room": Home,
  "home-office": Lightbulb,
  "laundry-room": Sparkles,
  "custom-space": SquareDot,
}

function PricingContent() {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, resetRoomConfigs } = useRoomContext()
  const { addItem, addMultipleItems } = useCart()
  const [openCollapsible, setOpenCollapsible] = useState<RoomType | null>(null)

  const totalRooms = useMemo(() => {
    return Object.values(roomCounts).reduce((sum, count) => sum + count, 0)
  }, [roomCounts])

  const handleAddAllToCart = () => {
    const itemsToAdd = Object.values(roomConfigs)
      .filter((config) => roomCounts[config.roomType] > 0) // Only add rooms that have a count > 0
      .flatMap((config) => {
        const price = calculateRoomPrice(
          config.roomType,
          config.selectedTier,
          config.selectedAddOns,
          config.selectedReductions,
        )
        const name = `${config.roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Cleaning (${ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label})`
        const baseItem = createCartItemFromRoomConfig(config, price, name)

        // Create multiple items if roomCount > 1
        return Array(roomCounts[config.roomType]).fill(baseItem)
      })

    addMultipleItems(itemsToAdd)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-6 lg:p-8">
      {/* Left Column: Room Selection */}
      <div className="lg:col-span-2 space-y-8">
        <h2 className="text-3xl font-bold text-center lg:text-left">Select Your Rooms</h2>
        <p className="text-lg text-muted-foreground text-center lg:text-left">
          Choose the rooms you need cleaned and customize your service.
        </p>

        <CollapsibleAddAllPanel />

        <div className="space-y-6">
          {Object.keys(roomCounts).map((roomTypeKey) => {
            const roomType = roomTypeKey as RoomType
            const Icon = roomIcons[roomType]
            const config = roomConfigs[roomType]

            const roomPrice = calculateRoomPrice(
              roomType,
              config.selectedTier,
              config.selectedAddOns,
              config.selectedReductions,
            )
            const roomTasks = generateDetailedTasks(
              roomType,
              config.selectedTier,
              config.selectedAddOns,
              config.selectedReductions,
            )

            const isEmailPricing = requiresEmailPricing(roomType)

            return (
              <Card key={roomType} className="overflow-hidden">
                <Collapsible
                  open={openCollapsible === roomType}
                  onOpenChange={() => setOpenCollapsible(openCollapsible === roomType ? null : roomType)}
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl font-semibold capitalize">
                          {roomType.replace(/-/g, " ")}
                        </CardTitle>
                        <CardDescription>
                          {roomType === "custom-space"
                            ? "Specialized cleaning for unique areas"
                            : `Standard cleaning for your ${roomType.replace(/-/g, " ")}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateRoomCount(roomType, Math.max(0, roomCounts[roomType] - 1))
                          }}
                          disabled={roomCounts[roomType] === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-bold w-8 text-center">{roomCounts[roomType]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateRoomCount(roomType, roomCounts[roomType] + 1)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {openCollapsible === roomType ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                          <span className="sr-only">Toggle details</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <Separator className="my-4" />
                      <div className="space-y-6">
                        {/* Tier Selection */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Cleaning Tier</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ROOM_TIERS.map((tier) => (
                              <Card
                                key={tier.value}
                                className={`cursor-pointer ${config.selectedTier === tier.value ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
                                onClick={() => updateRoomConfig(roomType, { selectedTier: tier.value })}
                              >
                                <CardContent className="p-4">
                                  <h4 className="font-semibold text-base mb-1">{tier.label}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {tier.features.map((feature, i) => (
                                      <li key={i} className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Add-ons</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ADD_ONS.map((addOn) => (
                              <Card
                                key={addOn.value}
                                className={`cursor-pointer ${config.selectedAddOns.includes(addOn.value) ? "border-green-500 ring-2 ring-green-500" : ""}`}
                                onClick={() =>
                                  updateRoomConfig(roomType, {
                                    selectedAddOns: config.selectedAddOns.includes(addOn.value)
                                      ? config.selectedAddOns.filter((item) => item !== addOn.value)
                                      : [...config.selectedAddOns, addOn.value],
                                  })
                                }
                              >
                                <CardContent className="p-4">
                                  <h4 className="font-semibold text-base mb-1">{addOn.label}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{addOn.description}</p>
                                  <p className="text-sm font-medium text-green-600">+{formatCurrency(addOn.price)}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Reductions */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Reductions</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {REDUCTIONS.map((reduction) => (
                              <Card
                                key={reduction.value}
                                className={`cursor-pointer ${config.selectedReductions.includes(reduction.value) ? "border-red-500 ring-2 ring-red-500" : ""}`}
                                onClick={() =>
                                  updateRoomConfig(roomType, {
                                    selectedReductions: config.selectedReductions.includes(reduction.value)
                                      ? config.selectedReductions.filter((item) => item !== reduction.value)
                                      : [...config.selectedReductions, reduction.value],
                                  })
                                }
                              >
                                <CardContent className="p-4">
                                  <h4 className="font-semibold text-base mb-1">{reduction.label}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{reduction.description}</p>
                                  <p className="text-sm font-medium text-red-600">-{formatCurrency(reduction.price)}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Detailed Tasks */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            {roomTasks.map((task, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isEmailPricing && (
                          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-md">
                            <div className="flex items-center">
                              <Info className="h-5 w-5 mr-2" />
                              <p className="font-semibold">Special Pricing Required</p>
                            </div>
                            <p className="mt-2 text-sm">{CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
                          </div>
                        )}

                        <div className="flex justify-end mt-6">
                          <Button
                            onClick={() => {
                              const name = `${roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Cleaning (${ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label})`
                              addItem(createCartItemFromRoomConfig(config, roomPrice, name))
                            }}
                            disabled={roomCounts[roomType] === 0 || isEmailPricing}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add {roomCounts[roomType]} {roomType.replace(/-/g, " ")} to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Right Column: Selected Rooms Summary */}
      <div className="lg:col-span-1 space-y-8">
        <h2 className="text-3xl font-bold text-center lg:text-left">Your Selected Rooms</h2>
        <p className="text-lg text-muted-foreground text-center lg:text-left">
          Review the rooms you've configured for cleaning.
        </p>

        <Card className="sticky top-4">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl font-semibold">Selected Rooms Summary</CardTitle>
            <CardDescription>
              {totalRooms} room{totalRooms !== 1 ? "s" : ""} selected
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
              <div className="space-y-4 p-6">
                {Object.keys(roomConfigs).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No rooms selected yet.</p>
                )}
                {Object.entries(roomConfigs).map(([roomTypeKey, config]) => {
                  const roomType = roomTypeKey as RoomType
                  if (roomCounts[roomType] === 0) return null

                  const price = calculateRoomPrice(
                    roomType,
                    config.selectedTier,
                    config.selectedAddOns,
                    config.selectedReductions,
                  )
                  const isEmailPricing = requiresEmailPricing(roomType)

                  return (
                    <div
                      key={roomType}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-semibold capitalize">
                          {roomType.replace(/-/g, " ")} ({roomCounts[roomType]})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tier: {ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label}
                        </p>
                        {config.selectedAddOns.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Add-ons:{" "}
                            {config.selectedAddOns.map((ao) => ADD_ONS.find((a) => a.value === ao)?.label).join(", ")}
                          </p>
                        )}
                        {config.selectedReductions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Reductions:{" "}
                            {config.selectedReductions
                              .map((r) => REDUCTIONS.find((red) => red.value === red)?.label)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      {isEmailPricing ? (
                        <span className="font-medium text-orange-600">Email for Pricing</span>
                      ) : (
                        <span className="font-semibold">{formatCurrency(price * roomCounts[roomType])}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
          <Separator className="my-4" />
          <div className="p-4 md:p-6 pt-0">
            <Button onClick={resetRoomConfigs} variant="outline" className="w-full mb-4 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Selections
            </Button>
            <Button onClick={handleAddAllToCart} className="w-full" disabled={totalRooms === 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add All Selected Rooms to Cart
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PricingContent
export { PricingContent }
