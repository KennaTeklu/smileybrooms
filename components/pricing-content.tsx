"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Plus, Minus, Home, Building, Sparkles, Info, Lightbulb } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { ROOM_TIERS, requiresEmailPricing } from "@/lib/room-tiers"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { createRoomCartItem } from "@/lib/cart/item-utils"
import type { RoomType } from "@/lib/types" // Import RoomType

export default function PricingContent() {
  const { roomConfigs, addRoom, removeRoom, updateRoomConfig, calculateRoomPrice, calculateTotalPrice } =
    useRoomContext()
  const { addItem, addMultipleItems, cart } = useCart()

  const [activeTab, setActiveTab] = useState("residential")

  const totalEstimatedPrice = useMemo(() => calculateTotalPrice(), [calculateTotalPrice])

  const handleAddAllToCart = () => {
    const itemsToAdd = Object.values(roomConfigs)
      .filter((config) => config.count > 0)
      .flatMap((config) => {
        const roomPrice = calculateRoomPrice(config)
        const baseItem = createRoomCartItem(config, roomPrice)
        // Create an array of items based on the count for this room config
        return Array(config.count)
          .fill(null)
          .map(() => ({
            ...baseItem,
            id: `${baseItem.id}-${crypto.randomUUID()}`, // Ensure truly unique ID for each instance
            name: `${baseItem.name} (Instance)`, // Differentiate instances in cart if needed
          }))
      })

    if (itemsToAdd.length > 0) {
      addMultipleItems(itemsToAdd)
    } else {
      // Optionally toast or alert if no items are selected
      console.log("No rooms selected to add to cart.")
    }
  }

  const getRoomImage = (roomType: string) => {
    switch (roomType) {
      case "bedroom":
        return "/images/bedroom-professional.png"
      case "bathroom":
        return "/images/bathroom-professional.png"
      case "kitchen":
        return "/images/kitchen-professional.png"
      case "living_room":
        return "/images/living-room-professional.png"
      case "dining_room":
        return "/images/dining-room-professional.png"
      case "home_office":
        return "/images/home-office-professional.png"
      case "laundry_room":
        return "/images/laundry-room-professional.png"
      case "entryway":
        return "/images/entryway-professional.png"
      case "hallway":
        return "/images/hallway-professional.png"
      case "stairs":
        return "/images/stairs-professional.png"
      case "custom_space":
        return "/placeholder.svg?height=100&width=100"
      default:
        return "/placeholder.svg?height=100&width=100"
    }
  }

  const getRoomDisplayName = (roomType: string) => {
    return roomType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getTierDisplayName = (tier: string) => {
    return tier.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getAddOnDisplayName = (addOn: string) => {
    return addOn.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getReductionDisplayName = (reduction: string) => {
    return reduction.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getRoomTypeIcon = (roomType: string) => {
    switch (roomType) {
      case "residential":
        return <Home className="h-5 w-5" />
      case "commercial":
        return <Building className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const getRoomCategoryIcon = (roomType: string) => {
    switch (roomType) {
      case "bedroom":
        return <img src="/images/bedroom-professional.png" alt="Bedroom" className="h-5 w-5" />
      case "bathroom":
        return <img src="/images/bathroom-professional.png" alt="Bathroom" className="h-5 w-5" />
      case "kitchen":
        return <img src="/images/kitchen-professional.png" alt="Kitchen" className="h-5 w-5" />
      case "living_room":
        return <img src="/images/living-room-professional.png" alt="Living Room" className="h-5 w-5" />
      case "dining_room":
        return <img src="/images/dining-room-professional.png" alt="Dining Room" className="h-5 w-5" />
      case "home_office":
        return <img src="/images/home-office-professional.png" alt="Home Office" className="h-5 w-5" />
      case "laundry_room":
        return <img src="/images/laundry-room-professional.png" alt="Laundry Room" className="h-5 w-5" />
      case "entryway":
        return <img src="/images/entryway-professional.png" alt="Entryway" className="h-5 w-5" />
      case "hallway":
        return <img src="/images/hallway-professional.png" alt="Hallway" className="h-5 w-5" />
      case "stairs":
        return <img src="/images/stairs-professional.png" alt="Stairs" className="h-5 w-5" />
      case "custom_space":
        return <Lightbulb className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const roomTypes = useMemo(() => Object.keys(ROOM_TIERS), [])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Flexible Cleaning Services</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Choose your rooms, select your cleaning level, and add extras.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="residential" className="flex items-center justify-center gap-2">
            <Home className="h-4 w-4" />
            Residential
          </TabsTrigger>
          <TabsTrigger value="commercial" className="flex items-center justify-center gap-2">
            <Building className="h-4 w-4" />
            Commercial
          </TabsTrigger>
        </TabsList>
        <TabsContent value="residential">{/* Content for Residential */}</TabsContent>
        <TabsContent value="commercial">{/* Content for Commercial */}</TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Room Selection */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Home className="h-6 w-6" />
              Select Your Rooms
            </CardTitle>
            <CardDescription>Add rooms and customize cleaning options.</CardDescription>
          </CardHeader>
          <CardContent className="p-1.5 md:p-3 lg:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roomTypes.map((roomType) => {
                const config = roomConfigs[roomType as RoomType]
                const roomDetails = ROOM_TIERS[roomType as RoomType]
                const currentPrice = calculateRoomPrice(config)
                const isEmailPricing = requiresEmailPricing(roomType)

                return (
                  <Card key={roomType} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        {getRoomCategoryIcon(roomType)}
                        <CardTitle className="text-xl">{getRoomDisplayName(roomType)}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeRoom(roomType as RoomType)}
                          disabled={config.count === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold">{config.count}</span>
                        <Button variant="outline" size="icon" onClick={() => addRoom(roomType as RoomType)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {config.count > 0 && (
                      <CardContent className="pt-4 space-y-4">
                        {isEmailPricing ? (
                          <div className="text-orange-500 font-semibold text-center">Email for Pricing</div>
                        ) : (
                          <>
                            {/* Tier Selection */}
                            <div className="space-y-2">
                              {/* Label component is assumed to be imported */}
                              <label className="text-base">Cleaning Tier</label>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(roomDetails.tiers).map(([tierKey, tierValue]) => (
                                  <Button
                                    key={tierKey}
                                    variant={config.selectedTier === tierKey ? "default" : "outline"}
                                    onClick={() =>
                                      updateRoomConfig(roomType as RoomType, { selectedTier: tierKey as any })
                                    }
                                    className="flex-col h-auto py-2"
                                  >
                                    <span className="font-medium">{getTierDisplayName(tierKey)}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatCurrency(roomDetails.basePrice * tierValue.multiplier)}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Add-ons */}
                            {Object.keys(roomDetails.addOns).length > 0 && (
                              <div className="space-y-2">
                                {/* Label component is assumed to be imported */}
                                <label className="text-base">Add-ons</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(roomDetails.addOns).map(([addOnKey, addOnValue]) => (
                                    <Button
                                      key={addOnKey}
                                      variant={config.selectedAddOns.includes(addOnKey) ? "default" : "outline"}
                                      onClick={() => {
                                        const newAddOns = config.selectedAddOns.includes(addOnKey)
                                          ? config.selectedAddOns.filter((a) => a !== addOnKey)
                                          : [...config.selectedAddOns, addOnKey]
                                        updateRoomConfig(roomType as RoomType, { selectedAddOns: newAddOns })
                                      }}
                                      className="flex-col h-auto py-2"
                                    >
                                      <span className="font-medium">{getAddOnDisplayName(addOnKey)}</span>
                                      <span className="text-xs text-muted-foreground">
                                        +{formatCurrency(addOnValue.price)}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Reductions */}
                            {Object.keys(roomDetails.reductions).length > 0 && (
                              <div className="space-y-2">
                                {/* Label component is assumed to be imported */}
                                <label className="text-base">Reductions</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(roomDetails.reductions).map(([reductionKey, reductionValue]) => (
                                    <Button
                                      key={reductionKey}
                                      variant={config.selectedReductions.includes(reductionKey) ? "default" : "outline"}
                                      onClick={() => {
                                        const newReductions = config.selectedReductions.includes(reductionKey)
                                          ? config.selectedReductions.filter((r) => r !== reductionKey)
                                          : [...config.selectedReductions, reductionKey]
                                        updateRoomConfig(roomType as RoomType, { selectedReductions: newReductions })
                                      }}
                                      className="flex-col h-auto py-2"
                                    >
                                      <span className="font-medium">{getReductionDisplayName(reductionKey)}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatCurrency(reductionValue.price)}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Subtotal:</span>
                          <span className="text-lg font-bold">
                            {isEmailPricing ? "Email for Pricing" : formatCurrency(currentPrice * config.count)}
                          </span>
                        </div>
                        {!isEmailPricing && (
                          <Button
                            className="w-full mt-4"
                            onClick={() => {
                              const item = createRoomCartItem(config, currentPrice, config.count)
                              addItem(item)
                            }}
                          >
                            Add {config.count} {getRoomDisplayName(roomType)} to Cart
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Selected Rooms Summary & Total */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Selected Rooms
            </CardTitle>
            <CardDescription>Review your chosen services and estimated total.</CardDescription>
          </CardHeader>
          <CardContent className="p-1.5 md:p-3 lg:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {Object.values(roomConfigs).filter((config) => config.count > 0).length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                <Info className="h-10 w-10 mx-auto mb-4" />
                <p>No rooms selected yet. Start by adding rooms on the left!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.values(roomConfigs)
                  .filter((config) => config.count > 0)
                  .map((config) => {
                    const roomPrice = calculateRoomPrice(config)
                    const isEmailPricing = requiresEmailPricing(config.roomType)
                    return (
                      <div key={config.roomType} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">
                            {config.count} x {getRoomDisplayName(config.roomType)}
                          </h3>
                          <span className="font-bold text-lg">
                            {isEmailPricing ? "Email for Pricing" : formatCurrency(roomPrice * config.count)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>Tier: {getTierDisplayName(config.selectedTier)}</p>
                          {config.selectedAddOns.length > 0 && (
                            <p>Add-ons: {config.selectedAddOns.map(getAddOnDisplayName).join(", ")}</p>
                          )}
                          {config.selectedReductions.length > 0 && (
                            <p>Reductions: {config.selectedReductions.map(getReductionDisplayName).join(", ")}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
            <Separator className="my-6" />
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Estimated Total:</span>
              <span>{formatCurrency(totalEstimatedPrice)}</span>
            </div>
            <Button className="w-full mt-6 h-12 text-lg" onClick={handleAddAllToCart}>
              <Plus className="mr-2 h-5 w-5" />
              Add All Selected Rooms to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
