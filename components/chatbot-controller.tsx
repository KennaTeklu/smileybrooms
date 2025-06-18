"use client"

import { useEffect } from "react"

export default function ChatbotController() {
  useEffect(() => {
    // Override any JotForm auto-open behavior
    const overrideChatbotBehavior = () => {
      if (typeof window !== "undefined") {
        // Check for JotForm chatbot elements and prevent auto-opening
        const chatbotIframes = document.querySelectorAll('iframe[src*="jotform"]')
        chatbotIframes.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement
          // Ensure JotForm doesn't auto-open outside our controlled environment
          const chatWindow = document.querySelector("[data-jotform-chat-window]")
          if (chatWindow && !iframe.closest(".chatbot-panel")) {
            ;(chatWindow as HTMLElement).style.display = "none"
          }
        })

        // Override global JotForm auto-open functions
        if ((window as any).JotFormAgent) {
          const originalOpen = (window as any).JotFormAgent.open
          ;(window as any).JotFormAgent.open = function (...args: any[]) {
            // Only allow manual opens from our unified chatbot
            if (args[0] !== "manual" && !document.querySelector(".chatbot-panel")) {
              console.log("Blocked automatic JotForm chatbot opening")
              return
            }
            return originalOpen?.apply(this, args)
          }
        }
      }
    }

    // Run immediately and on DOM changes
    overrideChatbotBehavior()

    const observer = new MutationObserver(overrideChatbotBehavior)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    const timeouts = [500, 1000, 2000, 5000].map((delay) => setTimeout(overrideChatbotBehavior, delay))

    return () => {
      observer.disconnect()
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return null
}
