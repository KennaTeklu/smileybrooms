"use client"

import { useState, useEffect, useRef } from "react"
import { X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePanelControl } from "@/contexts/panel-control-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Extend Window interface for JotForm
declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, url: string) => void
  }
}

type CollapsibleChatbotPanelProps = {}

export function CollapsibleChatbotPanel({}: CollapsibleChatbotPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { registerPanel, unregisterPanel } = usePanelControl()

  useEffect(() => {
    registerPanel("chatbot-panel", setIsOpen)
    return () => unregisterPanel("chatbot-panel")
  }, [registerPanel, unregisterPanel])

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
          return
        }
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, isMounted])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

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
  }, [isOpen, isMounted])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} aria-label="Open chatbot">
        <MessageSquare className="h-4 w-4 mr-2" /> Chat
      </Button>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between pr-6">
          <SheetTitle className="text-2xl font-bold">Chatbot</SheetTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <p className="text-gray-600">Chatbot functionality will be implemented here.</p>
          {/* Placeholder for chatbot UI */}
          <div className="h-full flex items-center justify-center border border-dashed rounded-lg p-4 mt-4 text-gray-400">
            Your AI Chatbot will appear here.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
