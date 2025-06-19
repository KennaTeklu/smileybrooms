"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useState, useEffect } from "react"

type DeviceType = "mobile" | "tablet" | "desktop" | "unknown"
type OSType = "ios" | "android" | "windows" | "macos" | "linux" | "unknown"

interface DeviceInfo {
  type: DeviceType
  os: OSType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: "unknown",
    os: "unknown",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const ua = navigator.userAgent

    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
    const isDesktop = !isMobile || isTablet

    // Detect OS
    const isIOS = /iPhone|iPad|iPod/i.test(ua)
    const isAndroid = /Android/i.test(ua)
    const isWindows = /Windows NT/i.test(ua)
    const isMacOS = /Macintosh/i.test(ua) && !isIOS
    const isLinux = /Linux/i.test(ua) && !isAndroid

    // Determine device type
    let type: DeviceType = "unknown"
    if (isTablet) type = "tablet"
    else if (isMobile) type = "mobile"
    else if (isDesktop) type = "desktop"

    // Determine OS
    let os: OSType = "unknown"
    if (isIOS) os = "ios"
    else if (isAndroid) os = "android"
    else if (isWindows) os = "windows"
    else if (isMacOS) os = "macos"
    else if (isLinux) os = "linux"

    setDeviceInfo({
      type,
      os,
      isMobile: isMobile && !isTablet,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      isWindows,
      isMacOS,
      isLinux,
    })
  }, [])

  return deviceInfo
}
