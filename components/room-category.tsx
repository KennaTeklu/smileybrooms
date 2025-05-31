"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Settings, ShoppingCart } from "lucide-react"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import Image from "next/image"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions?: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice?: number
  totalPrice: number
}

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  variant?: "primary" | "secondary"
  onRoomSelect?: (roomType: string) => void
}

export function RoomCategory({ title, description, rooms, variant = "primary", onRoomSelect }: RoomCategoryProps) {
  const [activeWizard, setActiveWizard] = useState<string | null>(null)
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes } =
    useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()

  // Check if this category has any selected rooms
  const categoryHasSelectedRooms = rooms.some((roomType) => roomCounts[roomType] > 0)

  // Check if this category should show the "Add All" button
  // Show it if: multi-selection is active AND this category has selected rooms
  const shouldShowAddAllButton = isMultiSelection && categoryHasSelectedRooms

  const handleOpenWizard = (roomType: string) => {
    try {
      if (roomCounts[roomType] === 0) {
        updateRoomCount(roomType, 1)
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
      if (activeWizard) {
        updateRoomConfig(activeWizard, config)
      }
    } catch (error) {
      console.error("Error updating room config:", error)
    }
  }

  const handleAddSingleRoomToCart = (roomType: string) => {
    try {
      const count = roomCounts[roomType]
      const config = roomConfigs[roomType]

      if (count > 0) {
        addItem({
          id: `custom-cleaning-${roomType}-${Date.now()}`,
          name: `${config.roomName} Cleaning`,
          price: config.totalPrice,
          priceId: "price_custom_cleaning",
          quantity: count,
          image: roomImages[roomType] || "/placeholder.svg",
          metadata: {
            roomType,
            roomConfig: config,
            isRecurring: false,
            frequency: "one_time",
          },
        })

        // Reset this room's count after adding to cart
        updateRoomCount(roomType, 0)

        toast({
          title: "Item added to cart",
          description: `${config.roomName} has been added to your cart.`,
          duration: 3000,
        })
      }
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

  const handleAddAllToCart = () => {
    try {
      let addedCount = 0
      const selectedRoomTypes = getSelectedRoomTypes()

      selectedRoomTypes.forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: count,
            image: roomImages[roomType] || "/placeholder.svg",
            metadata: {
              roomType,
              roomConfig: config,
              isRecurring: false,
              frequency: "one_time",
            },
          })

          // Reset this room's count after adding to cart
          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        toast({
          title: "All items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      toast({
        title: "Failed to add all to cart",
        description: "There was an error adding all items to your cart. Please try again.",
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
      return roomConfigs[roomType]
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
                      updateRoomCount(roomType, 1)
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
                          updateRoomCount(roomType, Math.max(0, (roomCounts[roomType] || 0) - 1))
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
                          updateRoomCount(roomType, (roomCounts[roomType] || 0) + 1)
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
                      {!isMultiSelection && (
                        <Button
                          id={`add-to-cart-${roomType}`}
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddSingleRoomToCart(roomType)
                          }}
                          aria-label={`Add ${roomDisplayNames[roomType] || roomType} to cart`}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add All to Cart Button - appears under the category when multi-selection is active */}
          {shouldShowAddAllButton && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                    Ready to add all selected rooms?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Total: {formatCurrency(getTotalPrice())} • {getSelectedRoomTypes().length} room types selected
                  </p>
                </div>
                <Button
                  onClick={handleAddAllToCart}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          )}
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
