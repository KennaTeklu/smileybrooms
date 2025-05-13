"use client"

import type { ComponentType } from "react"

interface WithSafeDataProps {
  [key: string]: any
}

// This Higher Order Component checks for undefined values
// and provides fallbacks to prevent "Cannot read properties of undefined" errors
export function withSafeData<P extends WithSafeDataProps>(Component: ComponentType<P>, defaultProps: Partial<P> = {}) {
  const SafeComponent = (props: P) => {
    // Merge default props with actual props
    const safeProps = { ...defaultProps, ...props } as P

    // Filter out any unsafe values that might cause length errors
    const processedProps = Object.entries(safeProps).reduce(
      (acc, [key, value]) => {
        // If value is undefined or null and is expected to have length property
        // (like strings or arrays), provide a safe default
        if (value === undefined || value === null) {
          if (typeof defaultProps[key] === "string") {
            acc[key] = ""
          } else if (Array.isArray(defaultProps[key])) {
            acc[key] = []
          } else {
            acc[key] = value
          }
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return <Component {...(processedProps as P)} />
  }

  SafeComponent.displayName = `WithSafeData(${Component.displayName || Component.name || "Component"})`
  return SafeComponent
}
