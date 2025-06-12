"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Sparkles, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { Cart } from "@/components/cart"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useVibration } from "@/hooks/use-vibration"
import { roomImages } from "@/lib/room-tiers"

interface IntelligentCartButtonProps {
  showLabel?: boolean
  variant?: "default" | "floating" | "compact" | "minimal"
  size?: "sm" | "md" | "lg"
  position?: "header" | "floating" | "inline"
  className?: string
}

type CartMode = "standard" | "multi-selection" | "hybrid"

export default function IntelligentCartButton({
  showLabel = false,
  variant = "default",
  size = "sm",
  position = "header",
  className,
}: IntelligentCartButtonProps) {
  const { cart, addItem } = useCart()
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { vibrate } = useVibration()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentMode, setCurrentMode] = useState<CartMode>("standard")

  // Multi-selection data
  const selectedRoomTypes = getSelectedRoomTypes()
  const multiSelectionTotal = getTotalPrice()
  const multiSelectionItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  // Determine current mode
  useEffect(() => {
    if (isMultiSelection && multiSelectionItems > 0) {
      if (cart?.totalItems > 0) {
        setCurrentMode("hybrid")
      } else {
        setCurrentMode("multi-selection")
      }
    } else {
      setCurrentMode("standard")
    }
  }, [isMultiSelection, multiSelectionItems, cart?.totalItems])

  // Memoized calculations for performance
  const cartMetrics = useMemo(
    () => ({
      totalItems: cart?.totalItems || 0,
      totalValue: cart?.total || 0,
      hasItems: (cart?.totalItems || 0) > 0,
      isHighValue: (cart?.total || 0) > 200,
      itemCount: cart?.items?.length || 0,
    }),
    [cart?.totalItems, cart?.total, cart?.items?.length],
  )

  // Handle different click actions based on mode
  const handlePrimaryAction = useCallback(() => {
    if (currentMode === "multi-selection") {
      handleAddAllToCart()
    } else {
      setIsCartOpen(true)
    }
  }, [currentMode])

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
            },
          })

          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100])
        toast({
          title: "🎉 All items added to cart!",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
        setIsExpanded(false)
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

  const handleSecondaryAction = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  // Dynamic styling based on mode and state
  const getButtonConfig = () => {
    switch (currentMode) {
      case "multi-selection":
        return {
          icon: Package,
          primaryText: `Add All (${multiSelectionItems})`,
          secondaryText: formatCurrency(multiSelectionTotal),
          bgGradient: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
          badgeCount: selectedRoomTypes.length,
          badgeColor: "bg-green-500",
        }
      case "hybrid":
        return {
          icon: isExpanded ? Package : ShoppingCart,
          primaryText: isExpanded ? `Add All (${multiSelectionItems})` : "Cart",
          secondaryText: isExpanded ? formatCurrency(multiSelectionTotal) : `${cartMetrics.totalItems} items`,
          bgGradient: isExpanded
            ? "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          badgeCount: isExpanded ? selectedRoomTypes.length : cartMetrics.totalItems,
          badgeColor: isExpanded ? "bg-green-500" : "bg-red-500",
        }
      default:
        return {
          icon: cartMetrics.hasItems ? (cartMetrics.isHighValue ? Sparkles : Package) : ShoppingCart,
          primaryText: "Cart",
          secondaryText: cartMetrics.hasItems ? `${cartMetrics.totalItems} items` : "Empty",
          bgGradient: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          badgeCount: cartMetrics.totalItems,
          badgeColor: cartMetrics.isHighValue ? "bg-purple-500" : "bg-red-500",
        }
    }
  }

  const buttonConfig = getButtonConfig()
  const IconComponent = buttonConfig.icon

  // Enhanced button variants
  const buttonVariants = {
    default: "relative flex items-center gap-2 transition-all duration-300 hover:scale-105",
    floating:
      "relative flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-2 hover:scale-110",
    compact: "relative flex items-center gap-1 transition-all duration-300",
    minimal: "relative flex items-center transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800",
  }

  const sizeVariants = {
    sm: variant === "floating" ? "h-12 px-4" : "h-8 px-3",
    md: variant === "floating" ? "h-14 px-6" : "h-10 px-4",
    lg: variant === "floating" ? "h-16 px-8" : "h-12 px-6",
  }

  return (
    <>
      <div className="relative">
        {/* Main Button */}
        <motion.div layout transition={{ type: "spring", damping: 25, stiffness: 300 }}>
          <Button
            variant={variant === "floating" ? "default" : "outline"}
            size={size}
            className={cn(
              buttonVariants[variant],
              sizeVariants[size],
              `bg-gradient-to-r ${buttonConfig.bgGradient}`,
              "text-white border-0",
              cartMetrics.hasItems && "ring-2 ring-blue-200 dark:ring-blue-800",
              currentMode === "multi-selection" && "ring-2 ring-green-200 dark:ring-green-800",
              position === "floating" && "fixed bottom-6 right-6 z-40",
              className,
            )}
            onClick={handlePrimaryAction}
            onMouseEnter={() => currentMode === "hybrid" && setIsExpanded(true)}
            onMouseLeave={() => currentMode === "hybrid" && setIsExpanded(false)}
            aria-label={`${buttonConfig.primaryText} - ${buttonConfig.secondaryText}`}
          >
            <motion.div layout className="flex items-center gap-2" transition={{ duration: 0.2 }}>
              <motion.div
                key={currentMode}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <IconComponent
                  className={cn(
                    "transition-all duration-200",
                    size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6",
                  )}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {showLabel && (
                  <motion.div
                    key={`${currentMode}-${isExpanded}`}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-start">
                      <span
                        className={cn(
                          "font-medium whitespace-nowrap",
                          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base",
                        )}
                      >
                        {buttonConfig.primaryText}
                      </span>
                      {buttonConfig.secondaryText && (
                        <span className="text-xs opacity-90 whitespace-nowrap">{buttonConfig.secondaryText}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {buttonConfig.badgeCount > 0 && (
                <motion.div
                  key={`badge-${currentMode}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                >
                  <Badge
                    className={cn(
                      "ml-1 px-1.5 py-0 text-xs font-bold text-white border-2 border-white",
                      buttonConfig.badgeColor,
                    )}
                  >
                    {buttonConfig.badgeCount > 99 ? "99+" : buttonConfig.badgeCount}
                  </Badge>
                </motion.div>
              )}

              {/* Hybrid mode indicator */}
              {currentMode === "hybrid" && (
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowRight className="h-3 w-3 opacity-70" />
                </motion.div>
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Hybrid Mode Secondary Action */}
        <AnimatePresence>
          {currentMode === "hybrid" && isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 z-50"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleSecondaryAction}
                className="bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-200 dark:border-blue-800"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart ({cartMetrics.totalItems})
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Panel */}
      {cart && (
        <Cart
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          width={cartMetrics.itemCount > 5 ? "lg" : "md"}
          preserveScrollPosition={true}
          scrollKey={`cart-${cartMetrics.itemCount}`}
        />
      )}
    </>
  )
}
