"use client"

import { useState, useEffect } from "react"
import {
  isAndroid,
  isIOS,
  isMobile,
  isTablet,
  isWindows,
  isMacOs,
  isChrome,
  isFirefox,
  isSafari,
  isOpera,
  isEdge,
  browserVersion,
  osVersion,
  mobileVendor,
  mobileModel,
} from "react-device-detect"

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown"
export type OSType = "ios" | "android" | "windows" | "macos" | "linux" | "unknown"
export type BrowserType = "chrome" | "firefox" | "safari" | "edge" | "opera" | "unknown"

export interface DeviceInfo {
  // Device type
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean

  // Operating system
  os: OSType
  osVersion: string
  isIOS: boolean
  isAndroid: boolean
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean

  // Browser
  browser: BrowserType
  browserVersion: string
  isChrome: boolean
  isFirefox: boolean
  isSafari: boolean
  isEdge: boolean
  isOpera: boolean

  // Mobile specific
  mobileVendor: string
  mobileModel: string

  // Screen
  screenWidth: number
  screenHeight: number
  isLandscape: boolean
  isPortrait: boolean

  // Connection
  isOnline: boolean
  connectionType: string
  effectiveConnectionType: string

  // Recommended download
  recommendedDownload: "ios" | "android" | "macos" | "windows" | "linux" | null
}

export function useEnhancedDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    // Default values
    type: "unknown",
    isMobile: false,
    isTablet: false,
    isDesktop: false,

    os: "unknown",
    osVersion: "",
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,

    browser: "unknown",
    browserVersion: "",
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isEdge: false,
    isOpera: false,

    mobileVendor: "",
    mobileModel: "",

    screenWidth: 0,
    screenHeight: 0,
    isLandscape: false,
    isPortrait: true,

    isOnline: true,
    connectionType: "unknown",
    effectiveConnectionType: "unknown",

    recommendedDownload: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // Determine device type
    const isTabletDevice = isTablet
    const isMobileDevice = isMobile && !isTabletDevice
    const isDesktopDevice = !isMobileDevice && !isTabletDevice

    let deviceType: DeviceType = "unknown"
    if (isTabletDevice) deviceType = "tablet"
    else if (isMobileDevice) deviceType = "mobile"
    else if (isDesktopDevice) deviceType = "desktop"

    // Determine OS
    let osType: OSType = "unknown"
    if (isIOS) osType = "ios"
    else if (isAndroid) osType = "android"
    else if (isWindows) osType = "windows"
    else if (isMacOs) osType = "macos"
    else if (!isIOS && !isAndroid && !isWindows && !isMacOs) osType = "linux"

    // Determine browser
    let browserType: BrowserType = "unknown"
    if (isChrome) browserType = "chrome"
    else if (isFirefox) browserType = "firefox"
    else if (isSafari) browserType = "safari"
    else if (isEdge) browserType = "edge"
    else if (isOpera) browserType = "opera"

    // Screen information
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const isLandscapeOrientation = screenWidth > screenHeight
    const isPortraitOrientation = !isLandscapeOrientation

    // Connection information
    const isOnlineStatus = navigator.onLine
    let connectionType = "unknown"
    let effectiveConnectionType = "unknown"

    // @ts-ignore - Navigator connection API
    if (navigator.connection) {
      // @ts-ignore
      connectionType = navigator.connection.type || "unknown"
      // @ts-ignore
      effectiveConnectionType = navigator.connection.effectiveType || "unknown"
    }

    // Determine recommended download
    let recommendedDownloadType = null
    if (isIOS) recommendedDownloadType = "ios"
    else if (isAndroid) recommendedDownloadType = "android"
    else if (isMacOs) recommendedDownloadType = "macos"
    else if (isWindows) recommendedDownloadType = "windows"
    else if (!isIOS && !isAndroid && !isMacOs && !isWindows) recommendedDownloadType = "linux"

    setDeviceInfo({
      type: deviceType,
      isMobile: isMobileDevice,
      isTablet: isTabletDevice,
      isDesktop: isDesktopDevice,

      os: osType,
      osVersion: osVersion || "",
      isIOS,
      isAndroid,
      isWindows,
      isMacOS: isMacOs,
      isLinux: !isIOS && !isAndroid && !isWindows && !isMacOs,

      browser: browserType,
      browserVersion: browserVersion || "",
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      isOpera,

      mobileVendor: mobileVendor || "",
      mobileModel: mobileModel || "",

      screenWidth,
      screenHeight,
      isLandscape: isLandscapeOrientation,
      isPortrait: isPortraitOrientation,

      isOnline: isOnlineStatus,
      connectionType,
      effectiveConnectionType,

      recommendedDownload: recommendedDownloadType,
    })
  }, [])

  return deviceInfo
}
