"use client"

import { useEffect, useState, useRef } from "react"
import { useDeviceDetection } from "@/hooks/use-device-detection"
import { cn } from "@/lib/utils"

export default function SafeJotformChatbot() {
  const { isMobile } = useDeviceDetection()
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

  // Adjust positioning for mobile vs desktop
  const positionClasses = isMobile
    ? "bottom-4 left-4" // Slightly off the very bottom-left for mobile thumb zone
    : "bottom-8 left-8" // More generous spacing for desktop

  return (
    <div
      className={cn(
        "fixed z-50", // Ensure it's fixed and on top of general content
        positionClasses,
      )}
      style={{
        // Ensure the container allows the iframe to be positioned correctly
        width: isMobile ? "calc(100% - 32px)" : "400px", // Example width, adjust as needed
        height: isMobile ? "calc(100% - 32px)" : "688px", // Example height, adjust as needed
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
