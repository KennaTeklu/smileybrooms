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

import { useCallback } from "react"

export function usePerformanceMonitor() {
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof window === "undefined") return

    const startTime = performance.now()
    fn()
    const endTime = performance.now()
    const duration = endTime - startTime

    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)

    // Send to analytics if needed
    if (window.gtag) {
      window.gtag("event", "timing_complete", {
        name,
        value: Math.round(duration),
      })
    }
  }, [])

  const markStart = useCallback((name: string) => {
    if (typeof window !== "undefined" && performance.mark) {
      performance.mark(`${name}-start`)
    }
  }, [])

  const markEnd = useCallback((name: string) => {
    if (typeof window !== "undefined" && performance.mark && performance.measure) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
  }, [])

  const getMetrics = useCallback(() => {
    if (typeof window === "undefined") return null

    return {
      navigation: performance.getEntriesByType("navigation")[0],
      paint: performance.getEntriesByType("paint"),
      resource: performance.getEntriesByType("resource"),
    }
  }, [])

  return {
    measurePerformance,
    markStart,
    markEnd,
    getMetrics,
  }
}
