"use client"

import { useState, useEffect, useCallback } from "react"
import { FEATURE_FLAG_CONFIG } from "@/lib/ab-test-config"

interface FeatureFlagResult {
  isEnabled: boolean
  setValue: (value: boolean) => void
}

export function useFeatureFlag(flagName: string): FeatureFlagResult {
  const config = FEATURE_FLAG_CONFIG[flagName]

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (!config) {
      console.warn(`Feature flag "${flagName}" not found in configuration. Defaulting to false.`)
      return false
    }
    // Try to get from localStorage first for persistence/overrides
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(`feature_flag_${flagName}`)
      if (storedValue !== null) {
        return storedValue === "true"
      }
    }
    return config.defaultValue
  })

  useEffect(() => {
    if (!config) {
      // If config is not found, ensure the flag is false and warn
      setIsEnabled(false)
      return
    }

    // Sync initial state with localStorage if not already set
    if (typeof window !== "undefined" && localStorage.getItem(`feature_flag_${flagName}`) === null) {
      localStorage.setItem(`feature_flag_${flagName}`, String(config.defaultValue))
    }
  }, [flagName, config])

  const setValue = useCallback(
    (value: boolean) => {
      setIsEnabled(value)
      if (typeof window !== "undefined") {
        localStorage.setItem(`feature_flag_${flagName}`, String(value))
      }
      console.log(`Feature flag "${flagName}" set to: ${value}`)
      // In a real scenario, you might send this to an analytics platform
    },
    [flagName],
  )

  return { isEnabled, setValue }
}
