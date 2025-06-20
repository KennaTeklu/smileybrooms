"use client"

import { useRef, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatbotManager } from "@/components/chatbot-manager"

interface CollapsibleChatbotPanelProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  setPanelHeight: (height: number) => void
  dynamicBottom: number
}

export function CollapsibleChatbotPanel({
  isExpanded,
  setIsExpanded,
  setPanelHeight,
  dynamicBottom,
}: CollapsibleChatbotPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isExpanded, setPanelHeight])

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed right-4 z-[999] transition-all duration-300 ease-in-out",
        isExpanded ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible",
      )}
      style={{ bottom: `${dynamicBottom}px` }}
    >
      <Card className="w-80 h-[400px] flex flex-col shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-lg font-semibold">Chat with us</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} aria-label="Close chatbot">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-2 overflow-hidden">
          <ChatbotManager />
        </CardContent>
      </Card>
    </div>
  )
}
