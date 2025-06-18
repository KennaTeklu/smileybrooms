"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type ChatbotMode = "ai" | "jotform" | "closed"

interface ChatbotContextType {
  mode: ChatbotMode
  isOpen: boolean
  openAiChat: () => void
  openJotformChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ChatbotMode>("closed")
  const [isOpen, setIsOpen] = useState(false)

  const openAiChat = useCallback(() => {
    setMode("ai")
    setIsOpen(true)
  }, [])

  const openJotformChat = useCallback(() => {
    setMode("jotform")
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setMode("closed")
    setIsOpen(false)
  }, [])

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat()
    } else {
      // Default to AI chat when toggling
      openAiChat()
    }
  }, [isOpen, closeChat, openAiChat])

  return (
    <ChatbotContext.Provider
      value={{
        mode,
        isOpen,
        openAiChat,
        openJotformChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider")
  }
  return context
}
