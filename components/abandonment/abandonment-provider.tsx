"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useAnalytics } from "@/hooks/use-analytics"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useBatteryStatus } from "@/hooks/use-battery-status"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"

interface AbandonmentContextType {
  isAbandoning: boolean
  lastActivity: number
  engagementScore: number
  triggerRescue: (type: "chat" | "discount") => void
  recordActivity: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

interface AbandonmentProviderProps {
  children: ReactNode
}

const ABANDONMENT_THRESHOLD_SECONDS = Number(process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS) || 30 // Default to 30 seconds
const ENABLE_ABANDONMENT_RESCUE = process.env.NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE === "true"

export function AbandonmentProvider({ children }: AbandonmentProviderProps) {
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [isAbandoning, setIsAbandoning] = useState(false)
  const [engagementScore, setEngagementScore] = useState(100) // 0-100, 100 is high engagement
  const [activeRescueType, setActiveRescueType] = useState<"chat" | "discount" | null>(null)
  const [hasTriggeredRescue, setHasTriggeredRescue] = useLocalStorage("hasTriggeredAbandonmentRescue", false)

  const pathname = usePathname()
  const { trackEvent } = useAnalytics()
  const { isOnline } = useNetworkStatus()
  const { batteryLevel, isCharging } = useBatteryStatus()
  const { toast } = useToast()

  const activityDebounced = useDebounce(lastActivity, 1000) // Debounce activity updates

  const recordActivity = useCallback(() => {
    setLastActivity(Date.now())
    if (isAbandoning) {
      setIsAbandoning(false)
      setActiveRescueType(null)
      trackEvent("Abandonment_Rescue_Cancelled", {
        reason: "User activity resumed",
      })
    }
  }, [isAbandoning, trackEvent])

  const triggerRescue = useCallback(
    (type: "chat" | "discount") => {
      if (!ENABLE_ABANDONMENT_RESCUE || hasTriggeredRescue) return

      setActiveRescueType(type)
      setIsAbandoning(true)
      setHasTriggeredRescue(true) // Mark that a rescue has been triggered
      trackEvent("Abandonment_Rescue_Triggered", { type })
    },
    [hasTriggeredRescue, setHasTriggeredRescue, trackEvent],
  )

  // Effect to listen for user activity
  useEffect(() => {
    if (!ENABLE_ABANDONMENT_RESCUE) return

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"]
    events.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }))

    return () => {
      events.forEach((event) => window.removeEventListener(event, recordActivity as EventListener))
    }
  }, [recordActivity])

  // Effect to detect abandonment
  useEffect(() => {
    if (!ENABLE_ABANDONMENT_RESCUE) return

    const interval = setInterval(() => {
      const idleTime = (Date.now() - lastActivity) / 1000
      if (idleTime >= ABANDONMENT_THRESHOLD_SECONDS && !isAbandoning) {
        // Calculate engagement score based on various factors
        const score = rescueFunnel.calculateEngagementScore({
          timeSpent: idleTime,
          pagesVisited: 1, // Placeholder, ideally track actual pages
          cartValue: 0, // Placeholder, ideally track actual cart value
          networkStatus: isOnline ? "online" : "offline",
          batteryStatus: batteryLevel,
          isCharging,
        })
        setEngagementScore(score)

        // Decide which rescue to trigger based on score and other factors
        const rescueType = rescueFunnel.determineRescueStrategy(score, {
          hasCartItems: false, // Placeholder
          isReturningUser: false, // Placeholder
        })

        if (rescueType && !hasTriggeredRescue) {
          triggerRescue(rescueType)
        } else if (!rescueType && !hasTriggeredRescue) {
          // If no specific rescue, but still abandoning, just set isAbandoning
          setIsAbandoning(true)
          trackEvent("Abandonment_Detected", { reason: "Idle", score })
        }
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [lastActivity, isAbandoning, isOnline, batteryLevel, isCharging, triggerRescue, hasTriggeredRescue, trackEvent])

  // Reset hasTriggeredRescue on route change (new user journey)
  useEffect(() => {
    setHasTriggeredRescue(false)
  }, [pathname, setHasTriggeredRescue])

  // Log abandonment status for debugging
  useEffect(() => {
    if (isAbandoning) {
      console.log("User is abandoning! Engagement Score:", engagementScore)
    }
  }, [isAbandoning, engagementScore])

  return (
    <AbandonmentContext.Provider value={{ isAbandoning, lastActivity, engagementScore, triggerRescue, recordActivity }}>
      {children}
      {activeRescueType === "chat" && <ChatIntervention onClose={() => setActiveRescueType(null)} />}
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
