"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

interface CollapsibleSharePanelProps {
  onPanelStateChange?: (state: { expanded: boolean; height: number; top: number }) => void
}

// Define approximate heights for consistent clamping
const COLLAPSED_PANEL_HEIGHT = 50 // Approximate height of the collapsed button
const EXPANDED_PANEL_HEIGHT = 750 // Approximate height of the expanded panel (688px iframe + padding/border)

export function CollapsibleSharePanel({ onPanelStateChange }: CollapsibleSharePanelProps) {
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

  // Report panel state (expanded, height, top) to parent
  useEffect(() => {
    if (onPanelStateChange && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      onPanelStateChange({
        expanded: isExpanded,
        height: rect.height,
        top: rect.top,
      })
    }
  }, [isExpanded, onPanelStateChange, isMounted]) // Re-run when expanded state changes or on mount

  if (!isMounted) return null

  const documentHeight = document.documentElement.scrollHeight

  // Determine the current panel height for consistent clamping of its top position
  const currentPanelHeight = isExpanded ? EXPANDED_PANEL_HEIGHT : COLLAPSED_PANEL_HEIGHT
  const maxPanelTop = documentHeight - currentPanelHeight - bottomPageMargin

  // Calculate desired top position (e.g., fixed at 20px from top for simplicity, or more complex logic)
  const desiredTop = minTopOffset // For now, let's keep it simple for the share panel

  // Clamp the desiredTop within the visible document boundaries
  const panelTopPosition = `${Math.max(minTopOffset, Math.min(desiredTop, maxPanelTop))}px`

  return (
    <div
      ref={panelRef}
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
                <Share2 className="h-5 w-5" />
                Share
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse share panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-4">Share this page with your friends and family!</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" /> Share via Email
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" /> Share on Facebook
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" /> Share on Twitter
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
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
            aria-label="Open share panel"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
