"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { useVoiceCommands } from "@/lib/voice/voice-command-engine"
import { Button } from "@/components/ui/button"

interface VoiceCommandButtonProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VoiceCommandButton({ className = "", size = "md", variant = "outline" }: VoiceCommandButtonProps) {
  const { isListening, isSupported, toggleListening, addCommands } = useVoiceCommands()
  const [showUnsupported, setShowUnsupported] = useState(false)

  useEffect(() => {
    // Register default commands

    addCommands([
      {
        phrases: ["add bathroom", "add bath"],
        handler: () => {
          const bathButton = document.querySelector('[data-room="bathroom"]')
          if (bathButton) {
            ;(bathButton as HTMLButtonElement).click()
          }
        },
        description: "Add bathroom to cleaning",
      },
      {
        phrases: ["add bedroom", "add bed"],
        handler: () => {
          const bedButton = document.querySelector('[data-room="bedroom"]')
          if (bedButton) {
            ;(bedButton as HTMLButtonElement).click()
          }
        },
        description: "Add bedroom to cleaning",
      },
      {
        phrases: ["book now", "checkout"],
        handler: () => {
          const bookButton = document.querySelector('[data-action="book-now"]')
          if (bookButton) {
            ;(bookButton as HTMLButtonElement).click()
          }
        },
        description: "Proceed to checkout",
      },
      {
        phrases: ["go back", "previous page"],
        handler: () => {
          window.history.back()
        },
        description: "Navigate to previous page",
      },
    ])
  }, [addCommands])

  const handleClick = () => {
    if (!isSupported) {
      setShowUnsupported(true)
      setTimeout(() => setShowUnsupported(false), 3000)
      return
    }

    toggleListening()
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size="icon"
        className={`rounded-full ${sizeClasses[size]} ${className} ${isListening ? "bg-red-100 text-red-600 border-red-300 animate-pulse" : ""}`}
        onClick={handleClick}
        aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>

      {isListening && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      )}

      {showUnsupported && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Voice commands not supported in this browser
        </div>
      )}
    </div>
  )
}
