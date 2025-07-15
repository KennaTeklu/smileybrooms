"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoomConfigurator } from "@/components/room-configurator"
import { useRoomContext } from "@/lib/room-context"
import { formatCurrency } from "@/lib/utils"
import { ROOM_TYPES, ROOM_TIERS, calculateRoomPrice, requiresEmailPricing } from "@/lib/room-tiers"
import { useCart } from "@/lib/cart-context"
import { generateCartItemId } from "@/lib/cart/item-utils"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, MinusCircle, Mail, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CartItem } from "@/lib/cart/cart-item" // Declare the CartItem variable

export default function PricingContent() {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig } = useRoomContext()
  const { addItem, addMultipleItems, cart, updateQuantity } = useCart()
  const { toast } = useToast()

  const [isAddingAll, setIsAddingAll] = useState(false)

  const totalEstimatedPrice = useMemo(() => {
    let total = 0
    for (const roomType of Object.keys(roomCounts)) {
      const count = roomCounts[roomType]
      if (count > 0) {
        const config = roomConfigs[roomType]
        if (config && !requiresEmailPricing(roomType)) {
          total +=
            calculateRoomPrice(roomType, config.selectedTier, config.selectedAddOns, config.selectedReductions) * count
        }
      }
    }
    return total
  }, [roomCounts, roomConfigs])

  const handleAddRoomToCart = (roomType: string) => {
    const config = roomConfigs[roomType]
    const count = roomCounts[roomType]

    if (!config || count === 0) {
      toast({
        title: "No room configured",
        description: `Please configure your ${roomType} before adding to cart.`,
        variant: "destructive",
      })
      return
    }

    const cartItemId = generateCartItemId(
      roomType,
      config.selectedTier,
      config.selectedAddOns,
      config.selectedReductions,
    )

    const existingCartItem = cart.items.find((item) => item.id === cartItemId)

    if (existingCartItem) {
      // If the item already exists, update its quantity to match the room count
      updateQuantity(cartItemId, count)
      toast({
        title: "Cart Updated",
        description: `${count} ${roomType}(s) updated in your cart.`,
        variant: "success",
      })
    } else {
      // If it's a new item, add it to the cart
      const price = requiresEmailPricing(roomType)
        ? 0
        : calculateRoomPrice(roomType, config.selectedTier, config.selectedAddOns, config.selectedReductions)

      addItem({
        id: cartItemId,
        name: `${roomType} Cleaning - ${ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label || config.selectedTier}`,
        price: price,
        quantity: count,
        image: `/images/${roomType}-professional.png`, // Example image path
        metadata: {
          roomType: roomType,
          selectedTier: config.selectedTier,
          selectedAddOns: config.selectedAddOns,
          selectedReductions: config.selectedReductions,
          frequency: "one_time", // Assuming one-time for now
          description: `Cleaning service for ${roomType} with ${config.selectedTier} tier.`,
        },
        paymentType: requiresEmailPricing(roomType) ? "in_person" : "online",
      })
      toast({
        title: "Added to Cart",
        description: `${count} ${roomType}(s) added to your cart.`,
        variant: "success",
      })
    }
  }

  const handleAddAllSelectedRoomsToCart = () => {
    setIsAddingAll(true)
    const itemsToAdd: CartItem[] = []
    let hasUnconfiguredRooms = false

    for (const roomType of Object.keys(roomCounts)) {
      const count = roomCounts[roomType]
      if (count > 0) {
        const config = roomConfigs[roomType]
        if (!config) {
          hasUnconfiguredRooms = true
          continue
        }

        const cartItemId = generateCartItemId(
          roomType,
          config.selectedTier,
          config.selectedAddOns,
          config.selectedReductions,
        )

        const price = requiresEmailPricing(roomType)
          ? 0
          : calculateRoomPrice(roomType, config.selectedTier, config.selectedAddOns, config.selectedReductions)

        itemsToAdd.push({
          id: cartItemId,
          name: `${roomType} Cleaning - ${ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label || config.selectedTier}`,
          price: price,
          quantity: count,
          image: `/images/${roomType}-professional.png`, // Example image path
          metadata: {
            roomType: roomType,
            selectedTier: config.selectedTier,
            selectedAddOns: config.selectedAddOns,
            selectedReductions: config.selectedReductions,
            frequency: "one_time", // Assuming one-time for now
            description: `Cleaning service for ${roomType} with ${config.selectedTier} tier.`,
          },
          paymentType: requiresEmailPricing(roomType) ? "in_person" : "online",
        })
      }
    }

    if (hasUnconfiguredRooms) {
      toast({
        title: "Some rooms not added",
        description: "Please configure all selected rooms before adding them to the cart.",
        variant: "destructive",
      })
    }

    if (itemsToAdd.length > 0) {
      addMultipleItems(itemsToAdd)
      toast({
        title: "All Selected Rooms Added",
        description: `${itemsToAdd.length} unique room configurations added/updated in your cart.`,
        variant: "success",
      })
    } else if (!hasUnconfiguredRooms) {
      toast({
        title: "No Rooms Selected",
        description: "Please select and configure rooms before adding to cart.",
        variant: "info",
      })
    }
    setIsAddingAll(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Left Column: Room Selection & Configuration */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Select Your Rooms</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {ROOM_TYPES.map((room) => (
                <div key={room.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/images/${room.value}-professional.png`}
                      alt={room.label}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{room.label}</h3>
                      <p className="text-sm text-gray-500">{room.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateRoomCount(room.value, Math.max(0, roomCounts[room.value] - 1))}
                      disabled={roomCounts[room.value] === 0}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-lg">{roomCounts[room.value] || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateRoomCount(room.value, (roomCounts[room.value] || 0) + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {Object.keys(roomCounts).some((roomType) => roomCounts[roomType] > 0) && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configure Selected Rooms</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {Object.keys(roomCounts).map((roomType) => {
                  if (roomCounts[roomType] > 0) {
                    const config = roomConfigs[roomType] || {
                      selectedTier: ROOM_TIERS[0].value,
                      selectedAddOns: [],
                      selectedReductions: [],
                    }
                    const roomLabel = ROOM_TYPES.find((r) => r.value === roomType)?.label || roomType

                    return (
                      <div key={roomType} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">
                            {roomCounts[roomType]} x {roomLabel}
                          </h3>
                          <Button
                            variant="secondary"
                            onClick={() => handleAddRoomToCart(roomType)}
                            disabled={requiresEmailPricing(roomType)}
                          >
                            {requiresEmailPricing(roomType) ? (
                              <>
                                <Mail className="h-4 w-4 mr-2" /> Email for Pricing
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                        <RoomConfigurator
                          roomType={roomType}
                          initialConfig={config}
                          onConfigChange={(newConfig) => updateRoomConfig(roomType, newConfig)}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column: Summary & Checkout */}
      <div className="lg:col-span-1 space-y-8">
        <Card className="shadow-lg sticky top-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Estimated Price</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.keys(roomCounts).map((roomType) => {
                const count = roomCounts[roomType]
                const config = roomConfigs[roomType]
                if (count > 0 && config) {
                  const price = requiresEmailPricing(roomType)
                    ? "Email for Pricing"
                    : formatCurrency(
                        calculateRoomPrice(
                          roomType,
                          config.selectedTier,
                          config.selectedAddOns,
                          config.selectedReductions,
                        ) * count,
                      )
                  const roomLabel = ROOM_TYPES.find((r) => r.value === roomType)?.label || roomType
                  return (
                    <div key={roomType} className="flex justify-between items-center">
                      <span>
                        {count} x {roomLabel} ({ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label})
                      </span>
                      <span className="font-medium">{price}</span>
                    </div>
                  )
                }
                return null
              })}
              <Separator />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Estimated Price</span>
                <span>{formatCurrency(totalEstimatedPrice)}</span>
              </div>
            </div>
            <Button
              className="w-full mt-6 text-lg py-3"
              onClick={handleAddAllSelectedRoomsToCart}
              disabled={isAddingAll || Object.keys(roomCounts).every((roomType) => roomCounts[roomType] === 0)}
            >
              {isAddingAll ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Adding All...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-3" /> Add All Selected Rooms to Cart
                </>
              )}
            </Button>
            <Button asChild className="w-full mt-4 text-lg py-3" variant="secondary">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
