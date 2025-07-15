"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoomConfigurator } from "@/components/room-configurator"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"
import { formatCurrency } from "@/lib/utils"
import { ROOM_TIERS, calculateRoomPrice, requiresEmailPricing } from "@/lib/room-tiers"
import { useCart } from "@/lib/cart-context"
import { generateCartItemId } from "@/lib/cart/item-utils"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart, Check, X, Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { CartItem } from "@/lib/cart-context" // Corrected import for CartItem
import { RoomTier } from "@/lib/room-tiers" // Declare RoomTier
import { removeItem } from "@/lib/cart-context" // Declare removeItem

export default function PricingContent() {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, calculateTotalPrice, resetRoomConfigs } =
    useRoomContext()
  const { addItem, addMultipleItems, cart, updateQuantity } = useCart()
  const { toast } = useToast()

  const [isAddingAll, setIsAddingAll] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalEstimatedPrice = useMemo(() => {
    return calculateTotalPrice()
  }, [roomConfigs, calculateTotalPrice])

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

    const cartItemId = generateCartItemId({
      roomType,
      selectedTier: config.selectedTier,
      selectedAddOns: config.selectedAddOns,
      selectedReductions: config.selectedReductions,
      count: count, // Pass count for ID generation if needed, though it's for the item quantity
    })

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

        const cartItemId = generateCartItemId({
          roomType,
          selectedTier: config.selectedTier,
          selectedAddOns: config.selectedAddOns,
          selectedReductions: config.selectedReductions,
          count: count,
        })

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

  const handleRemoveFromCart = (roomConfig: RoomConfig) => {
    const cartItemId = generateCartItemId({
      roomType: roomConfig.roomType,
      selectedTier: roomConfig.selectedTier,
      selectedAddOns: roomConfig.selectedAddOns,
      selectedReductions: roomConfig.selectedReductions,
      count: roomConfig.count,
    })
    removeItem(cartItemId)
    toast({
      title: "Removed from Cart",
      description: `${roomConfig.roomType} removed from your cart.`,
      variant: "destructive",
    })
  }

  const handleAddToCart = (config: RoomConfig) => {
    const cartItemId = generateCartItemId({
      roomType: config.roomType,
      selectedTier: config.selectedTier,
      selectedAddOns: config.selectedAddOns,
      selectedReductions: config.selectedReductions,
      count: config.count,
    })

    const existingCartItem = cart.items.find((item) => item.id === cartItemId)

    if (existingCartItem) {
      // If the item already exists, update its quantity to match the room count
      updateQuantity(cartItemId, config.count)
      toast({
        title: "Cart Updated",
        description: `${config.count} ${config.roomType}(s) updated in your cart.`,
        variant: "success",
      })
    } else {
      // If it's a new item, add it to the cart
      const price = requiresEmailPricing(config.roomType)
        ? 0
        : calculateRoomPrice(config.roomType, config.selectedTier, config.selectedAddOns, config.selectedReductions)

      addItem({
        id: cartItemId,
        name: `${config.roomType} Cleaning - ${ROOM_TIERS.find((t) => t.value === config.selectedTier)?.label || config.selectedTier}`,
        price: price,
        quantity: config.count,
        image: `/images/${config.roomType}-professional.png`, // Example image path
        metadata: {
          roomType: config.roomType,
          selectedTier: config.selectedTier,
          selectedAddOns: config.selectedAddOns,
          selectedReductions: config.selectedReductions,
          frequency: "one_time", // Assuming one-time for now
          description: `Cleaning service for ${config.roomType} with ${config.selectedTier} tier.`,
        },
        paymentType: requiresEmailPricing(config.roomType) ? "in_person" : "online",
      })
      toast({
        title: "Added to Cart",
        description: `${config.count} ${config.roomType}(s) added to your cart.`,
        variant: "success",
      })
    }
  }

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-2">
              Transparent Pricing
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              Customize your cleaning service and get an instant estimate.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-1.5 md:p-3 lg:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Room Selection Column */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Select Your Rooms</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose the rooms you need cleaned and customize their service level.
                </p>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(roomConfigs).map((roomType) => (
                    <RoomConfigurator
                      key={roomType}
                      roomType={roomType as keyof typeof roomConfigs}
                      config={roomConfigs[roomType as keyof typeof roomConfigs]}
                      updateConfig={updateRoomConfig}
                      roomTiers={ROOM_TIERS}
                      // Removed roomAddOns and roomReductions props as they are fetched internally by RoomConfigurator
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <Button variant="outline" onClick={resetRoomConfigs}>
                    Reset Selections
                  </Button>
                  <Button
                    onClick={handleAddAllSelectedRoomsToCart}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add All Selected Rooms to Cart
                  </Button>
                </div>
              </div>

              {/* Summary Column */}
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Estimated Price</h2>
                <Card className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-inner">
                  <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {formatCurrency(totalEstimatedPrice)}
                  </CardTitle>
                  <CardDescription className="text-gray-700 dark:text-gray-300 mb-4">
                    This is an estimated price based on your selections. Final price may vary.
                  </CardDescription>
                  <Separator className="my-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Selected Rooms</h3>
                  <AnimatePresence mode="wait">
                    {Object.values(roomConfigs).filter((config) => config.count > 0).length === 0 ? (
                      <motion.p
                        key="no-rooms"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500 dark:text-gray-400 italic"
                      >
                        No rooms selected yet.
                      </motion.p>
                    ) : (
                      <motion.div
                        key="room-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {Object.values(roomConfigs)
                          .filter((config) => config.count > 0)
                          .map((config) => (
                            <div
                              key={config.roomType}
                              className="flex items-center justify-between text-gray-700 dark:text-gray-300"
                            >
                              <div>
                                <p className="font-medium">
                                  {config.count} x{" "}
                                  {config.roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  {config.selectedTier !== RoomTier.Standard && ` (${config.selectedTier})`}
                                </p>
                                {config.selectedAddOns.length > 0 && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Add-ons: {config.selectedAddOns.map((a) => a.replace(/-/g, " ")).join(", ")}
                                  </p>
                                )}
                                {config.selectedReductions.length > 0 && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Reductions: {config.selectedReductions.map((r) => r.replace(/-/g, " ")).join(", ")}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {formatCurrency(
                                    calculateRoomPrice(
                                      config.roomType,
                                      config.selectedTier,
                                      config.selectedAddOns,
                                      config.selectedReductions,
                                    ) * config.count,
                                  )}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddToCart(config)}
                                  className="h-8 w-8 p-0"
                                  aria-label={`Add ${config.roomType} to cart`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(config)}
                                  className="h-8 w-8 p-0"
                                  aria-label={`Remove ${config.roomType} from cart`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
                <Button className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Why Choose Smiley Brooms?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-850 rounded-lg shadow-md">
              <Check className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Experienced Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team consists of highly trained and vetted cleaning experts.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-850 rounded-lg shadow-md">
              <X className="h-10 w-10 text-red-500 mb-3" /> {/* Changed to X for eco-friendly */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Eco-Friendly Products</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use non-toxic, environmentally safe cleaning solutions for your home.
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-850 rounded-lg shadow-md">
              <ShoppingCart className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                100% Satisfaction Guarantee
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                If you're not happy, we'll re-clean for free. Your satisfaction is our priority.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
