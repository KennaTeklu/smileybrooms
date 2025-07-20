"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageSquare, ChevronDown } from "lucide-react"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"

export function CollapsibleChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "bot"; text: string }[]>([])
  const expandedPanelRef = useRef<HTMLDivElement>(null)
  const collapsedButtonRef = useRef<HTMLButtonElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useClickOutside(expandedPanelRef, (event) => {
    if (collapsedButtonRef.current && collapsedButtonRef.current.contains(event.target as Node)) {
      return // Don't close if the click was on the button itself
    }
    setIsOpen(false)
  })

  useKeyboardShortcuts({
    "alt+c": () => setIsOpen((prev) => !prev),
    Escape: () => setIsOpen(false),
  })

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatHistory])

  const handleSendMessage = async () => {
    if (message.trim() === "") return

    const userMessage = { role: "user", text: message.trim() }
    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate bot response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: `Hello! You said: "${userMessage.text}". How can I assist you further?` },
      ])
    }, 1000)
  }

  if (!isMounted) return null

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="expanded-chatbot"
          ref={expandedPanelRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 m-auto w-[calc(100vw-2rem)] max-w-2xl bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-green-200/50 dark:border-green-800/50 z-20 max-h-[90vh] flex flex-col"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)",
          }}
        >
          <div className="bg-gradient-to-b from-green-600 via-green-700 to-green-800 text-white p-5 border-b border-green-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Chat Support</h2>
                <p className="text-green-100 text-sm">We're here to help!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
              aria-label="Collapse chatbot panel"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">Start a conversation!</div>
              )}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    msg.role === "user"
                      ? "bg-blue-500 text-white ml-auto rounded-br-none"
                      : "bg-gray-200 text-gray-800 mr-auto rounded-bl-none dark:bg-gray-700 dark:text-gray-200",
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <Button onClick={handleSendMessage} className="bg-green-600 text-white hover:bg-green-700">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed-chatbot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-10" // Position for collapsed state
        >
          <Button
            ref={collapsedButtonRef}
            variant="outline"
            size="icon"
            className={cn(
              `rounded-full bg-transparent text-white shadow-lg hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-transparent`,
              "w-10 h-10 p-0",
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close chatbot panel" : "Open chatbot panel"}
            aria-expanded={isOpen}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
