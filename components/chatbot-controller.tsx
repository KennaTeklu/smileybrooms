"use client"

import { useEffect } from "react"

export default function ChatbotController() {
  useEffect(() => {
    // Override any JotForm auto-open behavior after initialization
    const overrideChatbotBehavior = () => {
      if (typeof window !== "undefined") {
        // Check for JotForm chatbot elements and force them closed
        const chatbotIframes = document.querySelectorAll('iframe[src*="jotform"]')
        chatbotIframes.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement
          if (iframeElement.style.display !== "none") {
            // Don't hide the button, just ensure chat window is closed
            const chatWindow = document.querySelector("[data-jotform-chat-window]")
            if (chatWindow) {
              ;(chatWindow as HTMLElement).style.display = "none"
            }
          }
        })

        // Override any global JotForm auto-open functions
        if ((window as any).JotFormAgent) {
          const originalOpen = (window as any).JotFormAgent.open
          ;(window as any).JotFormAgent.open = function (...args: any[]) {
            // Only allow manual opens, not automatic ones
            if (args[0] !== "manual") {
              console.log("Blocked automatic chatbot opening")
              return
            }
            return originalOpen.apply(this, args)
          }
        }
      }
    }

    // Run immediately and on DOM changes
    overrideChatbotBehavior()

    // Set up observer to catch any dynamic changes
    const observer = new MutationObserver(overrideChatbotBehavior)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also run after a delay to catch late initializations
    const timeouts = [500, 1000, 2000, 5000].map((delay) => setTimeout(overrideChatbotBehavior, delay))

    return () => {
      observer.disconnect()
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return null
}
