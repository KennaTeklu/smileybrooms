"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePanelCollision } from "@/contexts/panel-collision-context"

declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, url: string) => void
  }
}

export function CollapsibleChatbotPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { registerPanel, updatePanel, getAdjustedPosition } = usePanelCollision()

  const minTopOffset = 20
  const initialScrollOffset = 100
  const bottomPageMargin = 20
  const panelId = "chatbot"

  useEffect(() => {
    setIsMounted(true)
    // Register this panel
    registerPanel(panelId, {
      isExpanded: false,
      position: { top: 100, right: 0 },
      width: isExpanded ? 400 : 120,
      height: isExpanded ? 750 : 60,
    })
  }, [registerPanel])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
    // Update panel state
    updatePanel(panelId, {
      isExpanded,
      width: isExpanded ? 400 : 120,
      height: isExpanded ? 750 : 60,
    })
  }, [isExpanded, updatePanel])

  useEffect(() => {
    if (!isMounted || isScrollPaused) return

    const updatePositionAndHeight = () => {
      setScrollPosition(window.scrollY)
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight)
      }
    }

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight()

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused])

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  useEffect(() => {
    if (isExpanded && isMounted) {
      const script = document.createElement("script")
      script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
      script.onload = () => {
        try {
          if (window.jotformEmbedHandler) {
            window.jotformEmbedHandler(
              "iframe[id='JotFormIFrame-019727f88b017b95a6ff71f7fdcc58538ab4']",
              "https://www.jotform.com",
            )
          }
        } catch (error) {
          console.log("JotForm embed handler initialization skipped")
        }
      }
      document.head.appendChild(script)

      return () => {
        const existingScript = document.querySelector(
          'script[src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"]',
        )
        if (existingScript) {
          document.head.removeChild(existingScript)
        }
      }
    }
  }, [isExpanded, isMounted])

  const documentHeight = document.documentElement.scrollHeight
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin
  const basePosition = useMemo(
    () => ({
      top: isScrollPaused
        ? Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))
        : Math.max(minTopOffset, Math.min(window.scrollY + initialScrollOffset, maxPanelTop)),
      right: 0,
    }),
    [isScrollPaused, scrollPosition, maxPanelTop],
  )

  // Get adjusted position to avoid collisions
  const adjustedPosition = getAdjustedPosition(panelId, basePosition)

  // Update panel position in context
  useEffect(() => {
    updatePanel(panelId, { position: adjustedPosition })
  }, [adjustedPosition, updatePanel])

  return (
    <motion.div
      ref={panelRef}
      className="fixed right-0 z-[999] flex"
      style={{ top: `${adjustedPosition.top}px` }}
      animate={{ top: adjustedPosition.top }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "400px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Customer Support
                {isScrollPaused && (
                  <Badge variant="secondary" className="text-xs">
                    Fixed
                  </Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse chatbot panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-[688px] w-full">
              <iframe
                id="JotFormIFrame-019727f88b017b95a6ff71f7fdcc58538ab4"
                title="smileybrooms.com: Customer Support Representative"
                onLoad={() => {
                  try {
                    window.parent.scrollTo(0, 0)
                  } catch (error) {
                    // Ignore cross-origin errors
                  }
                }}
                allowTransparency={true}
                allow="geolocation; microphone; camera; fullscreen"
                src="https://agent.jotform.com/019727f88b017b95a6ff71f7fdcc58538ab4?embedMode=iframe&background=1&shadow=1"
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  height: "688px",
                  border: "none",
                  width: "100%",
                }}
                scrolling="no"
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900 rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-l border-t border-b border-gray-200 dark:border-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Open Customer Support"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">Support</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
