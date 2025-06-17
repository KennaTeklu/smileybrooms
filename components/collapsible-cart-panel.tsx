"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  ShoppingCart,
  X,
  ChevronRight,
  CheckCircle,
  Trash2,
  ArrowUp,
  ListChecks,
  ListX,
  Lightbulb,
  Plus,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useMomentumScroll } from "@/hooks/use-momentum-scroll"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { usePanelManager } from "@/lib/panel-manager-context"

export function CollapsibleCartPanel() {
  const { cart, removeItem, updateQuantity } = useCart()
  const cartItems = cart.items
  const totalPrice = cart.totalPrice
  const totalItems = cart.totalItems

  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [removedItemName, setRemovedItemName] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()
  const { registerPanel, unregisterPanel, setActivePanel, activePanel } = usePanelManager()

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
        console.log("Last item in Cart panel is visible. Would load more items here if available.")
      }
    },
    { root: scrollViewportRef.current, threshold: 0.1 },
  )

  // State for dynamic positioning - starts below the Add All panel
  const [panelTopPosition, setPanelTopPosition] = useState<string>("350px") // Adjusted initial position

  const cartHasItems = cartItems.length > 0

  useEffect(() => {
    setIsMounted(true)
    registerPanel("cartPanel", { isFullscreen: false, zIndex: 997 })
    return () => unregisterPanel("cartPanel")
  }, [registerPanel, unregisterPanel])

  useEffect(() => {
    if (isExpanded) {
      setActivePanel("cartPanel")
    } else if (activePanel === "cartPanel") {
      setActivePanel(null)
    }
  }, [isExpanded, setActivePanel, activePanel])

  useEffect(() => {
    if (activePanel && activePanel !== "cartPanel" && isExpanded) {
      setIsExpanded(false)
    }
  }, [activePanel, isExpanded])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  useEffect(() => {
    if (cartHasItems) {
      setIsVisible(true)

      const calculateInitialPosition = () => {
        const scrollY = window.scrollY
        const initialTop = scrollY + 350 // Adjusted initial top offset
        setPanelTopPosition(`${initialTop}px`)
      }

      calculateInitialPosition()

      controls.start({
        scale: [1, 1.08, 1],
        boxShadow: [
          "0 4px 20px rgba(59, 130, 246, 0.3)",
          "0 12px 50px rgba(59, 130, 246, 0.8)",
          "0 4px 20px rgba(59, 130, 246, 0.3)",
        ],
        transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
      })

      vibrate(150)
    } else {
      setIsVisible(false)
      setIsExpanded(false)
      controls.stop()
    }
  }, [cartHasItems, controls, vibrate])

  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current || !isVisible || isScrollPaused) return

    const panelHeight = panelRef.current.offsetHeight || 200
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    const initialViewportTopOffset = 350 // Adjusted initial top offset
    const bottomPadding = 20

    const desiredTopFromScroll = scrollY + initialViewportTopOffset
    const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPadding, scrollY + 50)

    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [isVisible, isScrollPaused])

  useEffect(() => {
    if (!isVisible || isScrollPaused) return

    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    calculatePanelPosition()

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
    }
  }, [calculatePanelPosition, isVisible, isScrollPaused])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsExpanded(false)
  })

  useKeyboardShortcuts({
    "alt+c": () => cartHasItems && setIsExpanded((prev) => !prev),
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
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded])

  const handleRemoveItem = useCallback(
    (itemId: string, itemName: string) => {
      removeItem(itemId)
      setRemovedItemName(itemName)
      setShowSuccessNotification(true)
      vibrate(100)

      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)
    },
    [removeItem, vibrate],
  )

  const handleUpdateQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        handleRemoveItem(itemId, cartItems.find((item) => item.id === itemId)?.name || "Item")
      } else {
        updateQuantity(itemId, newQuantity)
        vibrate(50)
      }
    },
    [updateQuantity, handleRemoveItem, cartItems, vibrate],
  )

  const handleScrollAreaScroll = useCallback(() => {
    const viewport = scrollViewportRef.current
    if (viewport) {
      const { scrollTop, scrollHeight, clientHeight } = viewport
      setShowScrollToTop(scrollTop > 200)
      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    scrollViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const cartList = useMemo(() => {
    if (cartItems.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="font-medium">Your cart is empty.</p>
          <p className="text-sm">Add some cleaning services to get started!</p>
        </div>
      )
    }

    return cartItems.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600",
          "snap-start",
        )}
        ref={index === cartItems.length - 1 ? lastItemRef : null}
      >
        <div className="flex items-center gap-3">
          <div className={cn("relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md")}>
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={cn("font-bold text-base text-gray-900 dark:text-gray-100 truncate")}>{item.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {item.metadata?.roomConfig?.selectedTier || "One-time service"}
            </p>
            {item.metadata?.roomCounts && Object.keys(item.metadata.roomCounts).length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Rooms:{" "}
                {Object.entries(item.metadata.roomCounts)
                  .filter(([, count]) => count > 0)
                  .map(([room, count]) => `${count}x ${room}`)
                  .join(", ")}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Qty: {item.quantity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(item.price)}
              </Badge>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className={cn("font-bold text-lg text-emerald-600 dark:text-emerald-400")}>
              {formatCurrency(item.price * item.quantity)}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove from cart</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="h-8 w-8 p-0"
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
              View Service Details
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              {item.metadata?.detailedTasks && item.metadata.detailedTasks.length > 0 && (
                <div>
                  <h5 className="flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                    <ListChecks className="h-4 w-4" /> Included Tasks:
                  </h5>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                    {item.metadata.detailedTasks.map((task: string, i: number) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.metadata?.notIncludedTasks && item.metadata.notIncludedTasks.length > 0 && (
                <div>
                  <h5 className="flex items-center gap-1 text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                    <ListX className="h-4 w-4" /> Not Included:
                  </h5>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                    {item.metadata.notIncludedTasks.map((task: string, i: number) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.metadata?.upsellMessage && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">{item.metadata.upsellMessage}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    ))
  }, [cartItems, handleRemoveItem, handleUpdateQuantity])

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
              <div className="font-bold text-sm">Item Removed!</div>
              <div className="text-xs opacity-90">{removedItemName} has been removed from your cart.</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!isVisible || !cartHasItems) {
    return <SuccessNotification />
  }

  return (
    <TooltipProvider>
      <SuccessNotification />
      <motion.div
        ref={panelRef}
        className="fixed right-[clamp(1rem,3vw,2rem)] z-[997]"
        style={{ top: panelTopPosition }} // Use dynamic top position
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
            "flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white", // Changed to emerald gradient
            "rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800", // Changed to emerald gradient
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50", // Changed to emerald ring
            "border border-emerald-500/20 backdrop-blur-sm relative", // Changed to emerald border
          )}
          aria-label="Toggle cart panel"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                {totalItems}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Cart</div>
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
                "absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800", // Changed to emerald border
                "relative flex flex-col",
                showTopShadow && "before:shadow-top-gradient",
                showBottomShadow && "after:shadow-bottom-gradient",
              )}
              style={{ maxHeight: "70vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Your Cart</h3>
                    <p className="text-emerald-100 text-sm">
                      {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
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

              {/* Scroll Customization Option */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <Label htmlFor="momentum-scroll-cart" className="text-sm font-medium">
                  Enable Momentum Scroll
                </Label>
                <Switch
                  id="momentum-scroll-cart"
                  checked={isMomentumScrollEnabled}
                  onCheckedChange={setIsMomentumScrollEnabled}
                />
              </div>

              {/* Content */}
              <ScrollArea
                className="flex-1"
                viewportClassName="scroll-smooth snap-y snap-mandatory"
                onScroll={isMomentumScrollEnabled ? handleMomentumScroll : handleScrollAreaScroll}
                ref={scrollViewportRef}
              >
                <div className="p-4">
                  <div className="space-y-3 mb-4">{cartList}</div>
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
                  <Link href="/checkout" className="w-full">
                    <Button
                      disabled={!isOnline || cartItems.length === 0}
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg" // Changed to emerald gradient
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </span>
                    </Button>
                  </Link>
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
