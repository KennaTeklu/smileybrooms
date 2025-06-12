"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { useVoiceCommands } from "@/lib/voice/voice-command-engine"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface VoiceCommandButtonProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VoiceCommandButton({ className = "", size = "md", variant = "outline" }: VoiceCommandButtonProps) {
  const { isListening, isSupported, error, toggleListening, addCommands, clearError } = useVoiceCommands()
  const [showUnsupported, setShowUnsupported] = useState(false)
  const { toast } = useToast()

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
        phrases: ["add kitchen"],
        handler: () => {
          const kitchenButton = document.querySelector('[data-room="kitchen"]')
          if (kitchenButton) {
            ;(kitchenButton as HTMLButtonElement).click()
          }
        },
        description: "Add kitchen to cleaning",
      },
      {
        phrases: ["add living room", "add living"],
        handler: () => {
          const livingButton = document.querySelector('[data-room="living-room"]')
          if (livingButton) {
            ;(livingButton as HTMLButtonElement).click()
          }
        },
        description: "Add living room to cleaning",
      },
      {
        phrases: ["book now", "checkout", "proceed to checkout"],
        handler: () => {
          const bookButton = document.querySelector('[data-action="book-now"]')
          if (bookButton) {
            ;(bookButton as HTMLButtonElement).click()
          }
        },
        description: "Proceed to checkout",
      },
      {
        phrases: ["open cart", "show cart", "view cart"],
        handler: () => {
          const cartButton = document.querySelector('[data-action="open-cart"]')
          if (cartButton) {
            ;(cartButton as HTMLButtonElement).click()
          }
        },
        description: "Open shopping cart",
      },
      {
        phrases: ["go back", "previous page", "back"],
        handler: () => {
          window.history.back()
        },
        description: "Navigate to previous page",
      },
    ])
  }, [addCommands])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Voice Command Error",
        description: error,
        variant: "destructive",
      })
      // Clear error after showing toast
      setTimeout(() => {
        clearError()
      }, 5000)
    }
  }, [error, toast, clearError])

  const handleClick = async () => {
    if (!isSupported) {
      setShowUnsupported(true)
      setTimeout(() => setShowUnsupported(false), 3000)
      return
    }

    const success = await toggleListening()

    if (!success && !isListening) {
      // If failed to start, show additional help
      toast({
        title: "Voice Commands Help",
        description: "To use voice commands, please allow microphone access when prompted by your browser.",
        duration: 5000,
      })
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const getButtonState = () => {
    if (error) return "error"
    if (isListening) return "listening"
    return "idle"
  }

  const buttonState = getButtonState()

  return (
    <div className="relative">
      <Button
        variant={variant}
        size="icon"
        className={`rounded-full ${sizeClasses[size]} ${className} ${
          buttonState === "listening"
            ? "bg-red-100 text-red-600 border-red-300 animate-pulse"
            : buttonState === "error"
              ? "bg-orange-100 text-orange-600 border-orange-300"
              : ""
        }`}
        onClick={handleClick}
        aria-label={
          buttonState === "listening"
            ? "Stop voice commands"
            : buttonState === "error"
              ? "Voice command error - click to retry"
              : "Start voice commands"
        }
      >
        {buttonState === "error" ? (
          <AlertCircle className="h-5 w-5" />
        ) : buttonState === "listening" ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </Button>

      {isListening && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      )}

      {showUnsupported && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          Voice commands not supported in this browser
        </div>
      )}
    </div>
  )
}
