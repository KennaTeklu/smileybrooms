"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function CollapsibleChatbotPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle click outside to collapse panel
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

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  return (
    <div ref={panelRef} className="flex">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800 flex flex-col"
          >
            <Card className="flex flex-col h-full w-full border-none shadow-none">
              <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  JotForm Chat
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Collapse chatbot panel"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full w-full">
                  {/* Embed JotForm here */}
                  <iframe
                    src="https://form.jotform.com/YOUR_FORM_ID" // REPLACE THIS WITH YOUR ACTUAL JOTFORM URL
                    className="w-full h-full border-0"
                    title="JotForm Chatbot"
                    loading="lazy"
                  ></iframe>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open chatbot panel"
          >
            <ChevronLeft className="h-4 w-4" />
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
