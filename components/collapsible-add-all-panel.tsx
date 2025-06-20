"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Package,
  Trash2,
  X,
  ChevronRight,
  ArrowLeft,
  Check,
  Maximize2,
  Minimize2,
  ArrowRight,
  Info,
  CheckCircle,
  ArrowUp,
  ListChecks,
  ListX,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useMomentumScroll } from "@/hooks/use-momentum-scroll"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { usePanelContext } from "@/contexts/panel-context"

export function CollapsibleAddAllPanel() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [reviewStep, setReviewStep] = useState(0) // 0: room list, 1: confirmation
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [addedItemsCount, setAddedItemsCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false) // Control panel visibility
  const [isScrollPaused, setIsScrollPaused] = useState(false) // New state for scroll pause
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  const { registerPanel, updatePanel, getDisplacement } = usePanelContext()
  const panelId = "add-all-panel"

  // Scroll enhancements states and refs
  const scrollViewportRef = useRef<HTMLDivElement>(null) // Ref for the ScrollArea's viewport
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isMomentumScrollEnabled, setIsMomentumScrollEnabled] = useState(true) // User customization option
  const { handleScroll: handleMomentumScroll } = useMomentumScroll() // Momentum scrolling hook

  // Infinite scrolling concept
  const lastItemRef = useRef<HTMLDivElement>(null)
  useIntersectionObserver(
    lastItemRef,
    ([entry]) => {
      if (entry.isIntersecting) {
        console.log("Last item in Add All panel is visible. Would load more items here if available.")
        // In a real app, you'd trigger a data fetch here
      }
    },
    { root: scrollViewportRef.current, threshold: 0.1 },
  )

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

  // Pause scroll tracking when panel is expanded or in fullscreen
  useEffect(() => {
    setIsScrollPaused(isExpanded || isFullscreen)
  }, [isExpanded, isFullscreen])

  useEffect(() => {
    if (isVisible) {
      registerPanel(panelId, 3) // Position 3 for add-all panel
    }
  }, [isVisible, registerPanel])

  useEffect(() => {
    updatePanel(panelId, isExpanded, isExpanded ? 384 : 48)
  }, [isExpanded, updatePanel])

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
      setIsExpanded(false)
      setIsFullscreen(false)
      controls.stop()
    }
  }, [selectionRequirementsMet, controls, vibrate])

  // Calculate panel position based on scroll and viewport (only after initial show)
  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current || isFullscreen || !isVisible || isScrollPaused) return

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
  }, [isFullscreen, isVisible, isScrollPaused])

  useEffect(() => {
    // Only set up scroll listeners after panel is visible and not paused
    if (!isVisible || isScrollPaused) return

    const handleScrollAndResize = () => {
      if (!isFullscreen) {
        calculatePanelPosition()
      }
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
  }, [calculatePanelPosition, isVisible, isScrollPaused])

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Click was on the button, don't close panel
    }
    if (!isFullscreen) {
      setIsExpanded(false)
    }
  })

  // Keyboard shortcuts for panel toggle and escape
  useKeyboardShortcuts({
    "alt+a": () => selectionRequirementsMet && setIsExpanded((prev) => !prev),
    Escape: () => {
      if (isFullscreen) {
        setIsFullscreen(false)
        setReviewStep(0)
      } else {
        setIsExpanded(false)
      }
    },
  })

  // Keyboard shortcuts for internal scroll
  useEffect(() => {
    const viewportElement = scrollViewportRef.current
    if (!viewportElement || !isExpanded) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target !== viewportElement && !viewportElement.contains(event.target as Node)) {
        return // Only handle if focus is within the scrollable area or on the viewport itself
      }

      const scrollAmount = 100 // Pixels to scroll per key press
      const { scrollTop, scrollHeight, clientHeight } = viewportElement

      switch (event.key) {
        case "PageDown":
          event.preventDefault()
          viewportElement.scrollTo({ top: scrollTop + clientHeight, behavior: "smooth" })
          break
        case "PageUp":
          event.preventDefault()
          viewportElement.scrollTo({ top: scrollTop - clientHeight, behavior: "smooth" })
          break
        case "Home":
          event.preventDefault()
          viewportElement.scrollTo({ top: 0, behavior: "smooth" })
          break
        case "End":
          event.preventDefault()
          viewportElement.scrollTo({ top: scrollHeight, behavior: "smooth" })
          break
        case "ArrowDown":
          event.preventDefault()
          viewportElement.scrollTo({ top: scrollTop + scrollAmount, behavior: "smooth" })
          break
        case "ArrowUp":
          event.preventDefault()
          viewportElement.scrollTo({ top: scrollTop - scrollAmount, behavior: "smooth" })
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded])

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
        setIsExpanded(false)
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

  const handleReviewClick = useCallback(() => {
    setIsFullscreen(true)
    vibrate(50)
  }, [vibrate])

  const handleBackToPanel = useCallback(() => {
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

  // Handle scroll for visual indicators and scroll-to-top button
  const handleScrollAreaScroll = useCallback(() => {
    const viewport = scrollViewportRef.current
    if (viewport) {
      const { scrollTop, scrollHeight, clientHeight } = viewport
      setShowScrollToTop(scrollTop > 200) // Show button after scrolling down 200px
      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    scrollViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

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
          className={cn(
            "flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600",
            isFullscreen && "hover:shadow-lg",
            "snap-start", // Scroll-snapping
          )}
          ref={index === selectedRoomTypes.length - 1 ? lastItemRef : null} // For infinite scroll concept
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md",
                isFullscreen && "w-20 h-20",
              )}
            >
              <Image
                src={roomImages[roomType] || "/placeholder.svg"}
                alt={roomDisplayNames[roomType] || roomType}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "font-bold text-base text-gray-900 dark:text-gray-100 truncate",
                  isFullscreen && "text-lg",
                )}
              >
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
              <div className={cn("font-bold text-lg text-blue-600 dark:text-blue-400", isFullscreen && "text-xl")}>
                {formatCurrency(roomTotal)}
              </div>
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
  }, [selectedRoomTypes, roomConfigs, roomCounts, handleRemoveRoom, isFullscreen])

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

  // Fullscreen review mode
  if (isFullscreen) {
    return (
      <>
        <SuccessNotification />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-[999] overflow-hidden flex flex-col"
          >
            {/* Fullscreen Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4 shadow-lg">
              <div className="container mx-auto flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToPanel}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToPanel}
                  className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                >
                  <Minimize2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Fullscreen Content */}
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto py-6 px-4">
                {reviewStep === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid gap-6 mb-8">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-800 dark:text-blue-300">Review Your Selections</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            Please review your selected rooms before adding them to your cart. You can adjust quantities
                            or remove items as needed.
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
            </div>

            {/* Fullscreen Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 shadow-lg">
              <div className="container mx-auto flex items-center justify-between">
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
                      <Button variant="outline" onClick={handleBackToPanel}>
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
        </AnimatePresence>
      </>
    )
  }

  const displacement = getDisplacement(panelId, 3)

  return (
    <TooltipProvider>
      <SuccessNotification />
      <motion.div
        ref={panelRef}
        className="fixed z-[997] transition-transform duration-300 ease-out"
        style={{
          top: panelTopPosition,
          right: "clamp(1rem, 3vw, 2rem)",
          width: "fit-content",
          transform: `translateX(-${displacement}px)`,
        }}
        initial={{ x: "150%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Trigger Button */}
        <motion.button
          ref={buttonRef}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            "rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "border border-blue-500/20 backdrop-blur-sm relative",
          )}
          aria-label="Toggle add to cart panel"
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
            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
          </div>
        </motion.button>

        {/* Expandable Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800",
                "relative flex flex-col", // Added flex flex-col
                showTopShadow && "before:shadow-top-gradient",
                showBottomShadow && "after:shadow-bottom-gradient",
              )}
              style={{ maxHeight: "70vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Ready to Add</h3>
                      <p className="text-blue-100 text-sm">
                        {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReviewClick}
                      className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                      title="Fullscreen view"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsExpanded(false)}
                      className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scroll Customization Option */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <Label htmlFor="momentum-scroll" className="text-sm font-medium">
                  Enable Momentum Scroll
                </Label>
                <Switch
                  id="momentum-scroll"
                  checked={isMomentumScrollEnabled}
                  onCheckedChange={setIsMomentumScrollEnabled}
                />
              </div>

              {/* Content */}
              <ScrollArea
                className="flex-1" // This will make it take up remaining space
                viewportClassName="scroll-smooth snap-y snap-mandatory" // Scroll-snapping
                onScroll={isMomentumScrollEnabled ? handleMomentumScroll : handleScrollAreaScroll} // Conditional momentum scroll
                ref={scrollViewportRef} // Attach ref to viewport
              >
                <div className="p-4">
                  <div className="space-y-3 mb-4">{roomList}</div>
                </div>
              </ScrollArea>

              {/* Scroll to Top Button */}
              <AnimatePresence>
                {showScrollToTop && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-24 right-4 z-10"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full shadow-md h-10 w-10"
                          onClick={scrollToTop}
                          aria-label="Scroll to top"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Scroll to Top</TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="space-y-3">
                  <Button
                    onClick={handleAddAllToCart} // Direct add to cart button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg"
                    disabled={!isOnline}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </span>
                  </Button>
                  <Button
                    onClick={handleReviewClick}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center">
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Review in Fullscreen
                    </span>
                  </Button>
                  <Button variant="outline" onClick={() => setIsExpanded(false)} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
