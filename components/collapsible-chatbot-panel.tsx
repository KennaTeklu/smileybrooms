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
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Enhanced click outside detection with multiple event types and better targeting
  useEffect(() => {
    if (!isMounted || !isExpanded) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      // Don't close if clicking on the collapsed button
      if (collapsedButtonRef.current && collapsedButtonRef.current.contains(target)) {
        return
      }

      // Don't close if clicking inside the expanded panel
      if (expandedPanelRef.current && expandedPanelRef.current.contains(target)) {
        return
      }

      // Close if clicking on backdrop or outside
      if (backdropRef.current && (backdropRef.current === target || backdropRef.current.contains(target))) {
        setIsExpanded(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false)
      }
    }

    // Add multiple event listeners for better coverage
    document.addEventListener("mousedown", handleClickOutside, true)
    document.addEventListener("touchstart", handleClickOutside, true)
    document.addEventListener("click", handleClickOutside, true)
    document.addEventListener("keydown", handleEscape)

    // Prevent body scroll when panel is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
      document.removeEventListener("click", handleClickOutside, true)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
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
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close if clicking directly on backdrop
            if (e.target === backdropRef.current) {
              setIsExpanded(false)
            }
          }}
        >
          <motion.div
            ref={expandedPanelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 max-h-[90vh] flex flex-col"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside panel
          >
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-5 border-b border-blue-500/20 flex items-center justify-between flex-shrink-0">
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

            <div className="flex-1 w-full overflow-y-auto">
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
                  height: "100%",
                  border: "none",
                  width: "100%",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed-chatbot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <Button
            ref={collapsedButtonRef}
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full bg-transparent text-white shadow-lg hover:bg-blue-700/20 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-transparent",
              "w-12 h-12 p-0",
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Close chatbot panel" : "Open chatbot panel"}
            aria-expanded={isExpanded}
          >
            <Bot className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
