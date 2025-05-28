"use client"

import { useState, useCallback } from "react"

interface WebAuthnCredential {
  id: string
  type: string
  rawId: ArrayBuffer
}

interface WebAuthnResult {
  success: boolean
  credential?: WebAuthnCredential
  error?: string
}

export function useWebAuthn() {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useState(() => {
    setIsSupported("credentials" in navigator && "create" in navigator.credentials)
  })

  const register = useCallback(
    async (username: string): Promise<WebAuthnResult> => {
      if (!isSupported) {
        return { success: false, error: "WebAuthn not supported" }
      }

      setIsRegistering(true)

      try {
        // Mock registration for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In a real implementation, you would call navigator.credentials.create()
        const mockCredential: WebAuthnCredential = {
          id: `credential_${Date.now()}`,
          type: "public-key",
          rawId: new ArrayBuffer(32),
        }

        setIsRegistering(false)
        return { success: true, credential: mockCredential }
      } catch (error) {
        setIsRegistering(false)
        return { success: false, error: "Registration failed" }
      }
    },
    [isSupported],
  )

  const authenticate = useCallback(async (): Promise<WebAuthnResult> => {
    if (!isSupported) {
      return { success: false, error: "WebAuthn not supported" }
    }

    setIsAuthenticating(true)

    try {
      // Mock authentication for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, you would call navigator.credentials.get()
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
    isRegistering,
    isAuthenticating,
    register,
    authenticate,
  }
}
