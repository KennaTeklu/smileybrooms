"use client"

import { useState, useCallback } from "react"

export function useWebAuthn() {
  const [isSupported, setIsSupported] = useState(false)

  const checkSupport = useCallback(() => {
    const supported = typeof window !== "undefined" && !!window.PublicKeyCredential
    setIsSupported(supported)
    return supported
  }, [])

  const register = useCallback(
    async (username: string) => {
      if (!isSupported) {
        throw new Error("WebAuthn not supported")
      }

      try {
        // Mock registration - replace with your server implementation
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: {
              name: "SmileyBrooms",
              id: window.location.hostname,
            },
            user: {
              id: new TextEncoder().encode(username),
              name: username,
              displayName: username,
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
            },
            timeout: 60000,
            attestation: "direct",
          },
        })

        return credential
      } catch (error) {
        console.error("WebAuthn registration failed:", error)
        throw error
      }
    },
    [isSupported],
  )

  const authenticate = useCallback(async () => {
    if (!isSupported) {
      throw new Error("WebAuthn not supported")
    }

    try {
      // Mock authentication - replace with your server implementation
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "required",
        },
      })

      return assertion
    } catch (error) {
      console.error("WebAuthn authentication failed:", error)
      throw error
    }
  }, [isSupported])

  return {
    isSupported,
    checkSupport,
    register,
    authenticate,
  }
}
