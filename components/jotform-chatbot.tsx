"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

interface JotFormChatbotProps {
  skipWelcome?: boolean
  maximizable?: boolean
  position?: "left" | "right"
  autoOpen?: boolean
}

export default function JotFormChatbot({
  skipWelcome = true,
  maximizable = true,
  position = "right",
  autoOpen = false,
}: JotFormChatbotProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Clean up any existing chatbot instance
    if (scriptRef.current) {
      document.head.removeChild(scriptRef.current)
      scriptRef.current = null
    }

    // Clear any existing JotForm agent
    if (typeof window !== "undefined" && (window as any).AgentInitializer) {
      delete (window as any).AgentInitializer
    }

    // Create and load the JotForm script
    const script = document.createElement("script")
    script.src = `https://cdn.jotfor.ms/agent/embedjs/019727f88b017b95a6ff71f7fdcc58538ab4/embed.js?skipWelcome=${skipWelcome ? 1 : 0}&maximizable=${maximizable ? 1 : 0}`
    script.async = true

    script.onload = () => {
      // Initialize the chatbot with custom configuration
      if (typeof window !== "undefined" && (window as any).AgentInitializer) {
        ;(window as any).AgentInitializer.init({
          agentRenderURL: "https://www.jotform.com/agent/019727f88b017b95a6ff71f7fdcc58538ab4",
          toolId: "JotformAgent-019727f88b017b95a6ff71f7fdcc58538ab4",
          formID: "019727f88b017b95a6ff71f7fdcc58538ab4",
          domain: "https://www.jotform.com/",
          initialContext: "",
          queryParams: [`skipWelcome=${skipWelcome ? 1 : 0}`, `maximizable=${maximizable ? 1 : 0}`],
          domain: "https://www.jotform.com",
          isDraggable: false,
          buttonColor: "#158ded, #6C73A8 0%, #6C73A8 100%",
          buttonBackgroundColor: "#00cc3",
          buttonIconColor: "#FFFFFF",
          inputTextColor: "#91105C",
          variant: false,
          isGreeting:
            "greeting:Yes,greetingMessage:Hi! Welcome to smileybrooms.com! How can I assist you?,openByDefault:No,pulse:Yes,position:right,autoOpenChatIn:0",
          isVoice: false,
          isVoiceWebCallEnabled: true,
        })
      }
    }

    document.head.appendChild(script)
    scriptRef.current = script

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current)
      }
    }
  }, [pathname, skipWelcome, maximizable, position, autoOpen])

  return null // This component doesn't render anything visible
}
