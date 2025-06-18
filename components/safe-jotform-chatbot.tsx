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
  const leftPosition = isMobile ? 16 : 32 // 16px for mobile (equivalent to px-4), 32px for desktop (equivalent to px-8)

  return (
    <div
      className={cn(
        "fixed z-50", // Ensure it's fixed and on top of general content
      )}
      style={{
        top: `${calculatedTop}px`,
        left: `${leftPosition}px`,
        width: isMobile ? "calc(100% - 32px)" : "400px", // Example width, adjust as needed
        height: isMobile ? `calc(${screenHeight}px - ${calculatedTop}px - 16px)` : "688px", // Adjust height for mobile to fit remaining space
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <iframe
        ref={iframeRef}
        id="JotFormIFrame-019727f88b017b95a6ff71f7fdcc58538ab4"
        title="smileybrooms.com: Customer Support Representative"
        onLoad={() => window.parent.scrollTo(0, 0)}
        allowTransparency={true}
        allow="geolocation; microphone; camera; fullscreen"
        src="https://agent.jotform.com/019727f88b017b95a6ff71f7fdcc58538ab4?embedMode=iframe&background=1&shadow=1"
        frameBorder="0"
        style={{
          minWidth: "100%",
          maxWidth: "100%",
          height: "100%", // Use 100% to fill the parent div
          border: "none",
          width: "100%",
        }}
        scrolling="no"
      ></iframe>
    </div>
  )
}

// Extend the Window interface to include jotformEmbedHandler
declare global {
  interface Window {
    jotformEmbedHandler: (selector: string, baseUrl: string) => void
  }
}
