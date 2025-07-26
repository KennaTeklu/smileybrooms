"use client"

import { useState, useEffect } from "react"

export type DeviceType = "ios" | "android" | "desktop"

export interface DeviceInfo {
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsApplePay: boolean
  supportsGooglePay: boolean
  userAgent: string
}

export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop"

  const userAgent = window.navigator.userAgent.toLowerCase()

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios"
  }

  if (/android/.test(userAgent)) {
    return "android"
  }

  return "desktop"
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /android/.test(window.navigator.userAgent.toLowerCase())
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(window.navigator.userAgent)
}

export function isTablet(): boolean {
  if (typeof window === "undefined") return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /ipad/.test(userAgent) || (/android/.test(userAgent) && !/mobile/.test(userAgent))
}

export function supportsApplePay(): boolean {
  if (typeof window === "undefined") return false
  return isIOS() && "ApplePaySession" in window && (window as any).ApplePaySession?.canMakePayments()
}

export function supportsGooglePay(): boolean {
  if (typeof window === "undefined") return false
  return "PaymentRequest" in window
}

export function getDeviceInfo(): DeviceInfo {
  const type = getDeviceType()
  const mobile = isMobile()
  const tablet = isTablet()

  return {
    type,
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: !mobile && !tablet,
    supportsApplePay: supportsApplePay(),
    supportsGooglePay: supportsGooglePay(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
  }
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => ({
    type: "desktop",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    supportsApplePay: false,
    supportsGooglePay: false,
    userAgent: "",
  }))

  useEffect(() => {
    setDeviceInfo(getDeviceInfo())
  }, [])

  return deviceInfo
}
