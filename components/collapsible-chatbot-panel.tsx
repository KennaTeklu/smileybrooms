"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

// Extend Window interface for JotForm
declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, url: string) => void
  }
}

interface CollapsibleChatbotPanelProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  setPanelHeight: (height: number) => void
  dynamicTop: number
}

export function CollapsibleChatbotPanel({
  isExpanded,
  setIsExpanded,
  setPanelHeight,
  dynamicTop,
}: CollapsibleChatbotPanelProps) {
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Report panel height to parent
  useLayoutEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isExpanded, setPanelHeight]) // Recalculate height when expanded state changes

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted, setIsExpanded])

  useEffect(() => {
    if (isExpanded && isMounted) {
      // Load JotForm embed handler script
      const script = document.createElement("script")
      script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
      script.onload = () => {
        // Initialize JotForm embed handler
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
        // Cleanup script when component unmounts or panel closes
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

  return (
    <div ref={panelRef} className="fixed right-0 z-[999] flex" style={{ top: dynamicTop }}>
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
