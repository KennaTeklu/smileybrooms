"use client"

import { useState, useCallback } from "react"

interface BiometricAuthResult {
  success: boolean
  error?: string
}

export function useBiometrics() {
  const [isSupported, setIsSupported] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const checkSupport = useCallback(async () => {
    if (typeof window !== "undefined" && "PublicKeyCredential" in window) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setIsSupported(available)
        return available
      } catch (error) {
        console.warn("Biometric support check failed:", error)
        return false
      }
    }
    return false
  }, [])

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!isSupported) {
      return { success: false, error: "Biometric authentication not supported" }
    }

    setIsAuthenticating(true)

    try {
      // Mock biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, you would use WebAuthn API
      const success = Math.random() > 0.1 // 90% success rate for demo

      setIsAuthenticating(false)

      if (success) {
        return { success: true }
      } else {
        return { success: false, error: "Authentication failed" }
      }
    } catch (error) {
      setIsAuthenticating(false)
      return { success: false, error: "Authentication error" }
    }
  }, [isSupported])

  return {
    isSupported,
    isAuthenticating,
    checkSupport,
    authenticate,
  }
}
