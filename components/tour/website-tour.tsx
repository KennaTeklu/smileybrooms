"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, X, Play, Pause, RotateCcw } from "lucide-react"
import { useTour } from "@/hooks/use-tour"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useToast } from "@/components/ui/use-toast"
import type { TourStep } from "@/lib/types" // Import TourStep type

// Define your tour steps here
const defaultTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to SmileyBrooms!",
    content: "Let's take a quick tour to show you how to get your home sparkling clean.",
    targetSelector: "body", // Target the body or a central element
    placement: "center",
  },
  {
    id: "header-nav",
    title: "Easy Navigation",
    content: "Our header provides quick access to Home, Pricing, About, Contact, and Accessibility.",
    targetSelector: "#main-header",
    placement: "bottom",
  },
  {
    id: "pricing-calculator",
    title: "Get Your Estimate",
    content: "Head over to the Pricing page to select your rooms and get an instant quote.",
    targetSelector: 'a[href="/pricing"]',
    placement: "bottom",
    action: () => {
      // Optional: navigate to pricing page
      window.location.href = "/pricing"
    },
  },
  {
    id: "cart-button",
    title: "Your Cart",
    content: "Your selected services appear here. Click to review your order.",
    targetSelector: ".fixed.bottom-4.right-4 button", // Targeting the cart button
    placement: "left",
  },
  {
    id: "settings-panel",
    title: "Accessibility & Settings",
    content: "Customize your experience with accessibility options and display settings.",
    targetSelector: ".fixed.bottom-20.right-4 button", // Targeting the settings button
    placement: "left",
  },
  {
    id: "share-panel",
    title: "Share the Sparkle!",
    content: "Easily share our services with friends and family via various platforms.",
    targetSelector: ".fixed.bottom-36.right-4 button", // Targeting the share button
    placement: "left",
  },
  {
    id: "chatbot-panel",
    title: "Need Help?",
    content: "Our friendly chatbot is here to assist you with any questions.",
    targetSelector: ".fixed.bottom-52.right-4 button", // Targeting the chatbot button
    placement: "left",
  },
  {
    id: "footer-info",
    title: "Stay Connected",
    content: "Find our contact info, quick links, and social media in the footer.",
    targetSelector: "footer",
    placement: "top",
  },
  {
    id: "tour-complete",
    title: "Tour Complete!",
    content: "You're all set! Start exploring SmileyBrooms and get your home sparkling.",
    targetSelector: "body",
    placement: "center",
  },
]

export function useWebsiteTour() {
  const { currentStep, startTour, nextStep, prevStep, endTour, isActive, tourSteps: customTourSteps } = useTour()
  const { vibrate } = useVibration()
  const { toast } = useToast()

  const tourSteps = useMemo(() => (customTourSteps.length > 0 ? customTourSteps : defaultTourSteps), [customTourSteps])

  const [isPaused, setIsPaused] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  const currentTourStep = tourSteps[currentStep]

  const updatePosition = useCallback(() => {
    if (!currentTourStep) return

    let element = document.querySelector<HTMLElement>(currentTourStep.targetSelector)

    // Fallback to body if element not found, but log a warning
    if (!element) {
      console.warn(
        `Tour target element not found for step "${currentTourStep.id}": ${currentTourStep.targetSelector}. Falling back to body.`,
      )
      element = document.body
    }

    setTargetElement(element)

    if (element) {
      const rect = element.getBoundingClientRect()
      setPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })

      // Calculate tooltip position based on placement
      let top = 0
      let left = 0
      const tooltipWidth = 300 // Approximate tooltip width
      const tooltipHeight = 150 // Approximate tooltip height

      switch (currentTourStep.placement) {
        case "top":
          top = rect.top - tooltipHeight - 20 // 20px padding
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "bottom":
          top = rect.bottom + 20
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - 20
          break
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + 20
          break
        case "center":
          top = window.innerHeight / 2 - tooltipHeight / 2
          left = window.innerWidth / 2 - tooltipWidth / 2
          break
        default:
          top = rect.bottom + 20
          left = rect.left + rect.width / 2 - tooltipWidth / 2
      }

      // Ensure tooltip stays within viewport
      top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20))
      left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20))

      setTooltipPosition({ top, left })

      // Scroll to the element if it's not in view
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentTourStep])

  useEffect(() => {
    if (isActive && currentTourStep) {
      updatePosition()
      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition) // Update on scroll as well
    }
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [isActive, currentTourStep, updatePosition])

  useKeyboardShortcuts({
    ArrowRight: () => isActive && !isPaused && nextStep(),
    ArrowLeft: () => isActive && !isPaused && prevStep(),
    Escape: () => isActive && endTour(),
    Space: () => isActive && setIsPaused((prev) => !prev),
  })

  const handleNext = () => {
    vibrate(50)
    if (currentTourStep?.action) {
      currentTourStep.action()
    }
    nextStep()
  }

  const handlePrev = () => {
    vibrate(50)
    prevStep()
  }

  const handleEndTour = () => {
    vibrate(50)
    endTour()
    toast({
      title: "Tour Ended",
      description: "You can restart the tour anytime from the settings.",
      variant: "default",
    })
  }

  const handleStartTour = () => {
    vibrate(50)
    startTour(defaultTourSteps) // Pass default steps if no custom steps are provided
    toast({
      title: "Tour Started!",
      description: "Follow the prompts to explore the website.",
      variant: "default",
    })
  }

  if (!isActive || !currentTourStep) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[90]"
      />

      {/* Highlighted Element */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute z-[91] rounded-lg border-4 border-blue-400 shadow-blue-glow pointer-events-none"
          style={{
            top: position.y,
            left: position.x,
            width: position.width,
            height: position.height,
          }}
        />
      )}

      {/* Tour Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed z-[92] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{currentTourStep.title}</h3>
          <Button variant="ghost" size="icon" onClick={handleEndTour} aria-label="End tour">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{currentTourStep.content}</p>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>
            Step {currentStep + 1} of {tourSteps.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume tour" : "Pause tour"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEndTour} aria-label="Restart tour">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0 || isPaused}
            className="flex-1 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={isPaused} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {currentStep === tourSteps.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </>
  )
}
