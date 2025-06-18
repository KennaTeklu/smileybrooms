"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  quickReplies?: string[]
}

const quickReplies = [
  "What services do you offer?",
  "How much does cleaning cost?",
  "How do I book a service?",
  "What areas do you serve?",
  "Do you bring your own supplies?",
]

const responses: Record<string, { text: string; quickReplies?: string[] }> = {
  "what services do you offer?": {
    text: "We offer comprehensive cleaning services including:\n• Regular house cleaning\n• Deep cleaning\n• Move-in/move-out cleaning\n• Office cleaning\n• Post-construction cleanup\n• Window cleaning\n\nAll services are customizable to your needs!",
    quickReplies: ["How much does it cost?", "How do I book?", "What's included?"],
  },
  "how much does cleaning cost?": {
    text: "Our pricing is competitive and depends on:\n• Size of your space\n• Type of cleaning needed\n• Frequency of service\n• Special requirements\n\nBasic cleaning starts at $80. Use our price calculator for an accurate quote!",
    quickReplies: ["Get a quote", "What's included?", "Any discounts?"],
  },
  "how do i book a service?": {
    text: "Booking is easy! You can:\n• Use our online booking form\n• Call us at (602) 800-0605\n• Chat with us here\n\nWe'll confirm your appointment within 24 hours and send you all the details.",
    quickReplies: ["What info do you need?", "How far in advance?", "Can I reschedule?"],
  },
  "what areas do you serve?": {
    text: "We proudly serve the Phoenix metropolitan area including:\n• Phoenix\n• Scottsdale\n• Tempe\n• Mesa\n• Chandler\n• Glendale\n• Peoria\n\nNot sure if we serve your area? Just ask!",
    quickReplies: ["Do you serve my zip code?", "Travel fees?", "Service hours?"],
  },
  "do you bring your own supplies?": {
    text: "Yes! We bring all necessary cleaning supplies and equipment including:\n• Eco-friendly cleaning products\n• Professional-grade equipment\n• Microfiber cloths and mops\n• Vacuum cleaners\n\nYou don't need to provide anything - just relax while we clean!",
    quickReplies: ["Are products safe?", "What if I have allergies?", "Green cleaning?"],
  },
}

export function UnifiedChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm here to help with any questions about our cleaning services. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      quickReplies: quickReplies,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): { text: string; quickReplies?: string[] } => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for exact matches first
    if (responses[lowerMessage]) {
      return responses[lowerMessage]
    }

    // Check for partial matches
    if (lowerMessage.includes("service") || lowerMessage.includes("clean")) {
      return responses["what services do you offer?"]
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("much")) {
      return responses["how much does cleaning cost?"]
    }
    if (lowerMessage.includes("book") || lowerMessage.includes("schedule") || lowerMessage.includes("appointment")) {
      return responses["how do i book a service?"]
    }
    if (lowerMessage.includes("area") || lowerMessage.includes("location") || lowerMessage.includes("serve")) {
      return responses["what areas do you serve?"]
    }
    if (lowerMessage.includes("supply") || lowerMessage.includes("bring") || lowerMessage.includes("equipment")) {
      return responses["do you bring your own supplies?"]
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return {
        text: "Hello! Welcome to Smiley Brooms! I'm here to help you with any questions about our professional cleaning services. What would you like to know?",
        quickReplies: quickReplies,
      }
    }
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return {
        text: "You're very welcome! Is there anything else I can help you with today?",
        quickReplies: ["Book a service", "Get a quote", "Contact info"],
      }
    }

    // Default response
    return {
      text: "I'd be happy to help! You can ask me about our services, pricing, booking process, or anything else related to our cleaning services. You can also call us directly at (602) 800-0605.",
      quickReplies: quickReplies,
    }
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const response = generateResponse(text)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          quickReplies: response.quickReplies,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-primary text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Smiley Brooms Chat</h3>
                  <p className="text-xs opacity-90">We're here to help!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={cn("flex", message.isUser ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line",
                        message.isUser
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                      )}
                    >
                      {message.text}
                    </div>
                  </div>

                  {/* Quick Replies */}
                  {message.quickReplies && !message.isUser && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(inputValue)
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>(602) 800-0605</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
