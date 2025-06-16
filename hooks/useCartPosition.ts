"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CartPositionOptions {
  bottomPadding?: number // How far from the bottom of the document it should stop
  initialViewportTopOffset?: number // How far from the top of the viewport it initially appears
  rightOffset?: number // Right padding from viewport/document edge
  leftOffset?: number // Left padding from viewport/document edge
}

export function useCartPosition(options: CartPositionOptions = {}) {
  const {
    bottomPadding = 20, // Default bottom padding from document end
    initialViewportTopOffset = 20, // Default initial offset from viewport top
    rightOffset = 20, // Default right padding
    leftOffset, // Default left padding
  } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState<{
    position: "absolute"
    top?: number | string
    bottom?: number | string
    right?: number | string
    left?: number | string
    transition?: string
  }>({
    position: "absolute",
    transition: "all 0.3s ease-out", // Smooth transitions for position changes
  })

  const calculatePosition = useCallback(() => {
    if (!elementRef.current) return

    const elementHeight = elementRef.current.offsetHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollY = window.scrollY

    // Calculate desired top position if it were to follow scroll
    const desiredTopFromScroll = scrollY + initialViewportTopOffset

    // Calculate the maximum top position to stick to the bottom of the document
    const maxTopAtDocumentBottom = documentHeight - elementHeight - bottomPadding

    // The final top position is the minimum of (following scroll) and (sticking to document bottom)
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setStyles({
      position: "absolute",
      top: `${finalTop}px`,
      right: rightOffset !== undefined ? `${rightOffset}px` : undefined,
      left: leftOffset !== undefined ? `${leftOffset}px` : undefined,
      transition: "all 0.3s ease-out",
    })
  }, [bottomPadding, initialViewportTopOffset, rightOffset, leftOffset])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })
    window.addEventListener("orientationchange", handleScrollAndResize, { passive: true })

    // Initial check, with a slight delay to ensure element height is available
    const timeoutId = setTimeout(calculatePosition, 0)

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
      window.removeEventListener("orientationchange", handleScrollAndResize)
      clearTimeout(timeoutId)
    }
  }, [calculatePosition])

  return {
    elementRef,
    styles,
    calculatePosition,
  }
}
