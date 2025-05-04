"use client"

import { Button } from "@/components/ui/button"
import { MessageSquareText } from "lucide-react"
import { useSupportBot } from "@/lib/support-bot-context"

export function SupportBotButton() {
  const { openSupportBot } = useSupportBot()

  return (
    <Button
      onClick={openSupportBot}
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center"
      aria-label="Open Support Chat"
    >
      <MessageSquareText className="h-6 w-6" />
    </Button>
  )
}
