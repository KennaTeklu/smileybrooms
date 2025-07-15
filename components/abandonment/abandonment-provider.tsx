"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import DiscountRescueModal from "./discount-rescue-modal"
import ChatIntervention from "./chat-intervention"

interface AbandonmentContextType {
  isAbandonmentTriggered: boolean
  triggerAbandonment: () => void
  resetAbandonment: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

interface AbandonmentProviderProps {
  children: React.ReactNode
  thresholdSeconds?: number // Time in seconds before triggering abandonment
  enableDiscountRescue?: boolean
  enableChatIntervention?: boolean
  abandonmentPaths?: string[] // Paths where abandonment tracking is active
}

export function AbandonmentProvider({
  children,
  thresholdSeconds = 30,
  enableDiscountRescue = true,
  enableChatIntervention = true,
  abandonmentPaths = ["/checkout", "/pricing", "/cart"], // Default paths
}: AbandonmentProviderProps) {
  const [isAbandonmentTriggered, setIsAbandonmentTriggered] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showChatIntervention, setShowChatIntervention] = useState(false)
  const { toast } = useToast()
  const pathname = usePathname()
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isTrackingActiveRef = useRef(false) // To prevent multiple timers

  const triggerAbandonment = useCallback(() => {
    if (!isAbandonmentTriggered) {
      setIsAbandonmentTriggered(true)
      if (enableDiscountRescue) {
        setShowDiscountModal(true)
      } else if (enableChatIntervention) {
        setShowChatIntervention(true)
      } else {
        toast({
          title: "We noticed you're leaving!",
          description: "Is there anything we can help you with?",
          variant: "default",
        })
      }
    }
  }, [isAbandonmentTriggered, enableDiscountRescue, enableChatIntervention, toast])

  const resetAbandonment = useCallback(() => {
    setIsAbandonmentTriggered(false)
    setShowDiscountModal(false)
    setShowChatIntervention(false)
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    isTrackingActiveRef.current = false
  }, [])

  const startInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      triggerAbandonment()
    }, thresholdSeconds * 1000)
  }, [thresholdSeconds, triggerAbandonment])

  const handleActivity = useCallback(() => {
    if (isTrackingActiveRef.current) {
      startInactivityTimer()
    }
  }, [startInactivityTimer])

  useEffect(() => {
    const isActivePath = abandonmentPaths.some((path) => pathname.startsWith(path))

    if (isActivePath) {
      isTrackingActiveRef.current = true
      startInactivityTimer()

      // Add event listeners for user activity
      window.addEventListener("mousemove", handleActivity)
      window.addEventListener("keydown", handleActivity)
      window.addEventListener("scroll", handleActivity)
      window.addEventListener("click", handleActivity)
    } else {
      resetAbandonment() // Reset if user navigates away from abandonment paths
    }

    return () => {
      // Cleanup event listeners and timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
      isTrackingActiveRef.current = false
    }
  }, [pathname, abandonmentPaths, startInactivityTimer, handleActivity, resetAbandonment])

  // Detect mouse leaving viewport (exit intent)
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY < 10 && isTrackingActiveRef.current && !isAbandonmentTriggered) {
        // Mouse is near the top of the viewport, likely exiting
        triggerAbandonment()
      }
    }

    window.addEventListener("mouseout", handleMouseLeave)

    return () => {
      window.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [isAbandonmentTriggered, triggerAbandonment])

  return (
    <AbandonmentContext.Provider value={{ isAbandonmentTriggered, triggerAbandonment, resetAbandonment }}>
      {children}
      {showDiscountModal && (
        <DiscountRescueModal
          onClose={() => setShowDiscountModal(false)}
          onAccept={() => {
            toast({ title: "Discount Applied!", description: "Your discount has been added to your cart." })
            setShowDiscountModal(false)
            resetAbandonment()
          }}
        />
      )}
      {showChatIntervention && (
        <ChatIntervention
          onClose={() => setShowChatIntervention(false)}
          onStartChat={() => {
            toast({ title: "Chat Started!", description: "Connecting you with a support agent." })
            setShowChatIntervention(false)
            resetAbandonment()
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
