"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

interface SafeJotFormChatbotProps {
  skipWelcome?: boolean
  maximizable?: boolean
  position?: "left" | "right"
  autoOpen?: boolean
}

export default function SafeJotFormChatbot({
  skipWelcome = true,
  maximizable = true,
  position = "right",
  autoOpen = false,
}: SafeJotFormChatbotProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initRef = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    // Prevent multiple initializations
    if (initRef.current) return

    const loadChatbot = async () => {
      try {
        // Check if script already exists
        const existingScript = document.querySelector(
          'script[src*="cdn.jotfor.ms/agent/embedjs/019727f88b017b95a6ff71f7fdcc58538ab4"]',
        )

        if (existingScript) {
          setIsLoaded(true)
          return
        }

        // Create script element with forced no auto-open
        const script = document.createElement("script")
        script.src = `https://cdn.jotfor.ms/agent/embedjs/019727f88b017b95a6ff71f7fdcc58538ab4/embed.js?skipWelcome=1&maximizable=1&autoOpen=0`
        script.async = true
        script.defer = true

        // Handle script load
        script.onload = () => {
          setIsLoaded(true)
          initRef.current = true

          // Initialize with a small delay to ensure DOM is ready
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).AgentInitializer) {
              try {
                ;(window as any).AgentInitializer.init({
                  agentRenderURL: "https://www.jotform.com/agent/019727f88b017b95a6ff71f7fdcc58538ab4",
                  toolId: "JotformAgent-019727f88b017b95a6ff71f7fdcc58538ab4",
                  formID: "019727f88b017b95a6ff71f7fdcc58538ab4",
                  domain: "https://www.jotform.com/",
                  initialContext: "",
                  queryParams: ["skipWelcome=1", "maximizable=1", "autoOpen=0"],
                  isDraggable: false,
                  buttonColor: "#158ded, #6C73A8 0%, #6C73A8 100%",
                  buttonBackgroundColor: "#00cc33",
                  buttonIconColor: "#FFFFFF",
                  inputTextColor: "#91105C",
                  variant: false,
                  isGreeting: "greeting:No,greetingMessage:,openByDefault:No,pulse:No,position:right,autoOpenChatIn:0",
                  isVoice: false,
                  isVoiceWebCallEnabled: true,
                  autoOpen: false,
                  openByDefault: false,
                  skipWelcome: true,
                  autoOpenChatIn: 0,
                  pulse: false,
                })
              } catch (initError) {
                console.warn("JotForm initialization error:", initError)
                setError("Failed to initialize chatbot")
              }
            }
          }, 100)
        }

        script.onerror = () => {
          setError("Failed to load chatbot script")
          console.error("JotForm script failed to load")
        }

        // Append script to head
        document.head.appendChild(script)
      } catch (loadError) {
        setError("Error loading chatbot")
        console.error("Chatbot load error:", loadError)
      }
    }

    loadChatbot()

    // Cleanup function - no DOM manipulation needed since script stays loaded
    return () => {
      // Just reset the ref, don't remove script to avoid errors
      initRef.current = false
    }
  }, []) // Remove dependencies to prevent re-initialization

  // Don't render anything if there's an error
  if (error) {
    console.warn("JotForm Chatbot Error:", error)
    return null
  }

  return null
}
