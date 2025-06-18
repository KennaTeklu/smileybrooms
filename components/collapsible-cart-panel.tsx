"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ShoppingCart, X, Trash2, ArrowUp, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useMomentumScroll } from "@/hooks/use-momentum-scroll"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { usePanelManager } from "@/lib/panel-manager-context"
import { panelDimensions } from "@/lib/constants" // Import panelDimensions
import { useRouter } from "next/navigation"

export function CollapsibleCartPanel() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()
  const { registerPanel, unregisterPanel, setActivePanel, activePanel } = usePanelManager()
  const router = useRouter()

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

  // Determine if it's a mobile device for responsive panel behavior
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768) // Tailwind's 'md' breakpoint
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Panel positioning based on device and other panels
  const getPanelPositionStyle = useCallback(() => {
    const baseOffset = 100 // Base distance from the top of the viewport for settings/share
    const panelSpacing = 200 // Spacing between right-side panels (Share, AddAll, Cart)
    const currentScrollY = window.scrollY

    if (isMobile) {
      return {
        width: panelDimensions.mobile.width,
        height: panelDimensions.mobile.height,
        bottom: isExpanded ? "0" : `calc(-${panelDimensions.mobile.height} + 50px)`, // Show only a sliver when collapsed
        left: "0",
        right: "0",
        top: "auto",
      }
    } else {
      const initialViewportTopOffset = baseOffset + panelSpacing * 2 // Adjusted initial top offset for Cart Panel
      const panelHeight = panelRef.current?.offsetHeight || 200
      const documentHeight = document.documentElement.scrollHeight
      const bottomPadding = 20

      const desiredTopFromScroll = currentScrollY + initialViewportTopOffset
      const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPadding, currentScrollY + 50)
      const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

      return {
        width: panelDimensions.desktop.width,
        height: panelDimensions.desktop.height,
        top: `${finalTop}px`,
        right: "clamp(1rem,3vw,2rem)",
        bottom: "auto",
        left: "auto",
      }
    }
  }, [isMobile, isExpanded])

  // Animation variants for desktop (slide from right) and mobile (slide from bottom)
  const panelVariants = {
    hidden: (isMobile: boolean) => ({
      x: isMobile ? 0 : "110%",
      y: isMobile ? "110%" : 0,
      opacity: isMobile ? 1 : 0, // Keep opacity for mobile to allow bottom-up slide
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300, duration: 0.5, ease: panelDimensions.transition },
    },
    collapsed: (isMobile: boolean) => ({
      x: isMobile ? 0 : "110%",
      y: isMobile ? `calc(100% - 50px)` : 0, // Show only a sliver on mobile
      opacity: isMobile ? 1 : 0,
      transition: { type: "spring", damping: 25, stiffness: 300, duration: 0.5, ease: panelDimensions.transition },
    }),
  }

  useEffect(() => {
    setIsMounted(true)
    registerPanel("cart", { isFullscreen: isMobile, zIndex: 999 }) // Cart panel highest z-index
    return () => unregisterPanel("cart")
  }, [registerPanel, unregisterPanel, isMobile])

  useEffect(() => {
    if (isExpanded) {
      setActivePanel("cart")
      document.body.classList.add("panel-locked") // Lock body scroll
    } else if (activePanel === "cart") {
      setActivePanel(null)
      document.body.classList.remove("panel-locked") // Unlock body scroll
    }
  }, [isExpanded, setActivePanel, activePanel])

  useEffect(() => {
    if (activePanel && activePanel !== "cart" && isExpanded) {
      setIsExpanded(false)
    }
  }, [activePanel, isExpanded])

  useEffect(() => {
    setIsVisible(cart.totalItems > 0)
    if (cart.totalItems === 0) {
      setIsExpanded(false) // Collapse cart if empty
    }
  }, [cart.totalItems])

  // Handle mobile keyboard viewport squashing
  useEffect(() => {
    if (!isMobile || !panelRef.current || !isExpanded) return

    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        panelRef.current!.style.height = `${window.visualViewport.height}px`
      }
    }

    window.visualViewport?.addEventListener("resize", handleVisualViewportResize)
    return () => {
      window.visualViewport?.removeEventListener("resize", handleVisualViewportResize)
      panelRef.current!.style.height = panelDimensions.mobile.height // Reset height on unmount/collapse
    }
  }, [isMobile, isExpanded])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsExpanded(false)
  })

  useKeyboardShortcuts({
    "alt+c": () => setIsExpanded((prev) => !prev),
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

    // Focus trapping
    const focusableElements = panelRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab" && focusableElements.length > 0) {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    if (isExpanded) {
      document.addEventListener("keydown", handleTab)
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0]
        setTimeout(() => firstElement.focus(), 0)
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keydown", handleTab)
      document.body.style.overflow = ""
      document.body.classList.remove("panel-locked")
    }
  }, [isExpanded])

  const handleProceedToCheckout = useCallback(() => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "You are offline. Please connect to the internet to proceed to checkout.",
        variant: "destructive",
      })
      vibrate(200)
      return
    }
    setIsExpanded(false)
    router.push("/checkout")
    vibrate(50)
  }, [isOnline, router, vibrate])

  const handleClearCart = useCallback(() => {
    clearCart()
    vibrate(100)
  }, [clearCart, vibrate])

  const handleTriggerPanel = useCallback(() => {
    setIsExpanded((prev) => !prev) // Toggle expand state
    vibrate(50)
  }, [vibrate])

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

  const cartItemsList = useMemo(() => {
    if (cart.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="text-sm">Add some services to get started!</p>
        </div>
      )
    }

    return cart.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600",
          "snap-start",
        )}
        ref={index === cart.items.length - 1 ? lastItemRef : null}
      >
        <div className={cn("relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md")}>
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-bold text-base text-gray-900 dark:text-gray-100 truncate")}>{item.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{formatCurrency(item.price)} each</p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </Button>
            <Badge variant="secondary" className="text-xs font-bold">
              {item.quantity}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </Button>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={cn("font-extrabold text-lg text-emerald-600 dark:text-emerald-400")}>
            {formatCurrency(item.price * item.quantity)}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove from cart</TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    ))
  }, [cart.items, removeItem, updateQuantity])

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={panelRef}
            className={cn(
              "fixed z-[999] flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800",
              "relative", // For shadow gradients
              showTopShadow && "before:shadow-top-gradient",
              showBottomShadow && "after:shadow-bottom-gradient",
              isMobile ? "max-sm:rounded-t-xl max-sm:rounded-b-none" : "", // Rounded top for mobile
            )}
            style={{
              ...getPanelPositionStyle(),
              willChange: "transform, opacity", // Performance optimization
              backfaceVisibility: "hidden",
              perspective: "1000px",
            }}
            initial={isMobile ? "collapsed" : "hidden"}
            animate={isExpanded ? "visible" : "collapsed"}
            variants={panelVariants}
            custom={isMobile}
            role="region"
            aria-labelledby="cart-panel-title"
            aria-describedby="cart-panel-desc"
          >
            {/* Trigger Button (for mobile, it's part of the panel itself) */}
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTriggerPanel}
              className={cn(
                "flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white",
                "rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800",
                "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50",
                "border border-emerald-500/20 backdrop-blur-sm relative",
                "sm:p-4 sm:rounded-xl",
                "max-sm:fixed max-sm:bottom-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[calc(100%-2rem)] max-sm:rounded-t-xl max-sm:rounded-b-none max-sm:z-[998] max-sm:py-4", // Mobile specific positioning
                isExpanded ? "max-sm:hidden" : "max-sm:flex", // Hide button when panel is fully open on mobile
              )}
              aria-label="Toggle shopping cart panel"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                      {cart.totalItems > 99 ? "99+" : cart.totalItems}
                    </Badge>
                  )}
                </div>
                <div className="text-left max-sm:hidden">
                  <div className="text-sm font-bold">Your Cart</div>
                  <div className="text-xs opacity-90">{formatCurrency(cart.totalPrice)}</div>
                </div>
                <ChevronLeft
                  className={cn("h-4 w-4 transition-transform duration-200 max-sm:hidden", isExpanded && "rotate-90")}
                />
              </div>
            </motion.button>

            {/* Panel Content (only visible when expanded) */}
            {isExpanded && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white p-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 id="cart-panel-title" className="text-lg font-bold">
                        Your Cart
                      </h3>
                      <p id="cart-panel-desc" className="text-emerald-100 text-sm">
                        {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""} • {formatCurrency(cart.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                    aria-label="Close shopping cart panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Scroll Customization Option */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
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
                  className="flex-1 min-h-0"
                  viewportClassName="scroll-smooth snap-y snap-mandatory"
                  onScroll={isMomentumScrollEnabled ? handleMomentumScroll : handleScrollAreaScroll}
                  ref={scrollViewportRef}
                  style={{ contentVisibility: "auto", containIntrinsicSize: "500px" }} // Performance optimization
                >
                  <div className="p-4">
                    <div className="space-y-3 mb-4">{cartItemsList}</div>
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
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 sticky bottom-0">
                  <div className="flex justify-between text-lg font-extrabold mb-3">
                    <span className="text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(cart.totalPrice)}</span>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleProceedToCheckout}
                      disabled={!isOnline || cart.totalItems === 0}
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative flex items-center justify-center">Proceed to Checkout</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="w-full"
                      disabled={cart.totalItems === 0}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}
