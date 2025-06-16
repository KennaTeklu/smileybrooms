"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Trash2,
  X,
  ArrowLeft,
  Check,
  ArrowRight,
  Info,
  CheckCircle,
  ListChecks,
  ListX,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function CollapsibleAddAllPanel() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [reviewStep, setReviewStep] = useState(0) // 0: room list, 1: confirmation
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [addedItemsCount, setAddedItemsCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false) // Control panel visibility
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  // State for dynamic positioning - start with fixed position, then adjust
  const [panelTopPosition, setPanelTopPosition] = useState<string>("150px")

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  // Check if selection requirements are met (2 or more rooms selected)
  const selectionRequirementsMet = selectedRoomTypes.length >= 2

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Immediate visibility control - show panel as soon as requirements are met
  useEffect(() => {
    if (selectionRequirementsMet) {
      setIsVisible(true)

      // Force immediate positioning calculation
      const calculateInitialPosition = () => {
        const viewportHeight = window.innerHeight
        const scrollY = window.scrollY

        // Always start at 150px from current viewport top
        const initialTop = scrollY + 150
        setPanelTopPosition(`${initialTop}px`)
      }

      // Calculate position immediately
      calculateInitialPosition()

      // Enhanced pulse animation for visibility when first appearing
      controls.start({
        scale: [1, 1.08, 1],
        boxShadow: [
          "0 4px 20px rgba(59, 130, 246, 0.3)",
          "0 12px 50px rgba(59, 130, 246, 0.8)",
          "0 4px 20px rgba(59, 130, 246, 0.3)",
        ],
        transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
      })

      // Haptic feedback when panel first appears
      vibrate(150)
    } else {
      setIsVisible(false)
      setIsFullscreen(false)
      controls.stop()
    }
  }, [selectionRequirementsMet, controls, vibrate])

  // Calculate panel position based on scroll and viewport (only when not in fullscreen)
  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current || isFullscreen || !isVisible) return

    const panelHeight = panelRef.current.offsetHeight || 200 // fallback height
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    // Start position: 150px from top of viewport (below share panel)
    const initialViewportTopOffset = 150
    const bottomPadding = 20 // Distance from bottom of document

    // Calculate desired top position
    const desiredTopFromScroll = scrollY + initialViewportTopOffset
    const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPadding, scrollY + 50)

    // Use the minimum to ensure it doesn't go past the document bottom
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [isFullscreen, isVisible])

  useEffect(() => {
    // Only set up scroll listeners when visible and not in fullscreen
    if (!isVisible || isFullscreen) return

    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    // Add listeners immediately
    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    // Initial calculation after listeners are set
    calculatePanelPosition()

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
    }
  }, [calculatePanelPosition, isVisible, isFullscreen])

  // Keyboard shortcuts for panel toggle and escape
  useKeyboardShortcuts({
    "alt+a": () => selectionRequirementsMet && setIsFullscreen((prev) => !prev),
    Escape: () => {
      if (isFullscreen) {
        setIsFullscreen(false)
        setReviewStep(0)
      }
    },
  })

  const handleAddAllToCart = useCallback(() => {
    try {
      let addedCount = 0

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
              detailedTasks: config.detailedTasks, // Pass detailed tasks
              notIncludedTasks: config.notIncludedTasks, // Pass not included tasks
              upsellMessage: config.upsellMessage, // Pass upsell message
            },
          })

          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100]) // Success pattern

        // Set success notification state
        setAddedItemsCount(addedCount)
        setShowSuccessNotification(true)

        // Close panels
        setIsFullscreen(false)
        setReviewStep(0)

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowSuccessNotification(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      vibrate(300) // Error pattern
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding all items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [selectedRoomTypes, roomCounts, roomConfigs, addItem, updateRoomCount, vibrate])

  const handleRemoveRoom = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, 0)
      vibrate(50) // Light feedback
    },
    [updateRoomCount, vibrate],
  )

  const handleOpenFullscreen = useCallback(() => {
    setIsFullscreen(true)
    setReviewStep(0)
    vibrate(50)
  }, [vibrate])

  const handleBackToButton = useCallback(() => {
    setIsFullscreen(false)
    setReviewStep(0)
    vibrate(50)
  }, [vibrate])

  const handleNextStep = useCallback(() => {
    setReviewStep(1)
    vibrate(50)
  }, [vibrate])

  const handlePrevStep = useCallback(() => {
    setReviewStep(0)
    vibrate(50)
  }, [vibrate])

  // Memoized room list with enhanced styling
  const roomList = useMemo(() => {
    return selectedRoomTypes.map((roomType, index) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      return (
        <motion.div
          key={roomType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <Image
                src={roomImages[roomType] || "/placeholder.svg"}
                alt={roomDisplayNames[roomType] || roomType}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                {roomDisplayNames[roomType] || roomType}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {config?.selectedTier || "Essential Clean"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  Qty: {count}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatCurrency(config?.totalPrice || 0)}
                </Badge>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400">{formatCurrency(roomTotal)}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRoom(roomType)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove from selection</TooltipContent>
              </Tooltip>
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
  }, [selectedRoomTypes, roomConfigs, roomCounts, handleRemoveRoom])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

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

  // Don't show if not visible or selection requirements are not met
  if (!isVisible || !selectionRequirementsMet) {
    return <SuccessNotification />
  }

  // Fullscreen review mode - Now with content-based sizing
  if (isFullscreen) {
    return (
      <>
        <SuccessNotification />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToButton}
                      className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-bold">Review Your Selections</h2>
                      <p className="text-blue-100 text-sm">
                        {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToButton}
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content - Scrollable with content-based height */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {reviewStep === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <div className="space-y-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-blue-800 dark:text-blue-300">Review Your Selections</h3>
                              <p className="text-sm text-blue-700 dark:text-blue-400">
                                Please review your selected rooms before adding them to your cart. You can adjust
                                quantities or remove items as needed.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">{roomList}</div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-2xl mx-auto"
                      >
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full mb-4">
                            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                            Ready to Add to Cart
                          </h3>
                          <p className="text-green-700 dark:text-green-400 mb-4">
                            You're about to add {selectedRoomTypes.length} room type
                            {selectedRoomTypes.length !== 1 ? "s" : ""} to your cart for a total of{" "}
                            {formatCurrency(totalPrice)}.
                          </p>
                          <div className="text-sm text-green-600 dark:text-green-500">
                            Click "Add All to Cart" below to continue.
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                          <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Order Summary</h4>
                          <div className="space-y-2 mb-4">
                            {selectedRoomTypes.map((roomType) => {
                              const config = roomConfigs[roomType]
                              const count = roomCounts[roomType]
                              const roomTotal = (config?.totalPrice || 0) * count

                              return (
                                <div key={roomType} className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {roomDisplayNames[roomType] || roomType} (x{count})
                                  </span>
                                  <span className="font-medium">{formatCurrency(roomTotal)}</span>
                                </div>
                              )
                            })}
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {reviewStep === 0 ? "Step 1 of 2: Review Items" : "Step 2 of 2: Confirm"}
                  </div>
                  <div className="flex gap-3">
                    {reviewStep === 1 ? (
                      <>
                        <Button variant="outline" onClick={handlePrevStep}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={handleAddAllToCart}
                          disabled={!isOnline}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add All to Cart
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleBackToButton}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </>
    )
  }

  // Floating trigger button (only shows when not in fullscreen)
  return (
    <TooltipProvider>
      <SuccessNotification />
      <motion.div
        ref={panelRef}
        className="fixed z-[997]"
        style={{
          top: panelTopPosition,
          right: "clamp(1rem, 3vw, 2rem)",
          width: "fit-content",
        }}
        initial={{ x: "150%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Trigger Button - Goes directly to fullscreen */}
        <motion.button
          ref={buttonRef}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenFullscreen}
          className={cn(
            "flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            "rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "border border-blue-500/20 backdrop-blur-sm relative",
          )}
          aria-label="Open add to cart panel"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Plus className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                {selectedRoomTypes.length}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Add to Cart</div>
              <div className="text-xs opacity-90">{formatCurrency(totalPrice)}</div>
            </div>
          </div>
        </motion.button>
      </motion.div>
    </TooltipProvider>
  )
}
