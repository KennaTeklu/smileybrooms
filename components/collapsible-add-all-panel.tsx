"use client"

import { useEffect } from "react"

import { useState, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Trash2,
  X,
  ArrowLeft,
  ArrowRight,
  ListChecks,
  ListX,
  Lightbulb,
  CheckCircle,
  Minus,
  PlusIcon,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames, defaultTiers, getRoomTiers, roomTiers } from "@/lib/room-tiers" // Import roomTiers
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface CollapsibleAddAllPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CollapsibleAddAllPanel({ isOpen, onOpenChange }: CollapsibleAddAllPanelProps) {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes } =
    useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [reviewStep, setReviewStep] = useState(0) // 0: room list, 1: confirmation
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [addedItemsCount, setAddedItemsCount] = useState(0)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<"one_time" | "monthly">("one_time")
  const [isFullHouseChecked, setIsFullHouseChecked] = useState(false)

  // State for adding custom rooms
  const [newCustomRoomName, setNewCustomRoomName] = useState("")
  const [newCustomRoomQuantity, setNewCustomRoomQuantity] = useState(1)
  const [newCustomRoomTier, setNewCustomRoomTier] = useState(defaultTiers.default[0]?.id || "default-essential")

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Auto-initialize all rooms with quantity 1 and default tier price when modal opens
  React.useEffect(() => {
    if (isOpen) {
      Object.keys(roomDisplayNames).forEach((roomType) => {
        // Ensure room count is at least 1 if it's a standard room type
        if (!roomType.startsWith("other-custom-") && roomCounts[roomType] === 0) {
          updateRoomCount(roomType, 1)
        }

        // Ensure roomConfig is set with the default tier's price and details
        if (!roomConfigs[roomType] || roomConfigs[roomType].selectedTier === undefined) {
          const defaultTierForRoom = getRoomTiers(roomType)[0] // Get the first tier for this specific room type
          if (defaultTierForRoom) {
            const genericTierDetails = roomTiers[defaultTierForRoom.name] // Get detailed tasks from generic tiers
            updateRoomConfig(roomType, {
              roomName: roomDisplayNames[roomType] || roomType,
              selectedTier: defaultTierForRoom.id,
              totalPrice: defaultTierForRoom.price,
              selectedAddOns: [],
              selectedReductions: [],
              detailedTasks: genericTierDetails?.detailedTasks || [],
              notIncludedTasks: genericTierDetails?.notIncludedTasks || [],
              upsellMessage: genericTierDetails?.upsellMessage || "",
            })
          }
        }
      })
    }
  }, [isOpen, roomCounts, roomConfigs, updateRoomCount, updateRoomConfig])

  const selectedRoomTypes = getSelectedRoomTypes()
  const baseTotalPrice = getTotalPrice()

  // Calculate the total price to display in the modal, including the full house discount
  const displayTotalPrice = useMemo(() => {
    let price = baseTotalPrice
    if (selectedFrequency === "one_time" && isFullHouseChecked) {
      price *= 0.95 // Apply 5% discount for one-time full house
    }
    return price
  }, [baseTotalPrice, selectedFrequency, isFullHouseChecked])

  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  // Keyboard shortcuts for panel toggle and escape
  useKeyboardShortcuts({
    "alt+a": () => onOpenChange(!isOpen),
    Escape: () => {
      if (isOpen) {
        onOpenChange(false)
        setReviewStep(0)
      }
    },
  })

  const handleAddAllToCart = useCallback(async () => {
    setIsAddingToCart(true)
    try {
      let addedCount = 0

      selectedRoomTypes.forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName || roomDisplayNames[roomType] || roomType} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: count,
            image: roomType.startsWith("other-custom-") ? roomImages.other : roomImages[roomType] || "/placeholder.svg",
            metadata: {
              roomType,
              roomConfig: config,
              isRecurring: selectedFrequency === "monthly",
              frequency: selectedFrequency,
              detailedTasks: config.detailedTasks,
              notIncludedTasks: config.notIncludedTasks,
              upsellMessage: config.upsellMessage,
            },
            isFullHousePromoApplied: selectedFrequency === "one_time" && isFullHouseChecked,
          })

          updateRoomCount(roomType, 0) // Clear count after adding to cart
          addedCount++
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100])

        setAddedItemsCount(addedCount)
        setShowSuccessNotification(true)

        onOpenChange(false)
        setReviewStep(0)

        setTimeout(() => {
          setShowSuccessNotification(false)
        }, 3000)
      } else {
        toast({
          title: "No rooms selected",
          description: "Please select at least one room to add to your cart.",
          variant: "default",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      vibrate(300)
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding all items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }, [
    selectedRoomTypes,
    roomCounts,
    roomConfigs,
    addItem,
    updateRoomCount,
    vibrate,
    onOpenChange,
    selectedFrequency,
    isFullHouseChecked,
  ])

  const handleRemoveRoom = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, 0)
      vibrate(50)
    },
    [updateRoomCount, vibrate],
  )

  const handleIncrementRoom = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, (roomCounts[roomType] || 0) + 1)
      vibrate(50)
    },
    [roomCounts, updateRoomCount, vibrate],
  )

  const handleDecrementRoom = useCallback(
    (roomType: string) => {
      if ((roomCounts[roomType] || 0) > 0) {
        updateRoomCount(roomType, (roomCounts[roomType] || 0) - 1)
        vibrate(50)
      }
    },
    [roomCounts, updateRoomCount, vibrate],
  )

  const handleRoomTierChange = useCallback(
    (roomType: string, newTierId: string) => {
      const availableTiers = getRoomTiers(roomType)
      const selectedTierObject = availableTiers.find((t) => t.id === newTierId)

      if (selectedTierObject) {
        const genericTierDetails = roomTiers[selectedTierObject.name] // Get detailed tasks from generic tiers
        updateRoomConfig(roomType, {
          ...roomConfigs[roomType], // Keep existing config properties
          roomName: roomDisplayNames[roomType] || roomType, // Ensure roomName is set
          selectedTier: newTierId,
          totalPrice: selectedTierObject.price,
          detailedTasks: genericTierDetails?.detailedTasks || [],
          notIncludedTasks: genericTierDetails?.notIncludedTasks || [],
          upsellMessage: genericTierDetails?.upsellMessage || "",
        })
        vibrate(50)
      }
    },
    [roomConfigs, updateRoomConfig, vibrate],
  )

  const handleAddCustomRoom = useCallback(() => {
    if (!newCustomRoomName.trim() || newCustomRoomQuantity <= 0) {
      toast({
        title: "Invalid Custom Room",
        description: "Please enter a name and a quantity greater than 0 for your custom room.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const customRoomId = `other-custom-${Date.now()}` // Unique ID for custom room
    const selectedDefaultTier = defaultTiers.default.find((t) => t.id === newCustomRoomTier)
    const genericTierDetails = roomTiers[selectedDefaultTier?.name || "PREMIUM CLEAN"] // Fallback to PREMIUM CLEAN

    updateRoomCount(customRoomId, newCustomRoomQuantity)
    updateRoomConfig(customRoomId, {
      roomName: newCustomRoomName.trim(),
      selectedTier: newCustomRoomTier,
      totalPrice: selectedDefaultTier?.price || 0, // Use price from selected default tier
      isPriceTBD: false, // Price is now determined by selected tier
      selectedAddOns: [], // Custom rooms start with no add-ons/reductions
      selectedReductions: [],
      detailedTasks: genericTierDetails?.detailedTasks || [],
      notIncludedTasks: genericTierDetails?.notIncludedTasks || [],
      upsellMessage: genericTierDetails?.upsellMessage || "",
    })

    setNewCustomRoomName("")
    setNewCustomRoomQuantity(1)
    setNewCustomRoomTier(defaultTiers.default[0]?.id || "default-essential")

    toast({
      title: "Custom Room Added",
      description: `${newCustomRoomName} (x${newCustomRoomQuantity}) added to your selection.`,
      variant: "success",
      duration: 3000,
    })
    vibrate(50)
  }, [newCustomRoomName, newCustomRoomQuantity, newCustomRoomTier, updateRoomCount, updateRoomConfig, vibrate])

  const handleBackToButton = useCallback(() => {
    onOpenChange(false)
    setReviewStep(0)
    vibrate(50)
  }, [vibrate, onOpenChange])

  const handleNextStep = useCallback(() => {
    setReviewStep(1)
    vibrate(50)
  }, [vibrate])

  const handlePrevStep = useCallback(() => {
    setReviewStep(0)
    vibrate(50)
  }, [vibrate])

  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      // Show button if content is scrollable and not at the very bottom (with a small buffer)
      setShowScrollToBottom(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    const currentRef = scrollContainerRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollPosition)
      // Initial check
      checkScrollPosition()
      // Re-check on resize or content change (e.g., when modal opens or content loads)
      const resizeObserver = new ResizeObserver(checkScrollPosition)
      resizeObserver.observe(currentRef)

      return () => {
        currentRef.removeEventListener("scroll", checkScrollPosition)
        resizeObserver.disconnect()
      }
    }
  }, [checkScrollPosition, isOpen, reviewStep]) // Re-run when modal opens or step changes

  // Memoized room list with enhanced styling
  const roomList = useMemo(() => {
    return selectedRoomTypes.map((roomType, index) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      // Determine the image source: use specific room image or fallback to 'other' if it's a custom room
      const imageSrc = roomType.startsWith("other-custom-")
        ? roomImages.other
        : roomImages[roomType] || "/placeholder.svg"
      const displayName = roomType.startsWith("other-custom-")
        ? config?.roomName || "Custom Space"
        : roomDisplayNames[roomType] || roomType

      const displayPrice = config?.isPriceTBD ? "Price TBD" : formatCurrency(config?.totalPrice || 0)
      const displayRoomTotal = config?.isPriceTBD ? "Price TBD" : formatCurrency(roomTotal)

      const availableTiers = getRoomTiers(roomType)

      return (
        <motion.div
          key={roomType}
          className="flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <Image src={imageSrc || "/placeholder.svg"} alt={displayName} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{displayName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Select
                  value={config?.selectedTier || availableTiers[0]?.id}
                  onValueChange={(newTierId) => handleRoomTierChange(roomType, newTierId)}
                >
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id} className="text-xs">
                        {tier.name} ({formatCurrency(tier.price)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-xs mt-2">
                {displayPrice} per room
              </Badge>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400">{displayRoomTotal}</div>
              <div className="flex items-center justify-end space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDecrementRoom(roomType)
                  }}
                  disabled={count <= 0}
                  className="h-7 w-7"
                  aria-label={`Decrease ${displayName} count`}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium">{count}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleIncrementRoom(roomType)
                  }}
                  className="h-7 w-7"
                  aria-label={`Increase ${displayName} count`}
                >
                  <PlusIcon className="h-3 w-3" />
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveRoom(roomType)
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-0 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                        aria-label={`Remove ${displayName} from selection`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove from selection</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <Accordion type="single" collapsible className="w-full mt-2">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
                View Details
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-3">
                {config?.detailedTasks && config.detailedTasks.length > 0 && (
                  <div>
                    <h5 className="flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                      <ListChecks className="h-4 w-4" /> Included Tasks:
                    </h5>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                      {config.detailedTasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {config?.notIncludedTasks && config.notIncludedTasks.length > 0 && (
                  <div>
                    <h5 className="flex items-center gap-1 text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                      <ListX className="h-4 w-4" /> Not Included:
                    </h5>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                      {config.notIncludedTasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {config?.upsellMessage && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">{config.upsellMessage}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )
    })
  }, [
    selectedRoomTypes,
    roomConfigs,
    roomCounts,
    handleRemoveRoom,
    handleIncrementRoom,
    handleDecrementRoom,
    handleRoomTierChange,
  ])

  // Success notification overlay
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
              <div className="font-bold text-sm">Items Added to Cart!</div>
              <div className="text-xs opacity-90">
                {addedItemsCount} room type{addedItemsCount !== 1 ? "s" : ""} added successfully
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Fullscreen review mode
  return (
    <>
      <SuccessNotification />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-0 flex-shrink-0 border-b border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToButton}
                      className="text-white hover:bg-white/20 rounded-full h-9 w-9"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h2 className="text-lg font-bold">{reviewStep === 0 ? "Select Rooms" : "Confirm Order"}</h2>
                      <p className="text-blue-100 text-sm">
                        {reviewStep === 0
                          ? "Choose your cleaning services"
                          : `${selectedRoomTypes.length} rooms • ${formatCurrency(displayTotalPrice)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${reviewStep === 0 ? "bg-white" : "bg-white/50"}`}
                      />
                      <div className={`w-8 h-0.5 transition-colors ${reviewStep === 1 ? "bg-white" : "bg-white/30"}`} />
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${reviewStep === 1 ? "bg-white" : "bg-white/50"}`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToButton}
                      className="text-white hover:bg-white/20 rounded-full h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
                <div className="h-full overflow-y-auto">
                  {reviewStep === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 space-y-4"
                    >
                      {/* Room Grid */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rooms</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{selectedRoomTypes.length} selected</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                Object.keys(roomDisplayNames).forEach((roomType) => {
                                  updateRoomCount(roomType, 0)
                                })
                              }}
                              className="text-xs"
                            >
                              Clear All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                Object.keys(roomDisplayNames).forEach((roomType) => {
                                  updateRoomCount(roomType, 1)
                                  const defaultTierForRoom = getRoomTiers(roomType)[0]
                                  if (defaultTierForRoom) {
                                    const genericTierDetails = roomTiers[defaultTierForRoom.name]
                                    updateRoomConfig(roomType, {
                                      roomName: roomDisplayNames[roomType] || roomType,
                                      selectedTier: defaultTierForRoom.id,
                                      totalPrice: defaultTierForRoom.price,
                                      selectedAddOns: [],
                                      selectedReductions: [],
                                      detailedTasks: genericTierDetails?.detailedTasks || [],
                                      notIncludedTasks: genericTierDetails?.notIncludedTasks || [],
                                      upsellMessage: genericTierDetails?.upsellMessage || "",
                                    })
                                  }
                                })
                              }}
                              className="text-xs"
                            >
                              Select All
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.keys(roomDisplayNames).map((roomType) => {
                            const config = roomConfigs[roomType] || {
                              selectedTier: getRoomTiers(roomType)[0]?.id || "default-essential",
                              totalPrice: getRoomTiers(roomType)[0]?.price || 0,
                              detailedTasks: getRoomTiers(roomType)[0]?.features || [],
                              notIncludedTasks: [],
                              upsellMessage: "",
                            }
                            const count = roomCounts[roomType] || 0 // Initialize count to 0
                            const imageSrc = roomImages[roomType] || "/placeholder.svg"
                            const displayName = roomDisplayNames[roomType] || roomType
                            const availableTiers = getRoomTiers(roomType)

                            return (
                              <motion.div
                                key={roomType}
                                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                  count > 0
                                    ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() => {
                                  if (count === 0) {
                                    updateRoomCount(roomType, 1)
                                    const defaultTierForRoom = getRoomTiers(roomType)[0]
                                    if (defaultTierForRoom) {
                                      const genericTierDetails = roomTiers[defaultTierForRoom.name]
                                      updateRoomConfig(roomType, {
                                        roomName: roomDisplayNames[roomType] || roomType,
                                        selectedTier: defaultTierForRoom.id,
                                        totalPrice: defaultTierForRoom.price,
                                        selectedAddOns: [],
                                        selectedReductions: [],
                                        detailedTasks: genericTierDetails?.detailedTasks || [],
                                        notIncludedTasks: genericTierDetails?.notIncludedTasks || [],
                                        upsellMessage: genericTierDetails?.upsellMessage || "",
                                      })
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={imageSrc || "/placeholder.svg"}
                                      alt={displayName}
                                      fill
                                      className="object-cover"
                                    />
                                    {count > 0 && (
                                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{displayName}</h4>
                                    <Select
                                      value={config?.selectedTier || availableTiers[0]?.id}
                                      onValueChange={(newTierId) => handleRoomTierChange(roomType, newTierId)}
                                    >
                                      <SelectTrigger className="w-[120px] h-7 text-xs mt-1">
                                        <SelectValue placeholder="Select Tier" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableTiers.map((tier) => (
                                          <SelectItem key={tier.id} value={tier.id} className="text-xs">
                                            {tier.name} ({formatCurrency(tier.price)})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {count > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDecrementRoom(roomType)
                                        }}
                                        className="h-6 w-6"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-6 text-center text-sm font-medium">{count}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleIncrementRoom(roomType)
                                        }}
                                        className="h-6 w-6"
                                      >
                                        <PlusIcon className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Service Options */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold mb-3">Frequency</h4>
                          <RadioGroup
                            value={selectedFrequency}
                            onValueChange={(value: "one_time" | "monthly") => {
                              setSelectedFrequency(value)
                              if (value === "monthly") {
                                setIsFullHouseChecked(false)
                              }
                            }}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <RadioGroupItem value="one_time" id="freq-one" />
                              <Label htmlFor="freq-one" className="cursor-pointer flex-1">
                                One-time
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <RadioGroupItem value="monthly" id="freq-monthly" />
                              <Label htmlFor="freq-monthly" className="cursor-pointer flex-1">
                                Monthly
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {selectedFrequency === "one_time" && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                            <h4 className="font-semibold mb-3 text-green-800 dark:text-green-300">Special Offer</h4>
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="full-house"
                                checked={isFullHouseChecked}
                                onCheckedChange={(checked) => setIsFullHouseChecked(!!checked)}
                              />
                              <div>
                                <Label
                                  htmlFor="full-house"
                                  className="cursor-pointer font-medium text-green-800 dark:text-green-300"
                                >
                                  Full House - Save 5%
                                </Label>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                  Check if booking entire home
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Custom Room */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold mb-3">Add Custom Space</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Input
                            placeholder="Space name"
                            value={newCustomRoomName}
                            onChange={(e) => setNewCustomRoomName(e.target.value)}
                          />
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setNewCustomRoomQuantity(Math.max(1, newCustomRoomQuantity - 1))}
                              className="h-9 w-9"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={newCustomRoomQuantity}
                              onChange={(e) => setNewCustomRoomQuantity(Number.parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setNewCustomRoomQuantity(newCustomRoomQuantity + 1)}
                              className="h-9 w-9"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <Select value={newCustomRoomTier} onValueChange={setNewCustomRoomTier}>
                            <SelectTrigger>
                              <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                              {defaultTiers.default.map((tier) => (
                                <SelectItem key={tier.id} value={tier.id}>
                                  {tier.name} ({formatCurrency(tier.price)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleAddCustomRoom}
                          className="mt-3 w-full"
                          disabled={!newCustomRoomName.trim()}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Space
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Order Summary */}
                      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          Order Summary
                        </h4>
                        <div className="space-y-2">
                          {selectedRoomTypes.map((roomType) => {
                            const config = roomConfigs[roomType]
                            const count = roomCounts[roomType]
                            const roomTotal = (config?.totalPrice || 0) * count
                            const displayName = roomType.startsWith("other-custom-")
                              ? config?.roomName || "Custom Space"
                              : roomDisplayNames[roomType] || roomType

                            const displayPrice = config?.isPriceTBD
                              ? "Price TBD"
                              : formatCurrency(config?.totalPrice || 0)
                            const displayRoomTotal = config?.isPriceTBD ? "Price TBD" : formatCurrency(roomTotal)

                            return (
                              <div
                                key={roomType}
                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                                    <Image
                                      src={
                                        roomType.startsWith("other-custom-")
                                          ? roomImages.other
                                          : roomImages[roomType] || "/placeholder.svg"
                                      }
                                      alt={displayName}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-sm">{displayName}</span>
                                    <span className="text-gray-500 text-xs ml-1">(×{count})</span>
                                  </div>
                                </div>
                                <span className="font-semibold">{displayRoomTotal}</span>
                              </div>
                            )
                          })}
                        </div>

                        <div className="border-t pt-3 mt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              {formatCurrency(displayTotalPrice)} {selectedFrequency === "monthly" ? "/ month" : ""}
                            </span>
                          </div>
                          {selectedFrequency === "one_time" && isFullHouseChecked && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 mt-1">
                              <span>Full House Discount (5%)</span>
                              <span>-{formatCurrency(baseTotalPrice * 0.05)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Scroll to bottom button */}
              {reviewStep === 0 && showScrollToBottom && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-20 right-4 z-50"
                >
                  <Button
                    onClick={scrollToBottom}
                    className="rounded-full p-2 shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                    size="icon"
                    aria-label="Scroll to bottom"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Footer with Clear Navigation */}
              <div className="border-t bg-white dark:bg-gray-900 p-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 order-2 sm:order-1">
                    <span className="text-sm text-gray-500">Step {reviewStep + 1} of 2</span>
                    {selectedRoomTypes.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {totalItems} items • {formatCurrency(displayTotalPrice)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                    {reviewStep === 1 ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1 sm:flex-none bg-transparent"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button
                          onClick={handleAddAllToCart}
                          disabled={!isOnline || isAddingToCart || selectedRoomTypes.length === 0}
                          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                        >
                          {isAddingToCart ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleBackToButton}
                          className="flex-1 sm:flex-none bg-transparent"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          disabled={selectedRoomTypes.length === 0}
                          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
