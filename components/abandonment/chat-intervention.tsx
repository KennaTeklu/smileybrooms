"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface ChatInterventionProps {
  isOpen: boolean
  onClose: () => void
  onContinueBooking: () => void
}

export function ChatIntervention({ isOpen, onClose, onContinueBooking }: ChatInterventionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (isOpen && !isExpanded) {
      // Initial state - just show the chat bubble
      setTimeout(() => {
        // Auto-expand after a delay
        setIsExpanded(true)
      }, 1000)
    }

    if (isExpanded && messages.length === 0) {
      // Send initial message
      setTimeout(() => {
        setMessages([
          {
            text: "Hi there! I noticed you're looking at our cleaning services. Can I help you with anything?",
            isUser: false,
          },
        ])
      }, 500)
    }
  }, [isOpen, isExpanded, messages.length])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }])
    setInputValue("")

    // Simulate response
    setTimeout(() => {
      let response = ""

      if (inputValue.toLowerCase().includes("price") || inputValue.toLowerCase().includes("cost")) {
        response = "Our prices start at $89 for a standard cleaning. I can offer you 15% off your first booking today!"
      } else if (inputValue.toLowerCase().includes("time") || inputValue.toLowerCase().includes("schedule")) {
        response = "We have availability as soon as tomorrow! Would you like to see the available time slots?"
      } else {
        response =
          "I'd be happy to help you complete your booking. Would you like me to apply a special discount to your order?"
      }

      setMessages((prev) => [...prev, { text: response, isUser: false }])

      // Add action buttons after response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Would you like to continue with your booking?",
            isUser: false,
          },
        ])
      }, 1000)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-xl border-blue-200">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <img src="/smiling-support-agent.png" alt="Support Agent" />
              </Avatar>
              <span className="font-medium">Sarah - Cleaning Expert</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-blue-700 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3 h-64 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.isUser ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-white border border-gray-200"
                } rounded-lg p-3 max-w-[80%]`}
              >
                {message.text}
              </div>
            ))}

            {messages.length > 0 && messages[messages.length - 1].text.includes("continue with your booking") && (
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                  No thanks
                </Button>
                <Button size="sm" onClick={onContinueBooking} className="bg-blue-600 hover:bg-blue-700 text-xs">
                  Yes, continue booking
                </Button>
              </div>
            )}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
              Send
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
