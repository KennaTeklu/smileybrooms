"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

// Extend Window interface for JotForm
declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, url: string) => void
  }
}

interface CollapsibleChatbotPanelProps {
  sharePanelInfo?: { expanded: boolean; height: number }
}

// Define approximate heights for consistent clamping
// Adjust these values if your collapsed button or expanded iframe height changes significantly
const COLLAPSED_PANEL_HEIGHT = 50 // Approximate height of the collapsed button
const EXPANDED_PANEL_HEIGHT = 750 // Approximate height of the expanded panel (688px iframe + padding/border)

export function CollapsibleChatbotPanel({
  sharePanelInfo = { expanded: false, height: 0 },
}: CollapsibleChatbotPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  // Stores the scroll position when the panel was expanded, to keep it fixed relative to that point.
  const [scrollPositionAtExpand, setScrollPositionAtExpand] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const minTopOffset = 20
  const initialScrollOffset = 450 // Base offset for the collapsed panel, 450px lower from top of viewport
  const bottomPageMargin = 20
  const SHARE_PANEL_MARGIN_BOTTOM = 20 // Margin between share panel and chatbot panel

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Capture current scroll position when the panel expands
  useEffect(() => {
    if (isExpanded) {
      setScrollPositionAtExpand(window.scrollY)
    }
  }, [isExpanded])

  // Handle clicks outside the panel to collapse it
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

  // Load JotForm embed handler script when panel expands
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

  if (!isMounted) return null

  const documentHeight = document.documentElement.scrollHeight

  // Calculate dynamic offset based on share panel's state and height
  const dynamicOffset = sharePanelInfo.expanded ? sharePanelInfo.height + SHARE_PANEL_MARGIN_BOTTOM : 0

  // Determine the current panel height for consistent clamping of its top position
  const currentPanelHeight = isExpanded ? EXPANDED_PANEL_HEIGHT : COLLAPSED_PANEL_HEIGHT
  const maxPanelTop = documentHeight - currentPanelHeight - bottomPageMargin

  // Calculate the desired top position based on expansion state and current/captured scroll
  let desiredTop: number
  if (isExpanded) {
    // When expanded, fix its position relative to where the scroll was when it opened,
    // and move it up by 440px.
    desiredTop = scrollPositionAtExpand + initialScrollOffset + dynamicOffset - 440
  } else {
    // When collapsed, make it follow the current scroll position, maintaining the initial offset.
    desiredTop = window.scrollY + initialScrollOffset + dynamicOffset
  }

  // Clamp the desiredTop within the visible document boundaries
  const panelTopPosition = `${Math.max(minTopOffset, Math.min(desiredTop, maxPanelTop))}px`

  return (
    <div
      ref={panelRef}
      // Always apply transition-all to ensure smooth movement for the 'top' property
      className="fixed right-0 z-[999] flex transition-all duration-300 ease-in-out"
      style={{ top: panelTopPosition }}
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
    </div>
  )
}

export default CollapsibleChatbotPanel
