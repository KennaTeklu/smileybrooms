"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { useDeviceDetection } from "@/lib/device-detection"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

type ThemeProviderState = {
  theme: string
  deviceType: string
  setTheme: (theme: string) => void
  applyDeviceSpecificStyles: () => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  deviceType: "unknown",
  setTheme: () => null,
  applyDeviceSpecificStyles: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProviderEnhanced({
  children,
  defaultTheme = "system",
  storageKey = "smileybrooms-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(defaultTheme)
  const deviceInfo = useDeviceDetection()

  // Apply device-specific CSS variables
  const applyDeviceSpecificStyles = () => {
    const root = document.documentElement

    // Reset all device-specific classes
    root.classList.remove("ios-device", "android-device", "desktop-device")

    // Apply device-specific class
    if (deviceInfo.isIOS) {
      root.classList.add("ios-device")
      // iOS specific variables
      root.style.setProperty("--primary-font", "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif")
      root.style.setProperty("--border-radius-button", "8px")
      root.style.setProperty("--animation-curve", "cubic-bezier(0.25, 0.1, 0.25, 1)")
    } else if (deviceInfo.isAndroid) {
      root.classList.add("android-device")
      // Android specific variables
      root.style.setProperty("--primary-font", "'Roboto', 'Noto Sans', sans-serif")
      root.style.setProperty("--border-radius-button", "4px")
      root.style.setProperty("--animation-curve", "cubic-bezier(0.4, 0.0, 0.2, 1)")
    } else {
      root.classList.add("desktop-device")
      // Desktop specific variables
      root.style.setProperty("--primary-font", "Inter, system-ui, sans-serif")
      root.style.setProperty("--border-radius-button", "6px")
      root.style.setProperty("--animation-curve", "cubic-bezier(0.16, 1, 0.3, 1)")
    }
  }

  useEffect(() => {
    applyDeviceSpecificStyles()
  }, [deviceInfo.type])

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        deviceType: deviceInfo.type,
        setTheme,
        applyDeviceSpecificStyles,
      }}
    >
      <NextThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem storageKey={storageKey} {...props}>
        {children}
      </NextThemeProvider>
    </ThemeProviderContext.Provider>
  )
}

export const useThemeEnhanced = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useThemeEnhanced must be used within a ThemeProviderEnhanced")

  return context
}
