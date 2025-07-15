"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ClientOnlyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Renders its children only on the client-side.
 * Useful for components that rely on browser-specific APIs (e.g., window, localStorage)
 * or that should not be rendered during server-side rendering (SSR).
 *
 * @param {React.ReactNode} children - The components to render on the client.
 * @param {React.ReactNode} [fallback=null] - Optional fallback content to render on the server.
 */
export default function ClientOnlyWrapper({ children, fallback = null }: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return <>{children}</>
}
