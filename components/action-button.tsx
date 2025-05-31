"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ActionButtonProps {
  label: string
  price: number
  visible: boolean
  onClick: () => void
  icon?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary"
}

export function ActionButton({
  label,
  price,
  visible,
  onClick,
  icon = <ShoppingCart className="h-5 w-5" />,
  isLoading = false,
  disabled = false,
  variant = "primary",
}: ActionButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle click with debounce to prevent multiple clicks
  const handleClick = async () => {
    if (isProcessing || isLoading || disabled) return

    setIsProcessing(true)
    try {
      await onClick()
    } catch (error) {
      console.error("Error in action button click:", error)
    } finally {
      // Add slight delay to prevent accidental double-clicks
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  // Reset processing state when visibility changes
  useEffect(() => {
    if (!visible) {
      setIsProcessing(false)
    }
  }, [visible])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 transition-all duration-300 ease-in-out",
        "opacity-0 pointer-events-none",
        visible && "opacity-100 pointer-events-auto",
        // Account for iOS safe area
        "pb-[calc(1rem+env(safe-area-inset-bottom,0))]",
      )}
      style={{
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4">
            <Button
              onClick={handleClick}
              disabled={disabled || isLoading || isProcessing}
              className={cn(
                "w-full h-14 text-base font-semibold flex items-center justify-between transition-all",
                "shadow-md hover:shadow-lg active:shadow-sm",
                variant === "primary"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-800 hover:bg-gray-900 text-white",
              )}
            >
              <span className="flex items-center">
                {isLoading || isProcessing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <span className="mr-2">{icon}</span>
                )}
                {label}
              </span>
              <span className="font-bold">{formatCurrency(price)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
