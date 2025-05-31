"use client"

import { useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"

interface ChatbotEvent {
  type: "open" | "close" | "message_sent" | "message_received" | "page_view"
  page: string
  timestamp: number
  data?: any
}

export function useChatbotAnalytics() {
  const pathname = usePathname()

  const trackEvent = useCallback(
    (event: Omit<ChatbotEvent, "timestamp" | "page">) => {
      const chatbotEvent: ChatbotEvent = {
        ...event,
        page: pathname,
        timestamp: Date.now(),
      }

      // Send to your analytics service
      if (typeof window !== "undefined") {
        // Example: Google Analytics
        if ((window as any).gtag) {
          ;(window as any).gtag("event", "chatbot_interaction", {
            event_category: "chatbot",
            event_label: event.type,
            custom_map: { page: pathname },
          })
        }

        // Example: Custom analytics
        console.log("Chatbot Event:", chatbotEvent)

        // Store in localStorage for debugging
        const events = JSON.parse(localStorage.getItem("chatbot_events") || "[]")
        events.push(chatbotEvent)
        localStorage.setItem("chatbot_events", JSON.stringify(events.slice(-50))) // Keep last 50 events
      }
    },
    [pathname],
  )

  useEffect(() => {
    trackEvent({ type: "page_view" })
  }, [pathname, trackEvent])

  return { trackEvent }
}
