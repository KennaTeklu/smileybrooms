"use client"

import { useEffect } from "react"
import { useState, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ListChecks, ListX, Lightbulb, Minus, PlusIcon, Settings } from "lucide-react"
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
import { roomImages, roomDisplayNames, defaultTiers, getRoomTiers, roomTiers } from "@/lib/room-tiers"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ROOM_CONFIG } from "@/lib/constants"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { MultiStepCustomizationWizard } from "@/components/multi-step-customization-wizard"
import {
  activeWizard,
  setActiveWizard,
  roomIcons,
  safeGetRoomConfig,
  handleRoomConfigChange,
  getBgColor,
  getIconBgColor,
  getIconTextColor,
  initialRenderComplete,
  addingRoomId,
} from "@/lib/wizard-context"

interface CollapsibleAddAllPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CollapsibleAddAllPanel({ isOpen, onOpenChange }: CollapsibleAddAllPanelProps) {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes } =
    useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [reviewStep, setReviewStep] = useState(0)
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

      if (currentTierId !== finalTierId || currentPrice !== finalPrice) {
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
      }
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
  }, [isOpen, selectedGlobalTierName, updateRoomCount, applyGlobalTierToRoom, roomCounts, roomConfigs])

  const selectedRoomTypes = getSelectedRoomTypes()
  const baseTotalPrice = getTotalPrice()

  const displayTotalPrice = useMemo(() => {
    let price = baseTotalPrice
    const frequencyMultiplier = ROOM_CONFIG.frequencyMultipliers[selectedFrequency] || 1.0

    price *= frequencyMultiplier

    if (selectedFrequency !== "one_time" && isFullHouseChecked) {
      price *= 0.95
    }
    return price
  }, [baseTotalPrice, selectedFrequency, isFullHouseChecked])

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

      for (const roomType of selectedRoomTypes) {
        // Use for...of for async/await
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          const basePricePerUnit = config.totalPrice || 0
          const adjustedPricePerUnit = basePricePerUnit * frequencyMultiplier

          for (let i = 0; i < count; i++) {
            await addItem({
              // Await addItem
              id: `custom-cleaning-${roomType}-${Date.now()}-${i}`,
              name: `${config.roomName || roomDisplayNames[roomType] || roomType} Cleaning Instance #${i + 1}`,
              price: adjustedPricePerUnit,
              priceId: "price_custom_cleaning",
              quantity: 1,
              image: roomType.startsWith("other-custom-")
                ? roomImages.other
                : roomImages[roomType] || "/placeholder.svg",
              metadata: {
                roomType,
                roomConfig: { ...config, quantity: 1 },
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

          updateRoomCount(roomType, 0)
          addedCount++
        }
      }

      setIsAddingToCart(false)

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
      if (isAddingToCart) {
        setIsAddingToCart(false)
      }
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
    isAddingToCart,
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
      selectedRoomTypes.forEach((roomType) => {
        applyGlobalTierToRoom(roomType, newTierName, roomConfigs)
      })
      vibrate(50)
    },
    [selectedRoomTypes, applyGlobalTierToRoom, vibrate, roomConfigs],
  )

  const handleAddCustomRoom = useCallback(async () => {
    // Made async
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

    // Update room context first for immediate UI feedback
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

    // Now add to cart via the async addItem
    for (let i = 0; i < newCustomRoomQuantity; i++) {
      await addItem({
        id: `${customRoomId}-${Date.now()}-${i}`, // Ensure unique ID for each instance
        name: `${newCustomRoomName.trim()} Cleaning Instance #${i + 1}`,
        price: 0, // Price is TBD for custom rooms
        priceId: "price_custom_cleaning_tbd",
        quantity: 1,
        image: roomImages.other,
        metadata: {
          roomType: customRoomId,
          roomConfig: {
            roomName: newCustomRoomName.trim(),
            selectedTier: `custom-${selectedGlobalTierName.toLowerCase().replace(/\s/g, "-")}`,
            totalPrice: 0,
            isPriceTBD: true,
            selectedAddOns: [],
            selectedReductions: [],
            detailedTasks: selectedGlobalTierDetails?.detailedTasks || [],
            notIncludedTasks: selectedGlobalTierDetails?.notIncludedTasks || [],
            upsellMessage: selectedGlobalTierDetails?.upsellMessage || "",
            quantity: 1, // Store config for a single unit
          },
          isRecurring: false,
          frequency: "one_time",
        },
        paymentType: "in_person",
      })
    }

    setNewCustomRoomName("")
    setNewCustomRoomQuantity(1)

    toast({
      title: "Custom Room Added",
      description: `${newCustomRoomName} (x${newCustomRoomQuantity}) added to your selection.`,
      variant: "success",
      duration: 3000,
    })
    vibrate(50)
  }, [
    newCustomRoomName,
    newCustomRoomQuantity,
    selectedGlobalTierName,
    updateRoomCount,
    updateRoomConfig,
    vibrate,
    addItem,
  ])

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
          layout // Enable layout animations
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }} // Animate out to the left
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <Image src={imageSrc || "/placeholder.svg"} alt={displayName} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{displayName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {defaultTiers.default.find((t) => t.id === config?.selectedTier)?.name || "Custom Tier"}
              </p>
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Minus className="h-3 w-3" />
                  </motion.div>
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </motion.div>
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
  }, [selectedRoomTypes, roomConfigs, roomCounts, handleRemoveRoom, handleIncrementRoom, handleDecrementRoom])

  const rooms = Object.keys(roomDisplayNames)

  const handleCloseWizard = useCallback(() => {
    setActiveWizard(null)
    vibrate(50)
  }, [vibrate])

  return (
    <>
      <TooltipProvider>
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
        <Card className="shadow-sm">
          <CardHeader className={getBgColor()}>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full ${getIconBgColor()} ${getIconTextColor()}`}
              ></span>
              Cleaning Selection
            </CardTitle>
            <CardDescription>Select the rooms you want to clean.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className={`grid grid-cols-2 md:grid-cols-3 ${
                rooms.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              } gap-4`}
            >
              <AnimatePresence>
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
                    <motion.div
                      key={roomType}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`border ${
                          count > 0 ? getActiveBorderColor() : "border-gray-200 dark:border-gray-700"
                        } cursor-pointer overflow-hidden hover:shadow-md transition-shadow`}
                        onClick={() => {
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

                          <AnimatePresence mode="wait">
                            {count === 0 || !initialRenderComplete ? (
                              <motion.div
                                key="add-button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                              >
                                <Button
                                  id={`add-initial-${roomType}`}
                                  variant="default"
                                  size="sm"
                                  className="w-full"
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    handleCustomize()
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
                              </motion.div>
                            ) : (
                              <motion.div
                                key="controls"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-2 mt-3 w-full"
                              >
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
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </>
  )
}
