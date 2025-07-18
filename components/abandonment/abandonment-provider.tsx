"use client"

import { useRouter } from "next/navigation"

import { createContext, useContext, useState, type ReactNode, useEffect, useRef, useCallback } from "react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { DiscountRescueModal } from "@/components/abandonment/discount-rescue-modal"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"

interface AbandonmentContextType {
  applyDiscount: (email?: string) => void
  currentDiscount: number
  continueBooking: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const { cart } = useCart()
  const { toast } = useToast()
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showChatIntervention, setShowChatIntervention] = useState(false)
  const abandonmentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastCartTotalRef = useRef(cart.totalPrice)
  const [capturedEmail, setCapturedEmail] = useState<string | undefined>()
  const router = useRouter()

  const ABANDONMENT_THRESHOLD_SECONDS =
    Number.parseInt(process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS || "30") || 30

  const startAbandonmentTimer = useCallback(() => {
    if (abandonmentTimerRef.current) {
      clearTimeout(abandonmentTimerRef.current)
    }
    abandonmentTimerRef.current = setTimeout(() => {
      if (cart.items.length > 0 && cart.totalPrice > 0) {
        // Trigger abandonment rescue
        console.log("Cart abandonment detected!")
        // Decide which rescue mechanism to show
        if (Math.random() > 0.5) {
          setShowDiscountModal(true)
        } else {
          setShowChatIntervention(true)
        }
      }
    }, ABANDONMENT_THRESHOLD_SECONDS * 1000)
  }, [cart.items.length, cart.totalPrice, ABANDONMENT_THRESHOLD_SECONDS])

  const resetAbandonmentTimer = useCallback(() => {
    if (abandonmentTimerRef.current) {
      clearTimeout(abandonmentTimerRef.current)
      abandonmentTimerRef.current = null
    }
  }, [])

  // Effect to start/reset timer based on user activity and cart state
  useEffect(() => {
    const handleUserActivity = () => {
      if (cart.items.length > 0 && cart.totalPrice > 0) {
        resetAbandonmentTimer()
        startAbandonmentTimer()
      }
    }

    // Start timer initially if cart has items
    if (cart.items.length > 0 && cart.totalPrice > 0) {
      startAbandonmentTimer()
    } else {
      resetAbandonmentTimer()
    }

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity)
    window.addEventListener("keydown", handleUserActivity)
    window.addEventListener("scroll", handleUserActivity)
    window.addEventListener("click", handleUserActivity)

    return () => {
      resetAbandonmentTimer()
      window.removeEventListener("mousemove", handleUserActivity)
      window.removeEventListener("keydown", handleUserActivity)
      window.removeEventListener("scroll", handleUserActivity)
      window.removeEventListener("click", handleUserActivity)
    }
  }, [cart.items.length, cart.totalPrice, startAbandonmentTimer, resetAbandonmentTimer])

  // Effect to monitor cart changes and reset timer if cart is modified significantly
  useEffect(() => {
    if (cart.totalPrice !== lastCartTotalRef.current) {
      console.log("Cart total changed, resetting abandonment timer.")
      resetAbandonmentTimer()
      if (cart.items.length > 0 && cart.totalPrice > 0) {
        startAbandonmentTimer()
      }
      lastCartTotalRef.current = cart.totalPrice
    }
  }, [cart.totalPrice, cart.items.length, resetAbandonmentTimer, startAbandonmentTimer])

  const applyDiscount = (email?: string) => {
    if (email) {
      setCapturedEmail(email)
      // In a real app, you would store this email for marketing
    }

    // Apply discount to localStorage or context
    localStorage.setItem("appliedDiscount", "10") // Example discount value
  }

  const continueBooking = () => {
    setShowChatIntervention(false)
    router.push("/cart")
  }

  const handleEmailCapture = (email: string) => {
    setCapturedEmail(email)
    applyDiscount(email)
  }

  return (
    <AbandonmentContext.Provider
      value={{
        applyDiscount,
        currentDiscount: 10, // Example discount value
        continueBooking,
      }}
    >
      {children}

      {showDiscountModal && (
        <DiscountRescueModal
          isOpen={showDiscountModal}
          onClose={() => setShowDiscountModal(false)}
          onApplyDiscount={() => {
            toast({
              title: "Discount Applied!",
              description: "A special discount has been added to your cart.",
              variant: "success",
            })
            setShowDiscountModal(false)
            resetAbandonmentTimer()
          }}
        />
      )}

      {showChatIntervention && (
        <ChatIntervention
          isOpen={showChatIntervention}
          onClose={() => setShowChatIntervention(false)}
          onStartChat={() => {
            toast({
              title: "Starting Chat...",
              description: "Connecting you with a support agent.",
              variant: "default",
            })
            setShowChatIntervention(false)
            resetAbandonmentTimer()
          }}
        />
      )}
    </AbandonmentContext.Provider>
  )
}

export function useAbandonment() {
  const context = useContext(AbandonmentContext)
  if (context === undefined) {
    throw new Error("useAbandonment must be used within an AbandonmentProvider")
  }
  return context
}
