"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
}

/**
 * Renders its children only on the client side.
 * Useful for components that rely on browser-specific APIs or
 * should not be rendered during server-side rendering (SSR).
 */
export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
