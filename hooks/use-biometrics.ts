"use client"

import { useState, useCallback } from "react"

export function useBiometrics() {
  const [isSupported, setIsSupported] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  const checkSupport = useCallback(async () => {
    if (typeof window === "undefined") return false

    try {
      // Check for WebAuthn support
      const supported = !!window.PublicKeyCredential
      setIsSupported(supported)

      if (supported) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setIsAvailable(available)
        return available
      }
    } catch (error) {
      console.error("Biometrics check failed:", error)
    }

    return false
  }, [])

  const authenticate = useCallback(async () => {
    if (!isSupported || !isAvailable) {
      throw new Error("Biometric authentication not available")
    }

    try {
      // Mock biometric authentication
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, userId: "mock-user-id" })
        }, 1000)
      })
    } catch (error) {
      console.error("Biometric authentication failed:", error)
      throw error
    }
  }, [isSupported, isAvailable])

  return {
    isSupported,
    isAvailable,
    checkSupport,
    authenticate,
  }
}
