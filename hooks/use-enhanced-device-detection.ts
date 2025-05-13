"use client"

import { useState, useEffect } from "react"

interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop" | "unknown"
  os: "ios" | "android" | "macos" | "windows" | "linux" | "unknown"
  osVersion: string | null
  browser: "chrome" | "firefox" | "safari" | "edge" | "opera" | "unknown"
  browserVersion: string | null
  recommendedDownload: "ios" | "android" | "macos" | "windows" | "linux" | null
}

export function useEnhancedDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: "unknown",
    os: "unknown",
    osVersion: null,
    browser: "unknown",
    browserVersion: null,
    recommendedDownload: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase()
    let type: DeviceInfo["type"] = "unknown"
    let os: DeviceInfo["os"] = "unknown"
    let osVersion: string | null = null
    let browser: DeviceInfo["browser"] = "unknown"
    let browserVersion: string | null = null
    let recommendedDownload: DeviceInfo["recommendedDownload"] = null

    // Detect device type
    if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
      type = "tablet"
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) {
      type = "mobile"
    } else {
      type = "desktop"
    }

    // Detect OS
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      os = "ios"
      const match = userAgent.match(/os (\d+)_(\d+)/)
      if (match) {
        osVersion = `${match[1]}.${match[2]}`
      }
      recommendedDownload = "ios"
    } else if (/android/i.test(userAgent)) {
      os = "android"
      const match = userAgent.match(/android (\d+)\.(\d+)/)
      if (match) {
        osVersion = `${match[1]}.${match[2]}`
      }
      recommendedDownload = "android"
    } else if (/mac os x/i.test(userAgent)) {
      os = "macos"
      const match = userAgent.match(/mac os x (\d+)[._](\d+)/)
      if (match) {
        osVersion = `${match[1]}.${match[2]}`
      }
      recommendedDownload = "macos"
    } else if (/windows/i.test(userAgent)) {
      os = "windows"
      const match = userAgent.match(/windows nt (\d+)\.(\d+)/)
      if (match) {
        const version = Number.parseFloat(`${match[1]}.${match[2]}`)
        if (version >= 10) {
          osVersion = "10+"
        } else if (version >= 6.3) {
          osVersion = "8.1"
        } else if (version >= 6.2) {
          osVersion = "8"
        } else if (version >= 6.1) {
          osVersion = "7"
        } else {
          osVersion = "Legacy"
        }
      }
      recommendedDownload = "windows"
    } else if (/linux/i.test(userAgent)) {
      os = "linux"
      recommendedDownload = "linux"
    }

    // Detect browser
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
      browser = "chrome"
      const match = userAgent.match(/chrome\/(\d+)\.(\d+)/)
      if (match) {
        browserVersion = match[1]
      }
    } else if (/firefox/i.test(userAgent)) {
      browser = "firefox"
      const match = userAgent.match(/firefox\/(\d+)\.(\d+)/)
      if (match) {
        browserVersion = match[1]
      }
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
      browser = "safari"
      const match = userAgent.match(/version\/(\d+)\.(\d+)/)
      if (match) {
        browserVersion = match[1]
      }
    } else if (/edg/i.test(userAgent)) {
      browser = "edge"
      const match = userAgent.match(/edg\/(\d+)\.(\d+)/)
      if (match) {
        browserVersion = match[1]
      }
    } else if (/opera|opr/i.test(userAgent)) {
      browser = "opera"
      const match = userAgent.match(/(?:opera|opr)\/(\d+)\.(\d+)/)
      if (match) {
        browserVersion = match[1]
      }
    }

    setDeviceInfo({
      type,
      os,
      osVersion,
      browser,
      browserVersion,
      recommendedDownload,
    })
  }, [])

  return deviceInfo
}
