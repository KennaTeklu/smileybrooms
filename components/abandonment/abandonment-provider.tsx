"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { DiscountRescueModal } from "./discount-rescue-modal"
import { ChatIntervention } from "./chat-intervention"
import { useCart } from "@/lib/cart-context"
import { trackAbandonmentEvent } from "@/lib/abandonment/rescue-funnel"
import { useAbandonmentRescue } from "@/lib/abandonment/use-abandonment-rescue" // Declare the variable before using it

interface AbandonmentContextType {
  applyDiscount: (email?: string) => void
  currentDiscount: number
  continueBooking: () => void
  triggerExitIntent: () => void
  triggerInactivity: () => void
  triggerCartAbandonment: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

interface AbandonmentProviderProps {
  children: React.ReactNode
  exitIntentDelay?: number // Delay in ms before exit intent modal can show
  inactivityDelay?: number // Delay in ms before inactivity modal can show
  cartAbandonmentDelay?: number // Delay in ms before cart abandonment logic triggers
}

export function AbandonmentProvider({
  children,
  exitIntentDelay = 1000,
  inactivityDelay = 60000, // 1 minute
  cartAbandonmentDelay = 300000, // 5 minutes
}: AbandonmentProviderProps) {
  const { toast } = useToast()
  const pathname = usePathname()
  const { cartItems } = useCart()
  const {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount,
    sendSmsReminder,
  } = useAbandonmentRescue({
    exitIntentEnabled: true,
    inactivityTimeoutMs: 60000, // 1 minute for demo purposes
    discountSteps: [10, 15, 20],
  })

  const [capturedEmail, setCapturedEmail] = useState<string | undefined>()
  const router = window.location // Use window.location instead of useRouter

  const exitIntentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cartAbandonmentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())

  // --- Exit Intent Logic ---
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.clientY < 10 && !showDiscountModal && !showChatPrompt) {
        // Only trigger if mouse moves to top of viewport
        if (exitIntentTimerRef.current) {
          clearTimeout(exitIntentTimerRef.current)
        }
        exitIntentTimerRef.current = setTimeout(() => {
          setShowDiscountModal(true)
          trackAbandonmentEvent("exit_intent_triggered", { pathname })
        }, exitIntentDelay)
      } else if (e.clientY > 20) {
        // Reset timer if mouse moves back into content area
        if (exitIntentTimerRef.current) {
          clearTimeout(exitIntentTimerRef.current)
          exitIntentTimerRef.current = null
        }
      }
    },
    [exitIntentDelay, showDiscountModal, showChatPrompt, pathname],
  )

  // --- Inactivity Logic ---
  const resetInactivityTimer = useCallback(() => {
    lastActivityTimeRef.current = Date.now()
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (!showDiscountModal && !showChatPrompt) {
        setShowChatPrompt(true)
        trackAbandonmentEvent("inactivity_triggered", { pathname })
      }
    }, inactivityDelay)
  }, [inactivityDelay, showDiscountModal, showChatPrompt, pathname])

  // --- Cart Abandonment Logic ---
  const triggerCartAbandonment = useCallback(() => {
    if (cartItems.length > 0 && !showDiscountModal && !showChatPrompt) {
      // In a real app, this would likely trigger an email or push notification
      // For demo, we'll just show a toast or log
      toast({
        title: "Don't forget your items!",
        description: "Your cart is waiting. Complete your purchase now!",
        duration: 5000,
      })
      trackAbandonmentEvent("cart_abandonment_triggered", {
        pathname,
        cartItems: cartItems.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
      })
    }
  }, [cartItems, showDiscountModal, showChatPrompt, toast, pathname])

  useEffect(() => {
    // Add event listeners for exit intent and inactivity
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("keypress", resetInactivityTimer)
    document.addEventListener("click", resetInactivityTimer)
    document.addEventListener("scroll", resetInactivityTimer)

    resetInactivityTimer() // Initialize inactivity timer

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keypress", resetInactivityTimer)
      document.removeEventListener("click", resetInactivityTimer)
      document.removeEventListener("scroll", resetInactivityTimer)
      if (exitIntentTimerRef.current) clearTimeout(exitIntentTimerRef.current)
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      if (cartAbandonmentTimerRef.current) clearTimeout(cartAbandonmentTimerRef.current)
    }
  }, [handleMouseMove, resetInactivityTimer])

  // Effect for cart abandonment timer
  useEffect(() => {
    if (cartItems.length > 0) {
      if (cartAbandonmentTimerRef.current) {
        clearTimeout(cartAbandonmentTimerRef.current)
      }
      cartAbandonmentTimerRef.current = setTimeout(() => {
        triggerCartAbandonment()
      }, cartAbandonmentDelay)
    } else {
      if (cartAbandonmentTimerRef.current) {
        clearTimeout(cartAbandonmentTimerRef.current)
        cartAbandonmentTimerRef.current = null
      }
    }
    return () => {
      if (cartAbandonmentTimerRef.current) clearTimeout(cartAbandonmentTimerRef.current)
    }
  }, [cartItems, cartAbandonmentDelay, triggerCartAbandonment])

  const applyDiscount = (email?: string) => {
    if (email) {
      setCapturedEmail(email)
      // In a real app, you would store this email for marketing
    }

    // Apply discount to localStorage or context
    localStorage.setItem("appliedDiscount", currentDiscount.toString())
  }

  const continueBooking = () => {
    setShowChatPrompt(false)
    router.href = "/cart" // Use window.location.href instead of router.push
  }

  const handleEmailCapture = (email: string) => {
    setCapturedEmail(email)
    applyDiscount(email)
  }

  const contextValue = useMemo(
    () => ({
      applyDiscount,
      currentDiscount,
      continueBooking,
      triggerExitIntent: () => setShowDiscountModal(true),
      triggerInactivity: () => setShowChatPrompt(true),
      triggerCartAbandonment,
    }),
    [currentDiscount, triggerCartAbandonment], // Remove applyDiscount and continueBooking from dependencies
  )

  return (
    <AbandonmentContext.Provider value={contextValue}>
      {children}
      <DiscountRescueModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        discountPercentage={currentDiscount}
        onEmailCapture={handleEmailCapture}
      />
      <ChatIntervention
        isOpen={showChatPrompt}
        onClose={() => setShowChatPrompt(false)}
        onContinueBooking={continueBooking}
      />
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
