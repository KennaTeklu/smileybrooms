"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, MessageSquare } from "lucide-react"
import { ChatbotManager } from "./chatbot-manager" // Assuming ChatbotManager exists

interface CollapsibleChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
  dynamicTop: number // New prop for dynamic positioning
  setPanelHeight: (height: number) => void // Callback to report height
}

export function CollapsibleChatbotPanel({ isOpen, onClose, dynamicTop, setPanelHeight }: CollapsibleChatbotPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isOpen, setPanelHeight]) // Recalculate height when open state changes

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed right-4 z-[999] transition-all duration-300 ease-in-out"
      style={{ top: `${dynamicTop}px` }}
    >
      <Card className="w-80 shadow-lg h-[500px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChatbotManager />
        </CardContent>
      </Card>
    </div>
  )
}
