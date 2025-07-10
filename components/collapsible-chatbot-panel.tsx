"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import JotFormChatbot from "./jotform-chatbot" // Assuming this is the component for the JotForm chatbot

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
  const [isOpen, setIsOpen] = React.useState(false)
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
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, isMounted])

  // Load JotForm embed handler script when panel expands
  useEffect(() => {
    if (isOpen && isMounted) {
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
  }, [isOpen, isMounted])

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
  } else if (isOpen) {
    // If chatbot is expanded and share panel is not, chatbot goes to 0px from top
    desiredTop = EXPANDED_CHATBOT_TOP_OFFSET
  } else {
    // If chatbot is collapsed and share panel is not, chatbot goes to 300px from top
    desiredTop = DEFAULT_COLLAPSED_TOP_OFFSET
  }

  // Determine the current panel height for consistent clamping of its top position
  const currentPanelHeight = isOpen ? EXPANDED_PANEL_HEIGHT : COLLAPSED_PANEL_HEIGHT
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
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full max-w-md rounded-md border bg-white p-4 shadow-sm dark:bg-gray-950"
      >
        <div className="flex items-center justify-between space-x-4 px-4 py-2">
          <h4 className="text-lg font-semibold">AI Chatbot</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle chatbot</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-4 px-4 pb-2">
          <Separator />
          <div className="h-[400px] w-full overflow-hidden rounded-md border">
            {/* The JotFormChatbot component should handle its own scrolling if its content overflows */}
            <JotFormChatbot />
          </div>
          <p className="text-sm text-muted-foreground">
            Ask our AI assistant any questions about our services, pricing, or booking process.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
