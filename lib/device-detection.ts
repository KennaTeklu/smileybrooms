"use client"

import { useState, useEffect } from "react"

export type DeviceType = "ios" | "android" | "desktop" | "unknown"

export interface DeviceInfo {
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  preferredTheme: "light" | "dark"
  supportsTouchEvents: boolean
  supportsHapticFeedback: boolean
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: "unknown",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    preferredTheme: "light",
    supportsTouchEvents: false,
    supportsHapticFeedback: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const ua = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMobile = isIOS || isAndroid || /mobi/.test(ua)
    const isTablet = /ipad/.test(ua) || (/android/.test(ua) && !/mobi/.test(ua))
    const isDesktop = !isMobile && !isTablet

    // Determine device type
    let type: DeviceType = "unknown"
    if (isIOS) type = "ios"
    else if (isAndroid) type = "android"
    else if (isDesktop) type = "desktop"

    // Check for dark mode preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Check for touch support
    const supportsTouchEvents = "ontouchstart" in window || navigator.maxTouchPoints > 0

    // Check for haptic feedback support (iOS 13+ or Android)
    const supportsHapticFeedback = (isIOS && Number.parseInt(ua.match(/os (\d+)_/)?.[1] || "0") >= 13) || isAndroid

    setDeviceInfo({
      type,
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      preferredTheme: prefersDark ? "dark" : "light",
      supportsTouchEvents,
      supportsHapticFeedback,
    })
  }, [])

  return deviceInfo
}
