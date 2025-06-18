"use client"

import { useEffect, useState } from "react"
import { useDeviceDetection } from "@/hooks/use-device-detection"
import { cn } from "@/lib/utils"

export default function SafeJotformChatbot() {
  const { isMobile } = useDeviceDetection()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        "fixed z-50", // Ensure it's fixed and on top
        positionClasses,
      )}
    >
      {/* Placeholder for the Jotform chatbot button/widget */}
      <div className="bg-blue-600 text-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
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
      </div>
      {/* In a real application, you would embed your Jotform chatbot script here */}
      {/* <script src="https://form.jotform.com/jsform/YOUR_FORM_ID"></script> */}
    </div>
  )
}
