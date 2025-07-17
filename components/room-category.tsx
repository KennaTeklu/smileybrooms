"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Import CardDescription
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { roomImages, roomDisplayNames, roomIcons } from "@/lib/room-tiers"
import Image from "next/image"
import { useVibration } from "@/hooks/use-vibration"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context" // Import the missing hook

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
  quantity: number
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
  isPriceTBD?: boolean // Added for custom spaces
  paymentType?: "online" | "in_person" // Added for custom spaces
}

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  variant?: "primary" | "secondary"
  onRoomSelect?: (roomType: string) => void
  // tiers: RoomTier[] // Removed as it's not directly used here and can be derived
}

export function RoomCategory({ title, description, rooms, variant = "primary", onRoomSelect }: RoomCategoryProps) {
  const [activeWizard, setActiveWizard] = useState<string | null>(null)
  const { roomCounts, roomConfigs, updateRoomCount } = useRoomContext()
  const { addItem, removeItem, cart } = useCart()
  const isMultiSelection = Object.values(roomCounts).some((c) => c > 1)
  const [addingRoomId, setAddingRoomId] = useState<string | null>(null)
  const [initialRenderComplete, setInitialRenderComplete] = useState(false) // New state
  const { vibrate } = useVibration()
  // Removed showSuccessNotification and addedItemName states as they are no longer needed

  useEffect(() => {
    setInitialRenderComplete(true) // Set to true after the first render
  }, [])

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
    if (!activeWizard) return

    setAddingRoomId(activeWizard)
    try {
      const isOtherRoom = activeWizard.startsWith("other-custom-")

      // Calculate price per unit, assuming config.totalPrice is the total for config.quantity.
      const pricePerUnit = config.quantity > 0 ? config.totalPrice / config.quantity : 0

      // 1. Remove all existing items in the cart that match this roomType and its exact configuration.
      // This is crucial to prevent duplicates and ensure updates correctly reflect the desired quantity of unique instances.
      const itemsToRemove = cart.items.filter((item) => {
        const itemConfig = item.metadata?.roomConfig
        if (!itemConfig) return false

        // Compare the properties that define a "matching configuration" (excluding unique instance IDs or quantity).
        const matchesRoomType = item.metadata?.roomType === activeWizard
        const matchesTier = itemConfig.selectedTier === config.selectedTier

        // Ensure array comparisons are consistent by sorting the arrays.
        const matchesAddOns =
          JSON.stringify([...(itemConfig.selectedAddOns || [])].sort()) ===
          JSON.stringify([...(config.selectedAddOns || [])].sort())
        const matchesReductions =
          JSON.stringify([...(itemConfig.selectedReductions || [])].sort()) ===
          JSON.stringify([...(config.selectedReductions || [])].sort())

        // Special handling for "Other Space" to match by name if it's a custom entry.
        const isConfigOtherRoom =
          config.roomName === roomDisplayNames.other || config.roomName.startsWith("Custom Space")
        const isItemOtherRoom = item.metadata?.roomType?.startsWith("other-custom-")

        if (isConfigOtherRoom && isItemOtherRoom) {
          return itemConfig.roomName === config.roomName
        }

        return matchesRoomType && matchesTier && matchesAddOns && matchesReductions
      })

      // Remove identified items from the cart.
      itemsToRemove.forEach((item) => removeItem(item.id))

      // 2. Add the desired quantity of new, distinct items.
      for (let i = 0; i < config.quantity; i++) {
        // Generate a truly unique ID for each distinct instance using Date.now() and an iteration index.
        const uniqueId = `custom-cleaning-${activeWizard}-${Date.now()}-${i}`

        addItem({
          id: uniqueId, // Each added item gets a new unique ID.
          name: `${config.roomName} Cleaning Instance #${i + 1}`, // Add instance number for clarity in cart.
          price: pricePerUnit, // Use the calculated price per single unit.
          priceId: "price_custom_cleaning",
          quantity: 1, // Always add quantity 1 for each distinct item.
          image: roomImages[activeWizard] || roomImages.other,
          metadata: {
            roomType: activeWizard,
            roomConfig: { ...config, quantity: 1 }, // Store config for a single unit.
            isRecurring: false,
            frequency: "one_time",
            detailedTasks: config.detailedTasks,
            notIncludedTasks: config.notIncludedTasks,
            upsellMessage: config.upsellMessage,
          },
          paymentType: isOtherRoom ? "in_person" : "online",
        })
      }

      // Update the roomCounts in the useRoomContext to reflect the new total count,
      // which helps in updating the UI elements on the room cards.
      updateRoomCount(activeWizard, config.quantity)

      vibrate([100, 50, 100]) // Success vibration pattern.

      // Unified toast notification for a more accurate message.
      if (isOtherRoom) {
        toast({
          title: "Custom Space Updated!", // Changed from "Added!" to "Updated!"
          description:
            "Price and details for custom spaces will be discussed via email. Payment for additional services will be made in person.",
          variant: "default",
          duration: 8000,
        })
      } else {
        toast({
          title: "Rooms Updated!", // Changed to reflect that items were potentially removed and re-added
          description: `${config.quantity} x ${config.roomName} instances are now in your cart.`,
          duration: 3000,
        })
      }

      handleCloseWizard() // Close the wizard after changes are applied.
    } catch (error) {
      console.error("Error adding/updating items in cart after customization:", error)
      vibrate(300) // Error vibration pattern.
      toast({
        title: "Failed to update cart",
        description: "There was an error updating items in your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setAddingRoomId(null) // Reset loading state.
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
          quantity: 1,
          detailedTasks: [],
          notIncludedTasks: [],
          upsellMessage: "",
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
        quantity: 1,
        detailedTasks: [],
        notIncludedTasks: [],
        upsellMessage: "",
      }
    }
  }

  return (
    <>
      <TooltipProvider>
        <Card className="shadow-sm">
          <CardHeader className={getBgColor()}>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full ${getIconBgColor()} ${getIconTextColor()}`}
              ></span>
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription> {/* Re-added CardDescription */}
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className={`grid grid-cols-2 md:grid-cols-3 ${
                rooms.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              } gap-4`}
            >
              {rooms.map((roomType) => {
                const count = roomCounts[roomType] || 0
                const config = safeGetRoomConfig(roomType)
                const roomName = roomDisplayNames[roomType] || roomType
                const roomImage = roomImages[roomType] || roomImages.other
                const handleAdd = () => {
                  updateRoomCount(roomType, count + 1)
                  vibrate(50)
                }

                const handleRemove = () => {
                  if (count > 0) {
                    updateRoomCount(roomType, count - 1)
                    vibrate(50)
                  }
                }

                const handleCustomize = () => {
                  setActiveWizard(roomType)
                  vibrate(50)
                }

                return (
                  <Card
                    key={roomType}
                    className={`border ${
                      count > 0 ? getActiveBorderColor() : "border-gray-200 dark:border-gray-700"
                    } cursor-pointer overflow-hidden hover:shadow-md transition-shadow`}
                    onClick={() => {
                      // Clicking the card always opens the wizard
                      handleCustomize()
                      if (onRoomSelect) {
                        onRoomSelect(roomType)
                      }
                    }}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-full h-40 mb-3 relative rounded-t-lg overflow-hidden -mx-4 -mt-4">
                        <Image
                          src={roomImage || "/placeholder.svg"}
                          alt={`Professional ${roomName} cleaning before and after`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>

                      <h3 className="font-medium mb-2">{roomName}</h3>

                      {count === 0 || !initialRenderComplete ? (
                        <Button
                          id={`add-initial-${roomType}`}
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={async (e) => {
                            e.stopPropagation()
                            handleCustomize() // Opens wizard, then add to cart on apply
                          }}
                          disabled={addingRoomId === roomType}
                          aria-label={`Add 1 ${roomName} to cart`}
                        >
                          {addingRoomId === roomType ? (
                            "Adding..."
                          ) : (
                            <>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                              </motion.div>
                              Add 1 {roomName}
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
                                handleRemove()
                              }}
                              disabled={count <= 0}
                              className="h-8 w-8"
                              aria-label={`Decrease ${roomName} count`}
                            >
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Minus className="h-4 w-4" aria-hidden="true" />
                              </motion.div>
                            </Button>
                            <span className="font-medium text-lg">{count}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAdd()
                              }}
                              className="h-8 w-8"
                              aria-label={`Increase ${roomName} count`}
                            >
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                              </motion.div>
                            </Button>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCustomize()
                                }}
                                className="w-full flex items-center justify-center gap-2"
                              >
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Settings className="h-4 w-4" />
                                </motion.div>
                                Customize
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Adjust specific cleaning tasks and preferences for this room.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {activeWizard && (
          <MultiStepCustomizationWizard
            isOpen={activeWizard !== null}
            onClose={handleCloseWizard}
            roomType={activeWizard}
            roomName={roomDisplayNames[activeWizard] || activeWizard}
            roomIcon={roomIcons[activeWizard] || roomIcons.bedroom}
            roomCount={roomCounts[activeWizard] || 0}
            config={safeGetRoomConfig(activeWizard)}
            onConfigChange={handleRoomConfigChange}
          />
        )}
      </TooltipProvider>
    </>
  )
}
