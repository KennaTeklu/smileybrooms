"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAccessibility } from "@/lib/accessibility-context"

// Define the shape of our translation messages
interface Messages {
  [key: string]: string | { [key: string]: string }
}

// Define the shape of the translation context
interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string
  currentLanguage: string
  setLanguage: (lang: string) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Load messages dynamically
const loadMessages = async (lang: string): Promise<Messages> => {
  try {
    const module = await import(`../messages/${lang}.ts`)
    return (module as { default: Messages }).default
  } catch (error) {
    console.error(`Failed to load messages for language: ${lang}`, error)
    const fallback = await import(`../messages/en.ts`)
    return (fallback as { default: Messages }).default
  }
}

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreference } = useAccessibility()
  const [messages, setMessages] = useState<Messages>({})
  const currentLanguage = preferences.language || "en"

  useEffect(() => {
    loadMessages(currentLanguage).then(setMessages)
  }, [currentLanguage])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let message: string | { [key: string]: string } | undefined = messages
      const parts = key.split(".")

      for (const part of parts) {
        if (typeof message === "object" && message !== null && part in message) {
          message = (message as Messages)[part]
        } else {
          message = undefined
          break
        }
      }

      if (typeof message === "string") {
        let translated = message
        if (params) {
          for (const [paramKey, paramValue] of Object.entries(params)) {
            translated = translated.replace(`{${paramKey}}`, String(paramValue))
          }
        }
        return translated
      }

      console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`)
      return key // Return the key itself if not found
    },
    [messages, currentLanguage],
  )

  const setLanguage = useCallback(
    (lang: string) => {
      updatePreference("language", lang)
    },
    [updatePreference],
  )

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage }}>{children}</TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
