"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Settings, ShoppingCart } from "lucide-react"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"

interface RoomCount {
  [key: string]: number
}

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  roomCounts: RoomCount
  onRoomCountChange: (roomType: string, count: number) => void
  onRoomConfigChange: (roomId: string, config: RoomConfig) => void
  getRoomConfig: (roomType: string) => RoomConfig
  variant?: "primary" | "secondary"
  onRoomSelect?: (roomType: string) => void
}

export function RoomCategory({
  title,
  description,
  rooms,
  roomCounts,
  onRoomCountChange,
  onRoomConfigChange,
  getRoomConfig,
  variant = "primary",
  onRoomSelect,
}: RoomCategoryProps) {
  const [activeWizard, setActiveWizard] = useState<string | null>(null)
  const { addItem } = useCart()

  const handleOpenWizard = (roomType: string) => {
    try {
      if (roomCounts[roomType] === 0) {
        onRoomCountChange(roomType, 1)
      }
      setActiveWizard(roomType)
    } catch (error) {
      console.error("Error opening customization wizard:", error)
    }
  }

  const handleCloseWizard = () => {
    setActiveWizard(null)
  }

  const handleRoomConfigChange = (config: RoomConfig) => {
    try {
      if (activeWizard && onRoomConfigChange) {
        onRoomConfigChange(activeWizard, config)
      }
    } catch (error) {
      console.error("Error updating room config:", error)
    }
  }

  const handleAddToCartClick = (roomType: string) => {
    try {
      const currentRoomConfig = safeGetRoomConfig(roomType)
      addItem({
        id: `custom-cleaning-${roomType}-${Date.now()}`,
        name: `${roomDisplayNames[roomType] || roomType} Cleaning`,
        price: currentRoomConfig.totalPrice, // Per-room price
        priceId: "price_custom_cleaning", // Generic price ID for custom services
        quantity: roomCounts[roomType], // Number of rooms
        image: roomImages[roomType] || "/placeholder.svg",
        metadata: {
          roomType: roomType,
          roomConfig: currentRoomConfig,
          isRecurring: false, // Default, can be updated if recurring options are added later
          frequency: "one_time", // Default
        },
      })
      toast({
        title: "Item added to cart",
        description: `${roomDisplayNames[roomType] || roomType} has been added to your cart.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const getBgColor = () => {
    if (variant === "primary") {
      return "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"
    }
    return "bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/30"
  }

  const getIconBgColor = () => {
    if (variant === "primary") {
      return "bg-blue-100 dark:bg-blue-900/30"
    }
    return "bg-gray-200 dark:bg-gray-700/30"
  }

  const getIconTextColor = () => {
    if (variant === "primary") {
      return "text-blue-600 dark:text-blue-400"
    }
    return "text-gray-600 dark:text-gray-400"
  }

  const getActiveBorderColor = () => {
    if (variant === "primary") {
      return "border-blue-500 dark:border-blue-400"
    }
    return "border-gray-500 dark:border-gray-400"
  }

  const safeGetRoomConfig = (roomType: string): RoomConfig => {
    try {
      return getRoomConfig(roomType)
    } catch (error) {
      console.error("Error getting room config:", error)
      return {
        roomName: roomType,
        selectedTier: "ESSENTIAL CLEAN",
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: 0,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: 0,
      }
    }
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className={getBgColor()}>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full ${getIconBgColor()} ${getIconTextColor()}`}
            >
              {variant === "primary" ? (
                <span className="text-lg" aria-hidden="true">
                  🏠
                </span>
              ) : (
                <span className="text-lg" aria-hidden="true">
                  🧹
                </span>
              )}
            </span>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            className={`grid grid-cols-2 md:grid-cols-3 ${
              rooms.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-4`}
          >
            {rooms.map((roomType) => (
              <Card
                key={roomType}
                className={`border ${
                  roomCounts[roomType] > 0 ? getActiveBorderColor() : "border-gray-200 dark:border-gray-700"
                } cursor-pointer overflow-hidden`}
                onClick={() => {
                  try {
                    if (roomCounts[roomType] <= 0) {
                      onRoomCountChange(roomType, 1)
                    }
                    if (onRoomSelect) {
                      onRoomSelect(roomType)
                    }
                  } catch (error) {
                    console.error("Error selecting room:", error)
                  }
                }}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-full h-24 mb-3 relative rounded-lg overflow-hidden">
                    <Image
                      src={roomImages[roomType] || roomImages.bedroom}
                      alt={`Professional ${roomDisplayNames[roomType] || roomType} cleaning before and after`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>

                  <h3 className="font-medium mb-2">{roomDisplayNames[roomType] || roomType}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        try {
                          onRoomCountChange(roomType, Math.max(0, (roomCounts[roomType] || 0) - 1))
                        } catch (error) {
                          console.error("Error decreasing room count:", error)
                        }
                      }}
                      disabled={roomCounts[roomType] <= 0}
                      className="h-8 w-8"
                      aria-label={`Decrease ${roomDisplayNames[roomType] || roomType} count`}
                    >
                      <MinusCircle className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="font-medium text-lg">{roomCounts[roomType] || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        try {
                          onRoomCountChange(roomType, (roomCounts[roomType] || 0) + 1)
                        } catch (error) {
                          console.error("Error increasing room count:", error)
                        }
                      }}
                      className="h-8 w-8"
                      aria-label={`Increase ${roomDisplayNames[roomType] || roomType} count`}
                    >
                      <PlusCircle className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {roomCounts[roomType] > 0 && (
                    <div className="flex flex-col gap-2 mt-3 w-full">
                      <Button
                        id={`customize-${roomType}`}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenWizard(roomType)
                        }}
                        aria-label={`Customize ${roomDisplayNames[roomType] || roomType}`}
                      >
                        <Settings className="h-3 w-3 mr-1" aria-hidden="true" />
                        Customize
                      </Button>
                      <Button
                        id={`add-to-cart-${roomType}`}
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCartClick(roomType)
                        }}
                        aria-label={`Add ${roomDisplayNames[roomType] || roomType} to cart`}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeWizard && (
        <MultiStepCustomizationWizard
          isOpen={activeWizard !== null}
          onClose={handleCloseWizard}
          roomType={activeWizard}
          roomName={roomDisplayNames[activeWizard] || activeWizard}
          roomIcon={roomImages[activeWizard] || roomImages.bedroom}
          roomCount={roomCounts[activeWizard] || 0}
          config={safeGetRoomConfig(activeWizard)}
          onConfigChange={handleRoomConfigChange}
        />
      )}
    </>
  )
}
