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

import { useState, useEffect } from "react"

// Hook for exit-intent detection
export const useExitIntent = (callback: () => void) => {
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      // Detect when mouse leaves the top of the viewport
      if (e.clientY < 0) {
        callback()
        // Remove listener after first trigger
        document.removeEventListener("mouseout", handleMouseOut)
      }
    }

    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [callback])
}

// Hook for element hesitation detection
export const useElementHesitation = (selector: string, delay: number, callback: () => void) => {
  useEffect(() => {
    let timer: NodeJS.Timeout
    const element = document.querySelector(selector)

    if (!element) return

    const handleMouseEnter = () => {
      timer = setTimeout(callback, delay)
    }

    const handleMouseLeave = () => {
      clearTimeout(timer)
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
      clearTimeout(timer)
    }
  }, [selector, delay, callback])
}

// Hook for scroll-based triggers
export const useScrollTrigger = (threshold: number, callback: () => void) => {
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (hasTriggered) return

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100

      if (scrollPercent >= threshold) {
        callback()
        setHasTriggered(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [threshold, callback, hasTriggered])
}

// Hook for inactivity detection
export const useInactivityTrigger = (delay: number, callback: () => void) => {
  useEffect(() => {
    let timer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(callback, delay)
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    // Set initial timer
    resetTimer()

    // Reset timer on any user activity
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true)
    })

    return () => {
      clearTimeout(timer)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [delay, callback])
}
