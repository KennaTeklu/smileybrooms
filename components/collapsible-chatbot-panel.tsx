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

// Define fixed top offsets for different states
const DEFAULT_COLLAPSED_TOP_OFFSET = 300 // Chatbot collapsed, Share panel collapsed
const EXPANDED_CHATBOT_TOP_OFFSET = 0 // Chatbot expanded
const SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET = 500 // Share panel expanded (overrides other states for chatbot position)

// Define approximate heights for consistent clamping
const COLLAPSED_PANEL_HEIGHT = 50 // Approximate height of the collapsed button
const EXPANDED_PANEL_HEIGHT = 750 // Approximate height of the expanded panel (688px iframe + padding/border)

export function CollapsibleChatbotPanel({
  sharePanelInfo = { expanded: false, height: 0 },
}: CollapsibleChatbotPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
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
    // If chatbot is expanded and share panel is not, chatbot goes to 0px from top
    desiredTop = EXPANDED_CHATBOT_TOP_OFFSET
  } else {
    // If chatbot is collapsed and share panel is not, chatbot goes to 300px from top
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
      // Adjusted right positioning for better mobile responsiveness
      className={`fixed right-4 sm:right-4 md:right-4 lg:right-4 z-[999] flex transition-all ${topTransitionClass} ease-in-out`}
      style={{ top: panelTopPosition }}
    >
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0, x: 20 }}
            // Adjusted maxWidth for better responsiveness across screen sizes
            animate={{ width: "100%", maxWidth: "90vw", sm: { maxWidth: "420px" }, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-l-2xl shadow-2xl overflow-hidden border-l-2 border-t-2 border-b-2 border-blue-200/50 dark:border-blue-800/50"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
              maxHeight: "80vh", // Added max height for vertical responsiveness
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-5 border-b border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Customer Support</h2>
                  <p className="text-blue-100 text-sm">We're here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                aria-label="Collapse chatbot panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-full w-full overflow-y-auto">
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
                  height: "688px", // Keep fixed height for iframe content
                  border: "none",
                  width: "100%",
                }}
                // Removed scrolling="no" to allow browser to handle iframe scrolling
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 py-4 px-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-l-2xl shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border-l-2 border-t-2 border-b-2 border-blue-200/50 dark:border-blue-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)",
            }}
            aria-label="Open Customer Support"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Support</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Get help now</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
