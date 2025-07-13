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
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [addingRoomId, setAddingRoomId] = useState<string | null>(null)

  // No need for initialRenderComplete here anymore, as reset is handled at page level
  // The logic now relies purely on roomCounts from context, which is reset on page mount.

  const handleOpenWizard = (roomType: string) => {
    try {
      // If room count is 0, set it to 1 before opening wizard to ensure default config is created
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

  const handleRoomConfigChange = async (config: RoomConfig) => {
    if (!activeWizard) return // Should not happen

    setAddingRoomId(activeWizard) // Set loading state for the room being added
    try {
      // Update the room config in context
      updateRoomConfig(activeWizard, config)

      // Add the configured room to the cart
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate async operation
      addItem({
        id: `custom-cleaning-${activeWizard}-${Date.now()}`,
        name: `${config.roomName} Cleaning`,
        price: config.totalPrice,
        priceId: "price_custom_cleaning", // Use a generic price ID for custom services
        quantity: roomCounts[activeWizard] || 1, // Use current count or default to 1
        image: roomImages[activeWizard] || "/placeholder.svg",
        metadata: {
          roomType: activeWizard,
          roomConfig: config,
          isRecurring: false,
          frequency: "one_time",
          description: `${config.selectedTier} cleaning for ${config.roomName}`,
        },
      })

      // Reset this room's count after adding to cart, as it's now in the cart
      updateRoomCount(activeWizard, 0)

      toast({
        title: "Item added to cart",
        description: `${config.roomName} has been added to your cart with your customizations.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error adding item to cart after customization:", error)
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setAddingRoomId(null) // Reset loading state
      handleCloseWizard() // Close the wizard after adding to cart
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
      return (
        roomConfigs[roomType] || {
          roomName: roomDisplayNames[roomType] || roomType,
          selectedTier: "PREMIUM CLEAN", // Default to PREMIUM CLEAN for new configs
          selectedAddOns: [],
          selectedReductions: [],
          basePrice: 50,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          reductionsPrice: 0,
          totalPrice: 50,
        }
      )
    } catch (error) {
      console.error("Error getting room config:", error)
      return {
        roomName: roomType,
        selectedTier: "PREMIUM CLEAN",
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: 50,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: 50,
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
                  // Clicking the card always opens the wizard
                  handleOpenWizard(roomType)
                  if (onRoomSelect) {
                    onRoomSelect(roomType)
                  }
                }}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-full h-40 mb-3 relative rounded-lg overflow-hidden">
                    {" "}
                    {/* Changed h-24 to h-40 */}
                    <Image
                      src={roomImages[roomType] || roomImages.bedroom}
                      alt={`Professional ${roomDisplayNames[roomType] || roomType} cleaning before and after`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>

                  <h3 className="font-medium mb-2">{roomDisplayNames[roomType] || roomType}</h3>

                  {roomCounts[roomType] === 0 ? ( // This condition now relies on the reset context
                    <Button
                      id={`add-initial-${roomType}`}
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={async (e) => {
                        e.stopPropagation()
                        handleOpenWizard(roomType) // Opens wizard, then add to cart on apply
                      }}
                      disabled={addingRoomId === roomType}
                      aria-label={`Add 1 ${roomDisplayNames[roomType] || roomType} to cart`}
                    >
                      {addingRoomId === roomType ? (
                        "Adding..."
                      ) : (
                        <>
                          <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
                          Add 1 {roomDisplayNames[roomType] || roomType}
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-3 w-full">
                      <div className="flex items-center gap-3 justify-center">
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
                      <Button
                        id={`customize-${roomType}`}
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
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
                            handleOpenWizard(roomType) // Opens wizard, then add to cart on apply
                          }}
                          disabled={addingRoomId === roomType}
                          aria-label={`Add ${roomDisplayNames[roomType] || roomType} to cart`}
                        >
                          {addingRoomId === roomType ? (
                            "Adding..."
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      )}
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
