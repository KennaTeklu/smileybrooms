"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Extend Window interface for JotForm
declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, url: string) => void
  }
}

export function CollapsibleChatbotPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const expandedPanelRef = useRef<HTMLDivElement>(null)
  const collapsedButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicks outside the expanded panel to collapse it
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded) {
        if (expandedPanelRef.current && !expandedPanelRef.current.contains(event.target as Node)) {
          setIsExpanded(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isExpanded])

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
          // Ignore cross-origin errors
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

  return (
    <AnimatePresence initial={false}>
      {isExpanded ? (
        <motion.div
          key="expanded-chatbot"
          ref={expandedPanelRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-20"
        >
          <div
            className="w-full max-w-sm bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 max-h-[90vh] flex flex-col"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
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

            <div className="flex-1 w-full">
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
                  height: "100%", // Use 100% height within its parent div
                  border: "none",
                  width: "100%",
                }}
                scrolling="no"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed-chatbot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-10" // Position for collapsed state
        >
          <Button
            ref={collapsedButtonRef}
            variant="outline"
            size="icon"
            className={cn(
              `rounded-full bg-transparent text-white shadow-lg hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-transparent`,
              "w-10 h-10 p-0",
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Close chatbot panel" : "Open chatbot panel"}
            aria-expanded={isExpanded}
          >
            <Bot className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
