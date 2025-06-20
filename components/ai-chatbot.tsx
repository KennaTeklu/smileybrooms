"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Settings } from "lucide-react"
import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/lib/accessibility-context"

export default function AiChatbot() {
  const { theme } = useTheme()
  const { preferences } = useAccessibility()

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      userPreferences: {
        theme,
        ...preferences,
      },
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message that acknowledges user preferences
  const getWelcomeMessage = () => {
    const accessibilityFeatures = []
    if (preferences.screenReader) accessibilityFeatures.push("screen reader support")
    if (preferences.highContrast) accessibilityFeatures.push("high contrast mode")
    if (preferences.largeText) accessibilityFeatures.push("large text")
    if (preferences.keyboardOnly) accessibilityFeatures.push("keyboard navigation")

    if (accessibilityFeatures.length > 0) {
      return `Hi! I'm your SmileyBrooms AI assistant. I notice you have ${accessibilityFeatures.join(", ")} enabled. I'll make sure my responses are tailored to your accessibility preferences. How can I help you today?`
    }

    return "Hi! I'm your SmileyBrooms AI assistant. How can I help you with your cleaning needs today?"
  }

  return (
    <Card className="w-80 h-[400px] flex flex-col shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground p-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          AI Assistant
          {(preferences.screenReader || preferences.highContrast || preferences.largeText) && (
            <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded">Accessibility Aware</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-4 p-3 bg-muted/50 rounded-lg">
                {getWelcomeMessage()}
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] p-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-blue-500 text-white"
                      : preferences.highContrast
                        ? "bg-black text-white border border-white"
                        : "bg-gray-200 text-gray-800"
                  } ${preferences.largeText ? "text-base" : "text-sm"}`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`max-w-[75%] p-2 rounded-lg flex items-center ${
                    preferences.highContrast ? "bg-black text-white border border-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {preferences.screenReader ? "Processing your request..." : "Thinking..."}
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2 p-2 bg-red-50 rounded-lg">
                <strong>Error:</strong> {error.message}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <Input
          className={`flex-1 ${preferences.largeText ? "text-base" : ""}`}
          value={input}
          placeholder={preferences.screenReader ? "Type your message here" : "Say something..."}
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  )
}
