"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Plus, Minus, Trash2, X, ShoppingBag, ChevronRight, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area" // Modified to accept onScroll and viewportClassName
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // For scroll to top tooltip
import { Switch } from "@/components/ui/switch" // For scroll customization
import { Label } from "@/components/ui/label" // For scroll customization
import { useCart } from "@/lib/cart-context"
import { CheckoutButton } from "@/components/checkout-button"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { useMomentumScroll } from "@/hooks/use-momentum-scroll" // For momentum scrolling
import { useIntersectionObserver } from "@/hooks/use-intersection-observer" // For infinite scrolling concept

export function CollapsibleCartPanel() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false) // New state for scroll pause
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
        console.log("Last item in Cart panel is visible. Would load more items here if available.")
        // In a real app, you'd trigger a data fetch here
      }
    },
    { root: scrollViewportRef.current, threshold: 0.1 },
  )

  // State for dynamic positioning
  const [panelTopPosition, setPanelTopPosition] = useState<string>("auto")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Pause scroll tracking when panel is expanded
  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  // Calculate panel position based on scroll and viewport
  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current || isScrollPaused) return // Don't calculate when paused

    const panelHeight = panelRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    // Start position: 250px from top of viewport (below Add All panel)
    const initialViewportTopOffset = 250
    const bottomPadding = 20 // Distance from bottom of document

    // Calculate desired top position
    const desiredTopFromScroll = scrollY + initialViewportTopOffset
    const maxTopAtDocumentBottom = documentHeight - panelHeight - bottomPadding

    // Use the minimum to ensure it doesn't go past the document bottom
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [isScrollPaused])

  useEffect(() => {
    if (!isMounted || isScrollPaused) return // Don't track scroll when paused

    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    // Initial calculation
    const timeoutId = setTimeout(calculatePanelPosition, 0)

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
      clearTimeout(timeoutId)
    }
  }, [calculatePanelPosition, isMounted, isScrollPaused]) // Added isScrollPaused dependency

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Click was on the button, don't close panel
    }
    setIsExpanded(false)
  })

  // Keyboard shortcuts for panel toggle and escape
  useKeyboardShortcuts({
    "alt+c": () => setIsExpanded((prev) => !prev),
    Escape: () => setIsExpanded(false),
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

  const handleClearCart = useCallback(() => {
    clearCart()
  }, [clearCart])

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

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

  // Don't show if cart is empty
  if (cart.totalItems === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <motion.div
        ref={panelRef}
        className="fixed z-[996]"
        style={{
          top: panelTopPosition,
          right: "clamp(1rem, 3vw, 2rem)",
          width: "fit-content",
        }}
        initial={{ x: "150%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Trigger Button */}
        <motion.button
          ref={buttonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center p-3 bg-gradient-to-r from-green-600 to-green-700 text-white",
            "rounded-xl shadow-lg hover:from-green-700 hover:to-green-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50",
            "border border-green-500/20 backdrop-blur-sm relative",
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Toggle cart panel"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                  {cart.totalItems}
                </Badge>
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Cart</div>
              <div className="text-xs opacity-90">${cart.totalPrice.toFixed(2)}</div>
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
                "absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-green-200 dark:border-green-800",
                "relative", // Needed for shadow pseudo-elements
                showTopShadow && "before:shadow-top-gradient",
                showBottomShadow && "after:shadow-bottom-gradient",
              )}
              style={{ maxHeight: "70vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Shopping Cart</h3>
                      <p className="text-green-100 text-sm">
                        {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""} • ${cart.totalPrice.toFixed(2)}
                      </p>
                    </div>
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
                style={{ maxHeight: "400px" }}
                viewportClassName="scroll-smooth snap-y snap-mandatory" // Scroll-snapping
                onScroll={isMomentumScrollEnabled ? handleMomentumScroll : handleScrollAreaScroll} // Conditional momentum scroll
                ref={scrollViewportRef} // Attach ref to viewport
              >
                <div className="p-4">
                  {cart.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
                      <h3 className="mb-2 text-lg font-semibold text-muted-foreground">Your cart is empty</h3>
                      <p className="text-sm text-muted-foreground/80 mb-6">
                        Add some cleaning services to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.items.map((item, index) => (
                        <div
                          key={item.id}
                          className="group relative rounded-lg border border-border/50 p-4 transition-all hover:border-border hover:shadow-sm snap-start" // Scroll-snapping
                          ref={index === cart.items.length - 1 ? lastItemRef : null} // For infinite scroll concept
                        >
                          {item.image && (
                            <div className="mb-3">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm leading-tight text-foreground">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                {item.sourceSection && (
                                  <p className="text-xs text-muted-foreground/70 mt-1">{item.sourceSection}</p>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-8 w-8 p-0"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
              {cart.items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-base font-semibold">
                      <span>Total ({cart.totalItems} items):</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      <CheckoutButton />
                      <Button
                        variant="outline"
                        onClick={handleClearCart}
                        className="w-full"
                        disabled={cart.items.length === 0}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
