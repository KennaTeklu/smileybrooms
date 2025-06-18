"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, Bot, HelpCircle, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AdvancedSidePanel } from "./sidepanel/advanced-sidepanel"
import { useChatbot } from "@/lib/chatbot-context"
import { usePanelManager } from "@/lib/panel-manager-context"

interface JotFormChatbotEmbedProps {
  onLoad?: () => void
}

function JotFormChatbotEmbed({ onLoad }: JotFormChatbotEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    iframe.addEventListener("load", handleLoad)
    return () => iframe.removeEventListener("load", handleLoad)
  }, [onLoad])

  return (
    <div className="h-full w-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading support chat...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="https://form.jotform.com/embed/019727f88b017b95a6ff71f7fdcc58538ab4?skipWelcome=1&maximizable=1&autoOpen=0"
        className="w-full h-full border-0 rounded-lg"
        title="Customer Support Chat"
        allow="camera; microphone; geolocation"
        style={{ minHeight: "400px" }}
      />
    </div>
  )
}

function AiChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">AI Assistant Ready</h3>
              <p className="text-sm">Ask me anything about our cleaning services!</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              Error: {error.message}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            className="flex-1"
            value={input}
            placeholder="Ask about our cleaning services..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function UnifiedChatbot() {
  const { mode, isOpen, closeChat, openAiChat, openJotformChat } = useChatbot()
  const { registerPanel, unregisterPanel } = usePanelManager()
  const [activeTab, setActiveTab] = useState("ai")

  useEffect(() => {
    if (isOpen) {
      registerPanel("chatbot", 45) // Higher than cart (40) but lower than settings (50)
    } else {
      unregisterPanel("chatbot")
    }

    return () => unregisterPanel("chatbot")
  }, [isOpen, registerPanel, unregisterPanel])

  // Sync active tab with mode
  useEffect(() => {
    if (mode === "ai") setActiveTab("ai")
    else if (mode === "jotform") setActiveTab("support")
  }, [mode])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "ai") {
      openAiChat()
    } else if (value === "support") {
      openJotformChat()
    }
  }

  if (!isOpen) return null

  return (
    <AdvancedSidePanel
      isOpen={isOpen}
      onClose={closeChat}
      title="Chat Assistant"
      subtitle="Get help with your cleaning needs"
      width="lg"
      position="right"
      className="chatbot-panel"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Live Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="flex-1 mt-0">
          <AiChatInterface />
        </TabsContent>

        <TabsContent value="support" className="flex-1 mt-0">
          <div className="h-full">
            <JotFormChatbotEmbed />
          </div>
        </TabsContent>
      </Tabs>
    </AdvancedSidePanel>
  )
}
