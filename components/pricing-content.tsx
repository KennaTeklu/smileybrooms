"use client"

import Link from "next/link"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, MinusCircle, Info, ShoppingCart } from "lucide-react"
import type { RoomType, RoomTier, AddOn, Reduction } from "@/lib/types"
import { calculateRoomPrice, generateDetailedTasks, ROOM_TIERS, ADD_ONS, REDUCTIONS } from "@/lib/room-tiers"
import { useRoomContext } from "@/lib/room-context"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { createCartItemFromRoomConfig } from "@/lib/cart/item-utils"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { motion } from "framer-motion"

// Helper to get image for room type
const getRoomImage = (roomType: RoomType) => {
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
    case "hallway":
      return "/images/hallway-professional.png"
    case "entryway":
      return "/images/entryway-professional.png"
    case "stairs":
      return "/images/stairs-professional.png"
    default:
      return "/placeholder.svg"
  }
}

export default function PricingContent() {
  const { roomCounts, updateRoomCount, roomConfigs, updateRoomConfig, resetRoomCounts } = useRoomContext()
  const { addMultipleItems, addItem, cart } = useCart()
  const { toast } = useToast()

  const [activeRoomType, setActiveRoomType] = useState<RoomType | null>(null)

  const totalRoomsSelected = useMemo(() => {
    return Object.values(roomCounts).reduce((sum, count) => sum + count, 0)
  }, [roomCounts])

  const selectedRooms = useMemo(() => {
    return Object.entries(roomCounts)
      .filter(([, count]) => count > 0)
      .map(([roomType]) => roomType as RoomType)
  }, [roomCounts])

  const calculateRoomDisplayPrice = useCallback(
    (roomType: RoomType) => {
      const config = roomConfigs[roomType]
      if (!config) return 0
      return calculateRoomPrice(config)
    },
    [roomConfigs],
  )

  const handleAddAllSelectedRoomsToCart = () => {
    const itemsToAdd = selectedRooms
      .map((roomType) => {
        const config = roomConfigs[roomType]
        if (config && roomCounts[roomType] > 0) {
          const price = calculateRoomPrice(config)
          return createCartItemFromRoomConfig(config, price, roomCounts[roomType])
        }
        return null
      })
      .filter(Boolean) as any[]

    if (itemsToAdd.length > 0) {
      addMultipleItems(itemsToAdd)
      toast({
        title: "All Selected Rooms Added!",
        description: `${itemsToAdd.length} unique room configurations added to your cart.`,
        variant: "default",
      })
    } else {
      toast({
        title: "No Rooms Selected",
        description: "Please select rooms before adding them to the cart.",
        variant: "warning",
      })
    }
  }

  const handleAddIndividualRoomToCart = (roomType: RoomType) => {
    const config = roomConfigs[roomType]
    const quantity = roomCounts[roomType]
    if (config && quantity > 0) {
      const price = calculateRoomPrice(config)
      const item = createCartItemFromRoomConfig(config, price, quantity)
      addItem(item)
      toast({
        title: "Room Added to Cart!",
        description: `${item.name} (x${item.quantity}) added to your cart.`,
        variant: "default",
      })
    } else {
      toast({
        title: "Room Not Configured",
        description: `Please configure ${roomType.replace(/_/g, " ")} before adding to cart.`,
        variant: "warning",
      })
    }
  }

  const getCartItemQuantity = useCallback(
    (roomType: RoomType) => {
      const config = roomConfigs[roomType]
      if (!config) return 0
      const itemId = createCartItemFromRoomConfig(config, 0, 0).id // Price and quantity don't matter for ID
      const cartItem = cart.items.find((item) => item.id === itemId)
      return cartItem ? cartItem.quantity : 0
    },
    [cart.items, roomConfigs],
  )

  return (
    <div className="grid lg:grid-cols-3 gap-8 p-4 md:p-6 lg:p-8">
      {/* Left Column: Room Selection */}
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Select Your Rooms</CardTitle>
          <CardDescription>Choose the rooms you need cleaned and customize their service.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          {Object.entries(roomCounts).map(([roomType, count]) => {
            const config = roomConfigs[roomType as RoomType] || {
              roomType: roomType as RoomType,
              selectedTier: "standard_clean",
              selectedAddOns: [],
              selectedReductions: [],
            }
            const roomImage = getRoomImage(roomType as RoomType)
            const currentPrice = calculateRoomDisplayPrice(roomType as RoomType)
            const cartQuantity = getCartItemQuantity(roomType as RoomType)

            return (
              <Card
                key={roomType}
                className={`flex flex-col items-center p-4 border-2 ${
                  count > 0 ? "border-blue-500 shadow-md" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Image
                  src={roomImage || "/placeholder.svg"}
                  alt={roomType.replace(/_/g, " ")}
                  width={120}
                  height={120}
                  className="rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold capitalize mb-2">{roomType.replace(/_/g, " ")}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoomCount(roomType as RoomType, count - 1)}
                    disabled={count === 0}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <span className="text-2xl font-bold w-8 text-center">{count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoomCount(roomType as RoomType, count + 1)}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                {count > 0 && (
                  <>
                    <div className="w-full space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <p>
                        Tier:{" "}
                        <select
                          value={config.selectedTier}
                          onChange={(e) =>
                            updateRoomConfig(roomType as RoomType, {
                              ...config,
                              selectedTier: e.target.value as RoomTier["value"],
                            })
                          }
                          className="ml-2 p-1 border rounded-md bg-background"
                        >
                          {ROOM_TIERS.map((tier) => (
                            <option key={tier.value} value={tier.value}>
                              {tier.label}
                            </option>
                          ))}
                        </select>
                      </p>
                      <p>
                        Add-ons:{" "}
                        <select
                          multiple
                          value={config.selectedAddOns}
                          onChange={(e) =>
                            updateRoomConfig(roomType as RoomType, {
                              ...config,
                              selectedAddOns: Array.from(
                                e.target.selectedOptions,
                                (option) => option.value as AddOn["value"],
                              ),
                            })
                          }
                          className="ml-2 p-1 border rounded-md bg-background h-20"
                        >
                          {ADD_ONS.map((addon) => (
                            <option key={addon.value} value={addon.value}>
                              {addon.label} (+{formatCurrency(addon.price)})
                            </option>
                          ))}
                        </select>
                      </p>
                      <p>
                        Reductions:{" "}
                        <select
                          multiple
                          value={config.selectedReductions}
                          onChange={(e) =>
                            updateRoomConfig(roomType as RoomType, {
                              ...config,
                              selectedReductions: Array.from(
                                e.target.selectedOptions,
                                (option) => option.value as Reduction["value"],
                              ),
                            })
                          }
                          className="ml-2 p-1 border rounded-md bg-background h-20"
                        >
                          {REDUCTIONS.map((reduction) => (
                            <option key={reduction.value} value={reduction.value}>
                              {reduction.label} (-{formatCurrency(reduction.price)})
                            </option>
                          ))}
                        </select>
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                      {formatCurrency(currentPrice)}
                    </p>
                    <Button
                      onClick={() => handleAddIndividualRoomToCart(roomType as RoomType)}
                      className="w-full"
                      variant={cartQuantity > 0 ? "secondary" : "default"}
                    >
                      {cartQuantity > 0 ? `Update Cart (${cartQuantity})` : "Add to Cart"}
                    </Button>
                  </>
                )}
              </Card>
            )
          })}
        </CardContent>
        <Separator className="my-6" />
        <CardContent className="p-6 flex justify-between items-center">
          <Button onClick={resetRoomCounts} variant="outline">
            Reset All Rooms
          </Button>
          <Button onClick={handleAddAllSelectedRoomsToCart} disabled={totalRoomsSelected === 0}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add All Selected Rooms to Cart ({totalRoomsSelected})
          </Button>
        </CardContent>
      </Card>

      {/* Right Column: Order Summary */}
      <Card className="lg:col-span-1 shadow-lg h-fit sticky top-24">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Estimate</CardTitle>
          <CardDescription>Summary of your selected services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedRooms.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p>No rooms selected yet.</p>
              <p>Select rooms on the left to see your estimate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedRooms.map((roomType) => {
                const count = roomCounts[roomType]
                const price = calculateRoomDisplayPrice(roomType)
                const config = roomConfigs[roomType]
                const tasks = generateDetailedTasks(config)

                return (
                  <div key={roomType} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold capitalize">
                        {roomType.replace(/_/g, " ")} (x{count})
                      </h4>
                      <span className="font-bold">{formatCurrency(price * count)}</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <li>Tier: {ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label}</li>
                      {config.selectedAddOns.length > 0 && (
                        <li>
                          Add-ons:{" "}
                          {config.selectedAddOns
                            .map((addon) => ADD_ONS.find((a) => a.value === addon)?.label)
                            .join(", ")}
                        </li>
                      )}
                      {config.selectedReductions.length > 0 && (
                        <li>
                          Reductions:{" "}
                          {config.selectedReductions
                            .map((reduction) => REDUCTIONS.find((r) => r.value === reduction)?.label)
                            .join(", ")}
                        </li>
                      )}
                    </ul>
                    {activeRoomType === roomType && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm"
                      >
                        <h5 className="font-semibold mb-1">Included Tasks:</h5>
                        <ul className="list-disc list-inside">
                          {tasks.map((task, i) => (
                            <li key={i}>{task}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setActiveRoomType(activeRoomType === roomType ? null : roomType)}
                      className="px-0 mt-1"
                    >
                      {activeRoomType === roomType ? "Hide Details" : "Show Details"}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
          <Separator className="my-4" />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Estimated Total:</span>
            <span>
              {formatCurrency(
                Object.values(roomConfigs).reduce((sum, config) => {
                  const count = roomCounts[config.roomType] || 0
                  return sum + calculateRoomPrice(config) * count
                }, 0),
              )}
            </span>
          </div>
          <Button asChild className="w-full mt-4">
            <Link href="/cart">View Cart & Checkout</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
