"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ChevronLeft, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react" // [^3]

export function CollapsibleChatbotPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chatbot", // Pointing to our new API route
  }) // [^3]

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

  // Scroll to the bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
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
                  AI Chatbot
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
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn("mb-4 max-w-[80%]", m.role === "user" ? "ml-auto text-right" : "mr-auto text-left")}
                    >
                      <span
                        className={cn(
                          "inline-block p-2 rounded-lg",
                          m.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white",
                        )}
                      >
                        {m.content}
                      </span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-left mb-4">
                      <span className="inline-block p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                        AI is typing...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={onSubmit} className="flex w-full space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <X className="h-4 w-4" onClick={stop} /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
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
