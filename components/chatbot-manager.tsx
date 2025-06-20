"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import SuperChatbot from "./super-chatbot"
import { AdvancedSidePanel } from "./sidepanel/advanced-sidepanel"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function ChatbotManager() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Enhanced visibility logic with page-specific timing
    const getDelay = () => {
      switch (pathname) {
        case "/checkout":
          return 5000 // Longer delay on checkout to avoid interruption
        case "/":
          return 3000 // Medium delay on homepage
        default:
          return 2000 // Quick appearance on other pages
      }
    }

    const timer = setTimeout(() => {
      // Only show the floating button initially, not open the panel
      // setIsPanelOpen(true); // Removed auto-open
    }, getDelay())

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {/* Floating button to open the side panel */}
      {!isPanelOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={() => setIsPanelOpen(true)} className="rounded-full w-14 h-14 shadow-lg" size="icon">
            <MessageSquare className="h-6 w-6" />
            {/* You might want to add a badge here for unread messages if you implement that */}
          </Button>
        </div>
      )}

      <AdvancedSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="AI Assistant"
        subtitle="Your smart support companion"
        width="md" // You can adjust this: "sm", "md", "lg", "xl"
        position="right"
        preserveScrollPosition={false} // Side panel typically doesn't need this
        showProgress={false} // No progress for chatbot
      >
        <SuperChatbot isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </AdvancedSidePanel>
    </>
  )
}
