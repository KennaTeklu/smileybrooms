"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Settings, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { roomImages, roomDisplayNames, roomIcons, type RoomTier } from "@/lib/room-tiers"
import Image from "next/image"
import { useVibration } from "@/hooks/use-vibration"
import { toast } from "@/components/ui/use-toast"
import { useMultiSelection } from "@/hooks/use-multi-selection" // Import the missing hook

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
}

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  variant?: "primary" | "secondary"
  onRoomSelect?: (roomType: string) => void
  tiers: RoomTier[]
}

export function RoomCategory({
  title,
  description,
  rooms,
  variant = "primary",
  onRoomSelect,
  tiers,
}: RoomCategoryProps) {
  const [activeWizard, setActiveWizard] = useState<string | null>(null)
  const { roomCounts, roomConfigs, updateRoomCount, addItem } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const [addingRoomId, setAddingRoomId] = useState<string | null>(null)
  const [initialRenderComplete, setInitialRenderComplete] = useState(false) // New state
  const { vibrate } = useVibration()
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [addedItemName, setAddedItemName] = useState("")

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
    if (!activeWizard) return // Should not happen

    setAddingRoomId(activeWizard) // Set loading state for the room being added
    try {
      // Update the room config in context
      updateRoomCount(activeWizard, config.quantity)
      addItem({
        id: `custom-cleaning-${activeWizard}-${Date.now()}`,
        name: `${config.roomName} Cleaning`,
        price: config.totalPrice,
        priceId: "price_custom_cleaning", // Use a generic price ID for custom services
        quantity: config.quantity,
        image: roomImages[activeWizard] || roomImages.other,
        metadata: {
          roomType: activeWizard,
          roomConfig: config,
          isRecurring: false,
          frequency: "one_time",
          detailedTasks: config.detailedTasks,
          notIncludedTasks: config.notIncludedTasks,
          upsellMessage: config.upsellMessage,
        },
      })

      setAddedItemName(`${config.quantity} x ${config.roomName}`)
      setShowSuccessNotification(true)
      vibrate([100, 50, 100]) // Success pattern

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)

      handleCloseWizard() // Close the wizard after adding to cart
    } catch (error) {
      console.error("Error adding item to cart after customization:", error)
      vibrate(300) // Error pattern
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setAddingRoomId(null) // Reset loading state
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

  const SuccessNotification = () => (
    <AnimatePresence>
      {showSuccessNotification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed top-4 right-4 z-[1000] bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Item Added!</div>
              <div className="text-xs opacity-90">{addedItemName} added to your cart.</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <TooltipProvider>
        <SuccessNotification />
        <Card className="shadow-sm">
          <CardHeader className={getBgColor()}>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-0 h-0 rounded-full ${getIconBgColor()} ${getIconTextColor()}`}
              ></span>
              {title}
            </CardTitle>
            {/* Removed CardDescription as it was not defined in the existing code */}
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
                    } cursor-pointer overflow-hidden`}
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
                        {" "}
                        {/* Changed h-24 to h-40 */}
                        <Image
                          src={roomImage || "/placeholder.svg"} // This line dynamically loads the image
                          alt={`Professional ${roomName} cleaning before and after`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>

                      <h3 className="font-medium mb-2">{roomName}</h3>

                      {count === 0 || !initialRenderComplete ? ( // Modified condition
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
                          {!isMultiSelection && (
                            <Button
                              id={`add-to-cart-${roomType}`}
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCustomize() // Opens wizard, then add to cart on apply
                              }}
                              disabled={addingRoomId === roomType}
                              aria-label={`Add ${roomName} to cart`}
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
                                  Add to Cart
                                </>
                              )}
                            </Button>
                          )}
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
