"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Share2, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EnhancedAccessibilityPanel from "@/components/enhanced-accessibility-panel"
import { cn } from "@/lib/utils"

interface FloatingActionButtonsProps {
  className?: string
}

export default function FloatingActionButtons({ className }: FloatingActionButtonsProps) {
  const [position, setPosition] = useState<"left" | "right">("right")
  const [showSettings, setShowSettings] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Load position preference from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("action-buttons-position")
    if (savedPosition === "left" || savedPosition === "right") {
      setPosition(savedPosition)
    }
  }, [])

  // Save position preference to localStorage
  useEffect(() => {
    localStorage.setItem("action-buttons-position", position)
  }, [position])

  // Very slow rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.2) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Calculate positions for the three buttons in a triangle formation
  const getButtonPosition = (index: number) => {
    const radius = 60 // Distance from center
    const angle = (rotation + index * 120) * (Math.PI / 180) // Convert to radians, 120 degrees apart

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  const togglePosition = () => {
    setPosition(position === "right" ? "left" : "right")
  }

  const settingsPosition = getButtonPosition(0)
  const sharePosition = getButtonPosition(1)
  const supportPosition = getButtonPosition(2)

  return (
    <>
      <motion.div
        className={cn(
          "fixed bottom-24 z-40 flex items-center justify-center",
          position === "right" ? "right-6" : "left-6",
          className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Position toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-0 -mt-12 bg-white dark:bg-gray-800 shadow-md"
          onClick={togglePosition}
          aria-label={`Move buttons to the ${position === "right" ? "left" : "right"}`}
        >
          {position === "right" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Settings Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                style={{
                  x: settingsPosition.x,
                  y: settingsPosition.y,
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 shadow-md"
                  onClick={() => setShowSettings(true)}
                  aria-label="Accessibility settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side={position === "right" ? "left" : "right"}>
              <p>Accessibility Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Share Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                style={{
                  x: sharePosition.x,
                  y: sharePosition.y,
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 shadow-md"
                  onClick={() => setShowShare(true)}
                  aria-label="Share this page"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side={position === "right" ? "left" : "right"}>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Support Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                style={{
                  x: supportPosition.x,
                  y: supportPosition.y,
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 shadow-md"
                  onClick={() => setShowSupport(true)}
                  aria-label="Get support"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side={position === "right" ? "left" : "right"}>
              <p>Support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      {/* Render the panels when their respective buttons are clicked */}
      {showSettings && <EnhancedAccessibilityPanel onClose={() => setShowSettings(false)} />}

      {/* We'll implement these components later as needed */}
      {/* {showShare && <SharePanel onClose={() => setShowShare(false)} />}
      {showSupport && <SupportPanel onClose={() => setShowSupport(false)} />} */}
    </>
  )
}
