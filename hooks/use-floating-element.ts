"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import {
  FloatingElementManager,
  type FloatingElementConfig,
  getFloatingStyles,
  getFloatingAnimationVariants,
} from "@/lib/floating-system"

interface UseFloatingElementOptions extends Partial<FloatingElementConfig> {
  id: string
  elementHeight?: number
  dependencies?: any[]
}

export function useFloatingElement({
  id,
  elementHeight = 60,
  dependencies = [],
  ...configOverrides
}: UseFloatingElementOptions) {
  const [isVisible, setIsVisible] = useState(true)
  const [config, setConfig] = useState<FloatingElementConfig | null>(null)
  const [calculatedPosition, setCalculatedPosition] = useState<ReturnType<
    FloatingElementManager["calculatePosition"]
  > | null>(null)
  const pathname = usePathname()
  const manager = FloatingElementManager.getInstance()
  const elementRef = useRef<HTMLElement>(null)

  // Register the floating element
  useEffect(() => {
    const fullConfig = manager.register(id, configOverrides)
    setConfig(fullConfig)

    return () => {
      manager.unregister(id)
    }
  }, [id, ...dependencies])

  // Calculate position based on other floating elements
  useEffect(() => {
    if (config) {
      const position = manager.calculatePosition(id, elementHeight)
      setCalculatedPosition(position)
    }
  }, [config, id, elementHeight, pathname])

  // Handle scroll behavior
  useEffect(() => {
    if (!config?.behavior?.hideOnScroll) return

    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollingDown = currentScrollY > lastScrollY
          const scrollThreshold = 100

          if (scrollingDown && currentScrollY > scrollThreshold) {
            setIsVisible(false)
          } else if (!scrollingDown) {
            setIsVisible(true)
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [config])

  // Handle auto-hide behavior
  useEffect(() => {
    if (!config?.behavior?.autoHide) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, config.behavior.autoHide)

    return () => clearTimeout(timer)
  }, [config])

  // Handle page persistence
  useEffect(() => {
    if (config?.behavior?.persistAcrossPages === false) {
      setIsVisible(true) // Reset visibility on page change
    }
  }, [pathname, config])

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible((prev) => !prev), [])

  const styles = config && calculatedPosition ? getFloatingStyles(config, calculatedPosition) : {}
  const animationVariants = config ? getFloatingAnimationVariants(config) : {}

  return {
    isVisible,
    show,
    hide,
    toggle,
    config,
    styles,
    animationVariants,
    elementRef,
    calculatedPosition,
  }
}
