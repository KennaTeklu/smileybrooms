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
  onClose?: () => void // Added onClose prop
}

// Define fixed top offsets for different states
const DEFAULT_COLLAPSED_TOP_OFFSET = 100 // Chatbot collapsed, Share panel collapsed
const EXPANDED_CHATBOT_TOP_OFFSET = 100 // Chatbot expanded
const SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET = 500 // Chatbot moves to 500px when share panel is expanded

// Define approximate heights for consistent clamping
const COLLAPSED_PANEL_HEIGHT = 50 // Approximate height of the collapsed button
const EXPANDED_PANEL_HEIGHT = 750 // Approximate height of the expanded panel (688px iframe + padding/border)

export function CollapsibleChatbotPanel({
  sharePanelInfo = { expanded: false, height: 0 },
  onClose, // Destructure onClose
}: CollapsibleChatbotPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded when rendered by parent
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const minTopOffset = 20 // Minimum distance from the top of the viewport
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicks outside the panel to collapse it
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
        onClose?.() // Call onClose when panel closes due to outside click
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted, onClose]) // Added onClose to dependencies

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
          //console.log("JotForm embed handler initialization skipped")
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

  // Add this useEffect hook immediately after the existing useEffect hooks
  useEffect(() => {
    //console.log("🎯 Chatbot panel received sharePanelInfo:", sharePanelInfo)
    //console.log("📐 Calculated topTransitionClass:", sharePanelInfo.expanded ? "duration-0" : "duration-300")

    if (panelRef.current) {
      const computedStyle = window.getComputedStyle(panelRef.current)
      //console.log("🎨 Chatbot Current top value (computed):", computedStyle.top)
      //console.log("⏱️ Chatbot Current transition-duration (computed):", computedStyle.transitionDuration)
    }
  }, [sharePanelInfo, sharePanelInfo.expanded]) // Re-run when sharePanelInfo.expanded changes

  if (!isMounted) return null

  const documentHeight = document.documentElement.scrollHeight

  let desiredTop: number

  if (sharePanelInfo.expanded) {
    // If share panel is expanded, chatbot always goes to 500px from top immediately
    desiredTop = SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET
  } else if (isExpanded) {
    // If chatbot is expanded and share panel is not, chatbot goes to 100px from top
    desiredTop = EXPANDED_CHATBOT_TOP_OFFSET
  } else {
    // If chatbot is collapsed and share panel is not, chatbot goes to 100px from top
    desiredTop = DEFAULT_COLLAPSED_TOP_OFFSET
  }

  // Determine the current panel height for consistent clamping of its top position
  const currentPanelHeight = isExpanded ? EXPANDED_PANEL_HEIGHT : COLLAPSED_PANEL_HEIGHT
  const maxPanelTop = documentHeight - currentPanelHeight - bottomPageMargin

  // Clamp the desiredTop within the visible document boundaries
  const panelTopPosition = `${Math.max(minTopOffset, Math.min(desiredTop, maxPanelTop))}px`

  // Determine the transition duration based on share panel state
  // It's immediate (duration-0) when share panel is expanded, smooth (duration-300) otherwise.
  const topTransitionClass = sharePanelInfo.expanded ? "duration-0" : "duration-300"

  return (
    <div
      ref={panelRef}
      // Apply transition-all and the dynamic duration class
      className={`fixed right-[50px] z-[999] flex transition-all ${topTransitionClass} ease-in-out`} // Fixed right position
      style={{ top: panelTopPosition }}
    >
      <AnimatePresence initial={false}>
        {
          isExpanded ? (
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
                  onClick={() => {
                    setIsExpanded(false)
                    onClose?.() // Call onClose when collapsing
                  }}
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
          ) : null /* The button is now rendered in app/page.tsx */
        }
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleChatbotPanel
