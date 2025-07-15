"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatbotAnalytics } from "@/hooks/use-chatbot-analytics" // Assuming this hook exists

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

interface ChatbotManagerProps {
  apiEndpoint: string
  welcomeMessage: string
}

export default function ChatbotManager({ apiEndpoint, welcomeMessage }: ChatbotManagerProps) {
  const [messages, setMessages] = useState<Message[]>([{ id: "welcome", text: welcomeMessage, sender: "bot" }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackChatbotEvent } = useChatbotAnalytics()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    trackChatbotEvent("user_message_sent", { message: input })
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const botMessage: Message = { id: Date.now().toString() + "-bot", text: data.response, sender: "bot" }
      setMessages((prev) => [...prev, botMessage])
      trackChatbotEvent("bot_response_received", { response: data.response })
    } catch (error) {
      console.error("Error sending message to chatbot API:", error)
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      }
      setMessages((prev) => [...prev, errorMessage])
      trackChatbotEvent("chatbot_error", { error: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-logo.png" alt="Bot Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-logo.png" alt="Bot Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex p-4 border-t dark:border-gray-700">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow mr-2"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
