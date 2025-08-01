"use client"

import { useState, useEffect } from "react"

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>("unknown")

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateConnectionType = () => {
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || "unknown")
      }
    }

    // Initial check
    updateOnlineStatus()
    updateConnectionType()

    // Event listeners
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener("change", updateConnectionType)
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      if (connection) {
        connection.removeEventListener("change", updateConnectionType)
      }
    }
  }, [])

  return {
    isOnline,
    connectionType,
  }
}
