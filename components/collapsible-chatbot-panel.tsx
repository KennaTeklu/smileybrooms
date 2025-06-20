"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Send, Mic, MicOff, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useChat } from "ai/react"
import { usePathname } from "next/navigation"

export function CollapsibleChatbotPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { currentPage: pathname },
  })

  const minTopOffset = 20
  const initialScrollOffset = 50
  const bottomPageMargin = 20

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  useEffect(() => {
    if (!isMounted || isScrollPaused) return

    const updatePositionAndHeight = () => {
      setScrollPosition(window.scrollY)
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight)
      }
    }

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight()

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused])

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

  if (!isMounted) return null

  const documentHeight = document.documentElement.scrollHeight
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin
  const panelTopPosition = isScrollPaused
    ? `${Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))}px`
    : `${Math.max(minTopOffset, Math.min(window.scrollY + initialScrollOffset, maxPanelTop))}px`

  return (
    <div ref={panelRef} className="fixed left-0 z-[999] flex" style={{ top: panelTopPosition }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-r-lg shadow-lg overflow-hidden border-r border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
                {isScrollPaused && (
                  <Badge variant="secondary" className="text-xs">
                    Fixed
                  </Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse chatbot panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-[400px] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <div className="text-sm p-3 bg-muted/50 rounded-lg">
                      Hi! I'm your SmileyBrooms AI assistant. How can I help you today?
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] p-3 rounded-lg text-sm ${
                          m.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                <Input
                  className="flex-1"
                  value={input}
                  placeholder="Ask me anything..."
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setIsListening(!isListening)}
                  disabled={isLoading}
                  className={isListening ? "bg-red-100 border-red-300" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
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
            className="flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900 rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-t border-b border-gray-200 dark:border-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">AI</span>
            {messages.length > 0 && (
              <Badge className="ml-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                {messages.length}
              </Badge>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
