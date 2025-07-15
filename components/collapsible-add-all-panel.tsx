"use client"

import { useEffect } from "react"
import { useState, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Plus, X, ArrowLeft, ArrowRight, CheckCircle, Minus, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROOM_CONFIG } from "@/lib/constants" // Import ROOM_CONFIG
import { defaultTiers, roomTiers, roomDisplayNames, roomImages } from "@/lib/room-data" // Import defaultTiers, roomTiers, roomDisplayNames, roomImages
import { getRoomTiers } from "@/lib/room-utils" // Import getRoomTiers
import { updateRoomConfig } from "@/lib/room-config-utils" // Import updateRoomConfig
import { getActiveBorderColor } from "@/lib/ui-utils" // Import getActiveBorderColor
import { requiresEmailPricing } from "@/lib/pricing-utils" // Import requiresEmailPricing
import { CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/legal-disclaimers" // Import CUSTOM_SPACE_LEGAL_DISCLAIMER

interface CollapsibleAddAllPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CollapsibleAddAllPanel({ isOpen, onOpenChange }: CollapsibleAddAllPanelProps) {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [reviewStep, setReviewStep] = useState(0) // 0: room list, 1: confirmation
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<keyof typeof ROOM_CONFIG.frequencyMultipliers>("one_time")
  const [isFullHouseChecked, setIsFullHouseChecked] = useState(false)

  const premiumTierName = useMemo(() => {
    const premiumTier = defaultTiers.default.find((tier) => tier.name === "PREMIUM CLEAN")
    return premiumTier ? premiumTier.name : "ESSENTIAL CLEAN"
  }, [])

  const [selectedGlobalTierName, setSelectedGlobalTierName] = useState<keyof typeof roomTiers>(premiumTierName)

  const [newCustomRoomName, setNewCustomRoomName] = useState("")
  const [newCustomRoomQuantity, setNewCustomRoomQuantity] = useState(1)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const hasInitializedRoomsOnOpenRef = useRef(false)
  const [hasClearedAll, setHasClearedAll] = useState(false)

  const applyGlobalTierToRoom = useCallback(
    (roomType: string, globalTierName: keyof typeof roomTiers, currentRoomConfigs: typeof roomConfigs) => {
      const globalTierDetails = roomTiers[globalTierName]

      if (!globalTierDetails) {
        console.warn(`Global tier details not found for name: ${globalTierName}`)
        return
      }

      const roomSpecificTiers = getRoomTiers(roomType)
      const selectedRoomSpecificTier = roomSpecificTiers.find((tier) => tier.name === globalTierName)

      const currentConfig = currentRoomConfigs[roomType]
      const currentTierId = currentConfig?.selectedTier
      const currentPrice = currentConfig?.totalPrice

      const finalTierId = selectedRoomSpecificTier?.id || `custom-${globalTierName.toLowerCase().replace(/\s/g, "-")}`
      const finalPrice = selectedRoomSpecificTier?.price || globalTierDetails.basePrice

      updateRoomConfig(roomType, {
        ...currentConfig,
        roomName: roomDisplayNames[roomType] || roomType,
        selectedTier: finalTierId,
        totalPrice: finalPrice,
        selectedAddOns: [],
        selectedReductions: [],
        detailedTasks: globalTierDetails.detailedTasks || [],
        notIncludedTasks: globalTierDetails.notIncludedTasks || [],
        upsellMessage: globalTierDetails.upsellMessage || "",
      })
    },
    [updateRoomConfig],
  )

  useEffect(() => {
    if (isOpen && !hasInitializedRoomsOnOpenRef.current) {
      Object.keys(roomDisplayNames).forEach((roomType) => {
        if (!roomType.startsWith("other-custom-")) {
          updateRoomCount(roomType, 1)
          applyGlobalTierToRoom(roomType, selectedGlobalTierName, roomConfigs)
        }
      })
      hasInitializedRoomsOnOpenRef.current = true
      setHasClearedAll(false)
    } else if (!isOpen) {
      hasInitializedRoomsOnOpenRef.current = false
      setHasClearedAll(false)
    }
  }, [isOpen, selectedGlobalTierName, updateRoomCount, applyGlobalTierToRoom, roomConfigs])

  const displayTotalPrice = getTotalPrice()

  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

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
      const frequencyMultiplier = ROOM_CONFIG.frequencyMultipliers[selectedFrequency] || 1.0

      // First, update the room counts in the context
      const selectedRoomTypes = getSelectedRoomTypes()
      selectedRoomTypes.forEach((roomType) => {
        if (roomCounts[roomType] === 0) {
          updateRoomCount(roomType, 1)
        }
      })

      // Then, iterate over the updated room counts and add items to the cart
      Object.keys(roomCounts).forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          const basePricePerUnit = config.totalPrice || 0 // Assuming totalPrice here is for one unit of the configured room
          const adjustedPricePerUnit = basePricePerUnit * frequencyMultiplier

          // Add each instance as a separate item with quantity 1
          for (let i = 0; i < count; i++) {
            const uniqueId = `custom-cleaning-${roomType}-${Date.now()}-${i}` // Truly unique ID for each instance

            addItem({
              id: uniqueId, // Each added item gets a new unique ID
              name: `${config.roomName || roomDisplayNames[roomType] || roomType} Cleaning Instance #${i + 1}`, // Name for individual instance
              price: adjustedPricePerUnit, // Price for a single unit
              priceId: "price_custom_cleaning",
              quantity: 1, // Always 1 for individual instances
              image: roomType.startsWith("other-custom-")
                ? roomImages.other
                : roomImages[roomType] || "/placeholder.svg",
              metadata: {
                roomType,
                roomConfig: { ...config, quantity: 1 }, // Store config for a single unit
                isRecurring: selectedFrequency !== "one_time",
                frequency: selectedFrequency,
                detailedTasks: config.detailedTasks,
                notIncludedTasks: config.notIncludedTasks,
                upsellMessage: config.upsellMessage,
                basePrice: basePricePerUnit,
                frequencyMultiplier: frequencyMultiplier,
              },
              isFullHousePromoApplied: selectedFrequency !== "one_time" && isFullHouseChecked,
              paymentType: config.paymentType,
            })
          }

          addedCount++ // Count of room *types* added, not individual instances
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100])

        toast({
          title: "Added to cart",
          description: `${addedCount} room type${addedCount !== 1 ? "s" : ""} added to your cart.`,
          variant: "default",
          duration: 3000,
        })

        onOpenChange(false)
        setReviewStep(0)
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
        description: "There was an error adding the items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }, [
    getSelectedRoomTypes,
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
      setHasClearedAll(true)
    },
    [updateRoomCount, vibrate],
  )

  const handleIncrementRoom = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, (roomCounts[roomType] || 0) + 1)
      if (roomCounts[roomType] === 0) {
        applyGlobalTierToRoom(roomType, selectedGlobalTierName, roomConfigs)
      }
      vibrate(50)
    },
    [roomCounts, updateRoomCount, vibrate, applyGlobalTierToRoom, selectedGlobalTierName, roomConfigs],
  )

  const handleDecrementRoom = useCallback(
    (roomType: string) => {
      if ((roomCounts[roomType] || 0) > 0) {
        updateRoomCount(roomType, (roomCounts[roomType] || 0) - 1)
        vibrate(50)
        const remainingRooms = Object.values(roomCounts).filter((count, key) => key !== roomType && count > 0)
        if (remainingRooms.length === 0 && (roomCounts[roomType] || 0) === 1) {
          setHasClearedAll(true)
        }
      }
    },
    [roomCounts, updateRoomCount, vibrate],
  )

  const handleGlobalTierChange = useCallback(
    (newTierName: keyof typeof roomTiers) => {
      setSelectedGlobalTierName(newTierName)
      const selectedRoomTypes = getSelectedRoomTypes()
      selectedRoomTypes.forEach((roomType) => {
        applyGlobalTierToRoom(roomType, newTierName, roomConfigs)
      })
      vibrate(50)
    },
    [getSelectedRoomTypes, applyGlobalTierToRoom, vibrate, roomConfigs],
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

    const customRoomId = `other-custom-${Date.now()}`
    const selectedGlobalTierDetails = roomTiers[selectedGlobalTierName]

    updateRoomCount(customRoomId, newCustomRoomQuantity)
    updateRoomConfig(customRoomId, {
      roomName: newCustomRoomName.trim(),
      selectedTier: `custom-${selectedGlobalTierName.toLowerCase().replace(/\s/g, "-")}`,
      totalPrice: 0,
      isPriceTBD: true,
      selectedAddOns: [],
      selectedReductions: [],
      detailedTasks: selectedGlobalTierDetails?.detailedTasks || [],
      notIncludedTasks: selectedGlobalTierDetails?.notIncludedTasks || [],
      upsellMessage: selectedGlobalTierDetails?.upsellMessage || "",
      paymentType: "in_person",
    })

    setNewCustomRoomName("")
    setNewCustomRoomQuantity(1)

    toast({
      title: "Custom Room Added",
      description: `${newCustomRoomName} (x${newCustomRoomQuantity}) added to your selection.`,
      variant: "success",
      duration: 3000,
    })
    vibrate(50)
  }, [newCustomRoomName, newCustomRoomQuantity, selectedGlobalTierName, updateRoomCount, updateRoomConfig, vibrate])

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
      checkScrollPosition()
      const resizeObserver = new ResizeObserver(checkScrollPosition)
      resizeObserver.observe(currentRef)

      return () => {
        currentRef.removeEventListener("scroll", checkScrollPosition)
        resizeObserver.disconnect()
      }
    }
  }, [checkScrollPosition, isOpen, reviewStep])

  const roomList = useMemo(() => {
    const selectedRoomTypes = getSelectedRoomTypes()
    return selectedRoomTypes.map((roomType, index) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      const imageSrc = roomType.startsWith("other-custom-")
        ? roomImages.other
        : roomImages[roomType] || "/placeholder.svg"
      const displayName = roomType.startsWith("other-custom-")
        ? config?.roomName || "Custom Space"
        : roomDisplayNames[roomType] || roomType

      const isCustomOrInPerson = roomType.startsWith("other-custom-") || config?.paymentType === "in_person"

      const displayPrice = isCustomOrInPerson ? "Email for Pricing" : formatCurrency(config?.totalPrice || 0)
      const displayRoomTotal = isCustomOrInPerson ? "Email for Pricing" : formatCurrency(roomTotal)

      return (
        <motion.div
          key={roomType}
          className="flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <Image src={imageSrc || "/placeholder.svg"} alt={displayName} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{displayName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {defaultTiers.default.find((t) => t.id === config?.selectedTier)?.name || "Custom Tier"}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400">{displayRoomTotal}</div>
              <div className="flex items-center gap-1">
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
              </div>
            </div>
          </div>
        </motion.div>
      )
    })
  }, [getSelectedRoomTypes, roomConfigs, roomCounts, handleRemoveRoom, handleIncrementRoom, handleDecrementRoom])

  return (
    <TooltipProvider>
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
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-0 flex-shrink-0 border-b border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToButton}
                      className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h2 className="text-lg font-bold">{reviewStep === 0 ? "Select Rooms" : "Confirm Order"}</h2>
                      <p className="text-blue-100 text-sm">
                        {reviewStep === 0
                          ? "Choose your cleaning services"
                          : `${getSelectedRoomTypes().length} rooms • ${formatCurrency(displayTotalPrice)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          reviewStep === 0 ? "bg-white" : "bg-white/50"
                        }`}
                      />
                      <div className={`w-8 h-0.5 transition-colors ${reviewStep === 1 ? "bg-white" : "bg-white/30"}`} />
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          reviewStep === 1 ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToButton}
                      className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
                <div className="h-full overflow-y-auto">
                  {reviewStep === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 space-y-4"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                          Choose Cleaning Level for All Rooms
                        </h3>
                        <Select value={selectedGlobalTierName} onValueChange={handleGlobalTierChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {Object.keys(roomTiers)
                              .filter((tierName) =>
                                ["ESSENTIAL CLEAN", "PREMIUM CLEAN", "LUXURY CLEAN"].includes(tierName),
                              )
                              .map((tierName) => (
                                <SelectItem key={tierName} value={tierName}>
                                  {tierName} ({formatCurrency(roomTiers[tierName].basePrice)})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500 mt-2">
                          This selection will apply to all rooms you add below.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rooms</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{getSelectedRoomTypes().length} selected</Badge>
                            {getSelectedRoomTypes().length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  Object.keys(roomDisplayNames).forEach((roomType) => {
                                    updateRoomCount(roomType, 0)
                                  })
                                  setHasClearedAll(true)
                                }}
                                className="text-xs"
                              >
                                Clear All
                              </Button>
                            )}
                            {hasClearedAll && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  Object.keys(roomDisplayNames).forEach((roomType) => {
                                    if (!roomType.startsWith("other-custom-")) {
                                      updateRoomCount(roomType, 1)
                                      applyGlobalTierToRoom(roomType, selectedGlobalTierName, roomConfigs)
                                    }
                                  })
                                  setHasClearedAll(false)
                                }}
                                className="text-xs"
                              >
                                Select All
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.keys(roomDisplayNames).map((roomType) => {
                            const config = roomConfigs[roomType] || {
                              selectedTier: `custom-${selectedGlobalTierName.toLowerCase().replace(/\s/g, "-")}`,
                              totalPrice: roomTiers[selectedGlobalTierName]?.basePrice || 0,
                              detailedTasks: roomTiers[selectedGlobalTierName]?.detailedTasks || [],
                              notIncludedTasks: [],
                              upsellMessage: "",
                            }
                            const count = roomCounts[roomType] || 0
                            const imageSrc = roomImages[roomType] || "/placeholder.svg"
                            const displayName = roomDisplayNames[roomType] || roomType

                            return (
                              <motion.div
                                key={roomType}
                                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                  count > 0 ? getActiveBorderColor() : "border-gray-200 dark:border-gray-700"
                                }`}
                                onClick={() => {
                                  if (count === 0) {
                                    updateRoomCount(roomType, 1)
                                    applyGlobalTierToRoom(roomType, selectedGlobalTierName, roomConfigs)
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
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{displayName}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {requiresEmailPricing(roomType)
                                        ? "Email for Pricing"
                                        : formatCurrency(config?.totalPrice || 0)}
                                    </p>
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
                                        disabled={count <= 0}
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

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold mb-3">Add Custom Space</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                              onChange={(e) =>
                                Number.parseInt(e.target.value) >= 1
                                  ? setNewCustomRoomQuantity(Number.parseInt(e.target.value))
                                  : setNewCustomRoomQuantity(1)
                              }
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
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button onClick={handleAddCustomRoom} className="flex-1" disabled={!newCustomRoomName.trim()}>
                            <Plus className="h-4 w-4 mr-2" /> Add Space
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (!newCustomRoomName.trim()) {
                                toast({
                                  title: "Please enter a space name",
                                  description: "Enter the name of your custom space to get a price quote.",
                                  variant: "default",
                                  duration: 3000,
                                })
                                return
                              }

                              const subject = "Custom Space Pricing Request"
                              const body = `Hello smileybrooms team, I was wondering what the price would be for ${newCustomRoomQuantity} ${newCustomRoomName}. Best regards`
                              const mailtoLink = `mailto:customize@smileybrooms.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                              window.open(mailtoLink, "_blank")
                            }}
                            disabled={!newCustomRoomName.trim()}
                            className="flex-1"
                          >
                            Get Quote
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-semibold text-blue-600 mb-1">Custom Space Pricing:</p>
                          <p>{CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-lg mb-4 flex items-center">Order Summary</h4>
                        <div className="space-y-2">
                          {getSelectedRoomTypes().map((roomType) => {
                            const config = roomConfigs[roomType]
                            const count = roomCounts[roomType]
                            const roomTotal = (config?.totalPrice || 0) * count
                            const displayName = roomType.startsWith("other-custom-")
                              ? config?.roomName || "Custom Space"
                              : roomDisplayNames[roomType] || roomType

                            const isCustomOrInPerson =
                              roomType.startsWith("other-custom-") || config?.paymentType === "in_person"

                            const displayPrice = isCustomOrInPerson
                              ? "Email for Pricing"
                              : formatCurrency(config?.totalPrice || 0)
                            const displayRoomTotal = isCustomOrInPerson
                              ? "Email for Pricing"
                              : formatCurrency(roomTotal)

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
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="border-t bg-white dark:bg-gray-900 p-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 order-2 sm:order-1">
                    <span className="text-sm text-gray-500">Step {reviewStep + 1} of 2</span>
                    {getSelectedRoomTypes().length > 0 && (
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
                          disabled={!isOnline || isAddingToCart || getSelectedRoomTypes().length === 0}
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
                          disabled={getSelectedRoomTypes().length === 0}
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
    </TooltipProvider>
  )
}
