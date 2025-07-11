"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"
import { useAccessibility } from "@/lib/accessibility-context"

import enMessages from "../messages/en"
import esMessages from "../messages/es"

type Messages = typeof enMessages
type Language = "en" | "es"

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string
  currentLanguage: Language
  setLanguage: (lang: Language) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Map available languages to their message tables
const MESSAGES: Record<Language, Messages> = {
  en: enMessages,
  es: esMessages,
}

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreference } = useAccessibility()
  const currentLanguage: Language = (preferences.language as Language) || "en"

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const parts = key.split(".")
      // Traverse the nested object safely
      let result: any = MESSAGES[currentLanguage]
      for (const part of parts) {
        result = result?.[part]
        if (result === undefined) break
      }

      if (typeof result === "string") {
        let translated = result
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            translated = translated.replace(`{${k}}`, String(v))
          }
        }
        return translated
      }

      // Fallback: return the key itself
      console.warn(`Missing translation for "${key}" in "${currentLanguage}"`)
      return key
    },
    [currentLanguage],
  )

  const setLanguage = (lang: Language) => {
    updatePreference("language", lang)
  }

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage }}>{children}</TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const ctx = useContext(TranslationContext)
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider")
  return ctx
}
