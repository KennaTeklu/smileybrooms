"use client"

import { useEffect, useState, useRef } from "react"
import { useEnhancedDeviceDetection } from "@/hooks/use-enhanced-device-detection"
import { cn } from "@/lib/utils"

export default function SafeJotformChatbot() {
  const { isMobile, screenHeight } = useEnhancedDeviceDetection()
  const [isMounted, setIsMounted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && iframeRef.current) {
      // Dynamically load the Jotform embed handler script
      const script = document.createElement("script")
      script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
      script.async = true
      script.onload = () => {
        // Ensure the script is loaded before calling the handler
        if (window.jotformEmbedHandler) {
          window.jotformEmbedHandler(`iframe[id='${iframeRef.current?.id}']`, "https://www.jotform.com")
        }
      }
      document.body.appendChild(script)

      return () => {
        // Clean up the script when the component unmounts
        document.body.removeChild(script)
      }
    }
  }, [isMounted])

  if (!isMounted) {
    return null
  }

  // Determine header height (from globals.css comment: 64px)
  const headerHeightPx = 64
  // Desired fixed pixel offset from the bottom of the header
  const fixedOffsetFromHeader = 20
  const calculatedTop = headerHeightPx + fixedOffsetFromHeader // 84px from the top of the viewport

  // Adjust positioning for mobile vs desktop
  const leftPosition = isMobile ? 16 : 32
  const topPosition = calculatedTop + 200 // 3 times lower than settings panel

  return (
    <div
      className={cn(
        "fixed z-40", // Lower z-index than settings panel
      )}
      style={{
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
        width: "60px",
        height: "60px",
      }}
    >
      {/* Floating button trigger */}
      <button
        className="w-full h-full bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        onClick={() => {
          /* Toggle chatbot panel */
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-message-circle"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </button>
    </div>
  )
}

// Extend the Window interface to include jotformEmbedHandler
declare global {
  interface Window {
    jotformEmbedHandler: (selector: string, baseUrl: string) => void
  }
}
