"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  ShoppingCart,
  X,
  ArrowLeft,
  Check,
  Minimize2,
  ArrowRight,
  Info,
  CheckCircle,
  ListChecks,
  ListX,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { formatCurrency } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { CartItemDisplay } from "@/components/cart/cart-item-display" // Import the new component
import { usePanelControl } from "@/contexts/panel-control-context" // Import usePanelControl
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CheckoutButton } from "@/components/checkout-button"

export function CollapsibleCartPanel() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const cartItems = cart.items
  const totalPrice = cart.totalPrice
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [reviewStep, setReviewStep] = useState(0) // 0: cart list, 1: confirmation
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [removedItemName, setRemovedItemName] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isMomentumScrollEnabled, setIsMomentumScrollEnabled] = useState(true)

  const lastItemRef = useRef<HTMLDivElement>(null)

  const [panelTopPosition, setPanelTopPosition] = useState<string>("150px")

  const cartHasItems = cartItems.length > 0

  const { registerPanel, unregisterPanel } = usePanelControl() // Use the panel control hook

  // Register panel setters with the context
  useEffect(() => {
    const unregisterExpanded = registerPanel(setIsExpanded)
    const unregisterFullscreen = registerPanel(setIsFullscreen)
    return () => {
      unregisterExpanded()
      unregisterFullscreen()
    }
  }, [registerPanel])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsScrollPaused(isExpanded || isFullscreen)
  }, [isExpanded, isFullscreen])

  useEffect(() => {
    if (cartHasItems) {
      setIsVisible(true)

      const calculateInitialPosition = () => {
        const scrollY = window.scrollY
        const initialTop = scrollY + 150
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
      setIsFullscreen(false)
      controls.stop()
    }
  }, [cartHasItems, controls, vibrate])

  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current || isFullscreen || !isVisible || isScrollPaused) return

    const panelHeight = panelRef.current.offsetHeight || 200
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    const initialViewportTopOffset = 150
    const bottomPadding = 20

    const desiredTopFromScroll = scrollY + initialViewportTopOffset
    const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPadding, scrollY + 50)

    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [isFullscreen, isVisible, isScrollPaused])

  useEffect(() => {
    if (!isVisible || isScrollPaused) return

    const handleScrollAndResize = () => {
      if (!isFullscreen) {
        calculatePanelPosition()
      }
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
    if (!isFullscreen) {
      setIsExpanded(false)
    }
  })

  useKeyboardShortcuts({
    "alt+c": () => cartHasItems && setIsExpanded((prev) => !prev),
    Escape: () => {
      if (isFullscreen) {
        setIsFullscreen(false)
        setReviewStep(0)
      } else {
        setIsExpanded(false)
      }
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

  const handleClearCart = () => {
    clearCart()
    setIsOpen(false)
  }

  // Group cart items by sourceSection or roomType for better navigability
  const groupedCartItems = useMemo(() => {
    const groups: { [key: string]: typeof cartItems } = {}
    cartItems.forEach((item) => {
      const groupKey = item.sourceSection || item.metadata?.roomType || "Other Services"
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
    })
    return Object.entries(groups).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  }, [cartItems])

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

    return (
      <Accordion type="multiple" defaultValue={groupedCartItems.map(([key]) => key)} className="w-full">
        {groupedCartItems.map(([groupName, items]) => (
          <AccordionItem key={groupName} value={groupName} className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:no-underline py-3">
              {groupName} ({items.length})
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              {items.map((item, index) => (
                <CartItemDisplay
                  key={item.id}
                  item={item}
                  isFullscreen={isFullscreen}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }, [cartItems, groupedCartItems, handleRemoveItem, handleUpdateQuantity, isFullscreen])

  const [isOpen, setIsOpen] = useState(false)

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
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToPanel}
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-bold">Review Your Cart</h2>
                    <p className="text-blue-100 text-sm">
                      {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
                    </p>
                  </div>
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
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
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
                          <h3 className="font-medium text-blue-800 dark:text-blue-300">Review Your Cart</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            Please review your cart items before proceeding to checkout. You can adjust quantities or
                            remove items as needed.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">{cartList}</div>
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
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Ready to Checkout</h3>
                      <p className="text-green-700 dark:text-green-400 mb-4">
                        You're about to checkout with {cartItems.length} item
                        {cartItems.length !== 1 ? "s" : ""} for a total of {formatCurrency(totalPrice)}.
                      </p>
                      <div className="text-sm text-green-600 dark:text-green-500">
                        Click "Proceed to Checkout" below to continue.
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                      <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Order Summary</h4>
                      <div className="space-y-2 mb-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex flex-col gap-2 p-3 border-b last:border-b-0">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {item.name} (x{item.quantity})
                              </span>
                              <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <p>Tier: {item.metadata?.roomConfig?.name || "N/A"}</p>
                              {item.metadata?.roomConfig?.timeEstimate && (
                                <p>Est. Time: {item.metadata.roomConfig.timeEstimate}</p>
                              )}
                            </div>
                            {item.metadata?.detailedTasks && item.metadata.detailedTasks.length > 0 && (
                              <div className="mt-2">
                                <h5 className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                                  <ListChecks className="h-3 w-3" /> Included:
                                </h5>
                                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                  {item.metadata.detailedTasks.map((task: string, i: number) => (
                                    <li key={i}>{task.replace(/ $$.*?$$/, "")}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {item.metadata?.notIncludedTasks && item.metadata.notIncludedTasks.length > 0 && (
                              <div className="mt-2">
                                <h5 className="flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                                  <ListX className="h-3 w-3" /> Not Included:
                                </h5>
                                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                  {item.metadata.notIncludedTasks.map((task: string, i: number) => (
                                    <li key={i}>{task}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {item.metadata?.upsellMessage && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-2 rounded-md flex items-start gap-1 mt-2">
                                <Lightbulb className="h-3 w-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                  {item.metadata.upsellMessage}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
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
                      <Link href="/checkout">
                        <Button
                          disabled={!isOnline || cartItems.length === 0}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Proceed to Checkout
                        </Button>
                      </Link>
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

  return (
    <TooltipProvider>
      <SuccessNotification />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg bg-transparent"
          onClick={() => setIsOpen(true)}
          aria-label={`Open cart with ${totalItems} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader className="flex flex-row items-center justify-between pr-6">
            <SheetTitle className="text-2xl font-bold">Your Cart ({totalItems})</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close cart">
              <X className="h-6 w-6" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p className="text-lg">Your cart is empty.</p>
                <p className="text-sm">Start adding services to get a quote!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemDisplay key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatCurrency(cart.summary.subTotal)}</span>
              </div>
              {cart.summary.discounts > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discounts:</span>
                  <span>-{formatCurrency(cart.summary.discounts)}</span>
                </div>
              )}
              {cart.summary.shipping > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping:</span>
                  <span>{formatCurrency(cart.summary.shipping)}</span>
                </div>
              )}
              {cart.summary.taxes > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes:</span>
                  <span>{formatCurrency(cart.summary.taxes)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <CheckoutButton />
                <Button variant="outline" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
