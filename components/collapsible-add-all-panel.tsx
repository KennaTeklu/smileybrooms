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
import { usePanelManager } from "@/lib/panel-manager-context"
import { useMediaQuery } from "@/hooks/use-media-query" // Import useMediaQuery

export function CollapsibleAddAllPanel() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [addedItemsCount, setAddedItemsCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null) // State for removal confirmation
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()
  const { registerPanel, unregisterPanel, setActivePanel, activePanel } = usePanelManager()
  const isMobile = useMediaQuery("(max-width: 640px)") // Define mobile breakpoint

  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isMomentumScrollEnabled, setIsMomentumScrollEnabled] = useState(true)
  const { handleScroll: handleMomentumScroll } = useMomentumScroll()

  const lastItemRef = useRef<HTMLDivElement>(null)
  useIntersectionObserver(
    lastItemRef,
    ([entry]) => {
      if (entry.isIntersecting) {
        console.log("Last item in Add All panel is visible. Would load more items here if available.")
      }
    },
    { root: scrollViewportRef.current, threshold: 0.1 },
  )

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  const selectionRequirementsMet = selectedRoomTypes.length >= 2

  useEffect(() => {
    setIsMounted(true)
    registerPanel("addAllToCart", { isFullscreen: isMobile, zIndex: 997 }) // Fullscreen on mobile
    return () => unregisterPanel("addAllToCart")
  }, [registerPanel, unregisterPanel, isMobile])

  useEffect(() => {
    if (isExpanded) {
      setActivePanel("addAllToCart")
      // Trap focus when panel opens
      if (panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusableElements.length > 0) {
          ;(focusableElements[0] as HTMLElement).focus()
        }
      }
    } else if (activePanel === "addAllToCart") {
      setActivePanel(null)
    }
  }, [isExpanded, setActivePanel, activePanel])

  useEffect(() => {
    if (activePanel && activePanel !== "addAllToCart" && isExpanded) {
      setIsExpanded(false)
    }
  }, [activePanel, isExpanded])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  useEffect(() => {
    if (selectionRequirementsMet) {
      setIsVisible(true)

      controls.start({
        scale: [1, 1.08, 1],
        boxShadow: [
          "0 4px 20px rgba(16, 185, 129, 0.3)", // Emerald shadow
          "0 12px 50px rgba(16, 185, 129, 0.8)", // Emerald shadow
          "0 4px 20px rgba(16, 185, 129, 0.3)", // Emerald shadow
        ],
        transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
      })

      vibrate(150)
    } else {
      setIsVisible(false)
      setIsExpanded(false)
      controls.stop()
    }
  }, [selectionRequirementsMet, controls, vibrate])

  // Focus trapping for accessibility
  useEffect(() => {
    if (!isExpanded || !panelRef.current) return

    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [isExpanded])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsExpanded(false)
  })

  useKeyboardShortcuts({
    "alt+a": () => selectionRequirementsMet && setIsExpanded((prev) => !prev),
    Escape: () => {
      setIsExpanded(false)
    },
  })

  useEffect(() => {
    const viewportElement = scrollViewportRef.current
    if (!viewportElement || !isExpanded) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target !== viewportElement && !viewportElement.contains(event.target as Node)) {
        return
      }

      const scrollAmount = 100
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      document.body.classList.remove("panel-locked")
    }
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
              detailedTasks: config.detailedTasks,
              notIncludedTasks: config.notIncludedTasks,
              upsellMessage: config.upsellMessage,
            },
          })

          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100])

        setAddedItemsCount(addedCount)
        setShowSuccessNotification(true)

        setIsExpanded(false)

        setTimeout(() => {
          setShowSuccessNotification(false)
        }, 3000)
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
    }
  }, [selectedRoomTypes, roomCounts, roomConfigs, addItem, updateRoomCount, vibrate])

  const handleRemoveRoom = useCallback((roomType: string) => {
    setConfirmRemoveId(roomType) // Show confirmation for this item
  }, [])

  const confirmRemove = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, 0)
      vibrate(50)
      setConfirmRemoveId(null) // Hide confirmation
      toast({
        title: "Room Removed",
        description: `${roomDisplayNames[roomType] || roomType} has been removed from your selection.`,
        duration: 2000,
      })
    },
    [updateRoomCount, vibrate, toast],
  )

  const cancelRemove = useCallback(() => {
    setConfirmRemoveId(null) // Hide confirmation
  }, [])

  const handleTriggerPanel = useCallback(() => {
    setIsExpanded(true)
    vibrate(50)
  }, [vibrate])

  const handleScrollAreaScroll = useCallback(() => {
    const viewport = scrollViewportRef.current
    if (viewport) {
      const { scrollTop, scrollHeight, clientHeight } = viewport
      setShowScrollToTop(scrollTop > 200)
      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 1) // -1 to account for sub-pixel rendering
    }
  }, [])

  const scrollToTop = useCallback(() => {
    scrollViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const roomList = useMemo(() => {
    return selectedRoomTypes.map((roomType, index) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      const isConfirming = confirmRemoveId === roomType

      return (
        <motion.div
          key={roomType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600",
            "snap-start",
          )}
          ref={index === selectedRoomTypes.length - 1 ? lastItemRef : null}
        >
          <div className="flex items-center gap-3">
            <div className={cn("relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md")}>
              <Image
                src={roomImages[roomType] || "/placeholder.svg"}
                alt={roomDisplayNames[roomType] || roomType}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={cn("font-extrabold text-base text-gray-900 dark:text-gray-100 truncate")}>
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
              <div className={cn("font-extrabold text-lg text-emerald-600 dark:text-emerald-400")}>
                {formatCurrency(roomTotal)}
              </div>
              {isConfirming ? (
                <div className="flex gap-2 mt-2 justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmRemove(roomType)}
                    className="h-8 px-3 text-xs"
                  >
                    Confirm
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelRemove} className="h-8 px-3 text-xs">
                    Cancel
                  </Button>
                </div>
              ) : (
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
              )}
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
  }, [selectedRoomTypes, roomConfigs, roomCounts, confirmRemoveId, handleRemoveRoom, confirmRemove, cancelRemove])

  if (!isMounted) {
    return null
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

  if (!isVisible || !selectionRequirementsMet) {
    return <SuccessNotification />
  }

  return (
    <TooltipProvider>
      <SuccessNotification />
      <motion.div
        ref={panelRef}
        role="region"
        aria-labelledby="add-all-panel-title"
        aria-describedby="add-all-panel-desc"
        className={cn(
          "fixed z-[997] transition-all duration-320 ease-[cubic-bezier(0.32,0.72,0,1)]", // Apply cubic-bezier
          isMobile
            ? "bottom-0 left-0 w-full h-[85vh] rounded-t-2xl" // Mobile: bottom sheet
            : "top-0 right-0 h-full max-w-[480px] w-[33vw] rounded-l-2xl", // Desktop: right panel
          isExpanded
            ? isMobile
              ? "translate-y-0"
              : "translate-x-0"
            : isMobile
              ? "translate-y-full"
              : "translate-x-full",
        )}
        initial={isMobile ? { y: "100%" } : { x: "100%" }}
        animate={isExpanded ? (isMobile ? { y: "0%" } : { x: "0%" }) : isMobile ? { y: "100%" } : { x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }} // Keep spring for smooth feel
      >
        {/* Trigger Button - positioned outside the panel for fixed behavior */}
        <motion.button
          ref={buttonRef}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTriggerPanel}
          className={cn(
            "fixed z-[998] flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white",
            "rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50",
            "border border-emerald-500/20 backdrop-blur-sm relative",
            "sm:p-4 sm:rounded-xl",
            "max-sm:p-2 max-sm:rounded-lg max-sm:w-10 max-sm:h-10 max-sm:overflow-hidden", // Smaller for small screens, icon only
            "right-[clamp(1rem,3vw,2rem)]", // Consistent right position
            "top-[200px]", // Fixed top position for this panel
          )}
          aria-label="Toggle add to cart panel"
          data-testid="add-all-panel-trigger"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Plus className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                {selectedRoomTypes.length}
              </Badge>
            </div>
            <div className="text-left max-sm:hidden">
              <div className="text-sm font-bold">Add to Cart</div>
              <div className="text-xs opacity-90">{formatCurrency(totalPrice)}</div>
            </div>
            <ChevronRight
              className={cn("h-4 w-4 transition-transform duration-200 max-sm:hidden", isExpanded && "rotate-90")}
            />
          </div>
        </motion.button>

        {/* Expandable Panel Content */}
        <div
          className={cn(
            "w-full h-full bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800",
            "relative flex flex-col",
            showTopShadow && "before:shadow-top-gradient",
            showBottomShadow && "after:shadow-bottom-gradient",
            isMobile ? "rounded-t-2xl" : "rounded-l-2xl",
          )}
          data-testid="add-all-panel-content"
        >
          <h2 id="add-all-panel-title" className="sr-only">
            Selected Cleaning Services to Add
          </h2>
          <p id="add-all-panel-desc" className="sr-only">
            Review and manage the rooms you've selected before adding them all to your cart.
          </p>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ready to Add</h3>
                <p className="text-emerald-100 text-sm">
                  {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scroll Customization Option */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
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
            className="flex-1 will-change-transform" // Apply will-change
            viewportClassName="scroll-smooth snap-y snap-mandatory"
            onScroll={isMomentumScrollEnabled ? handleMomentumScroll : handleScrollAreaScroll}
            ref={scrollViewportRef}
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

          {/* Footer - Sticky Action Bar */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 sticky bottom-0 z-20">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg font-extrabold text-gray-900 dark:text-gray-100 py-2">
                <span>Total Selected:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPrice)}</span>
              </div>
              <Button
                onClick={handleAddAllToCart}
                disabled={!isOnline}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg"
                data-testid="add-all-to-cart-button"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </span>
              </Button>
              <Button variant="outline" onClick={() => setIsExpanded(false)} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
