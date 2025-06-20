"use client"

import { useFloating, autoUpdate, offset, flip, shift, hide, arrow, type FloatingContext } from "@floating-ui/react"
import { useRef, useMemo } from "react"

interface UseFloatingUIOptions {
  placement?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | "left" | "right"
  offsetDistance?: number
  enableFlip?: boolean
  enableShift?: boolean
  enableHide?: boolean
  enableArrow?: boolean
  boundary?: Element | null
}

export function useFloatingUI(options: UseFloatingUIOptions = {}) {
  const {
    placement = "top-end",
    offsetDistance = 8,
    enableFlip = true,
    enableShift = true,
    enableHide = true,
    enableArrow = false,
    boundary = null,
  } = options

  const arrowRef = useRef<HTMLDivElement>(null)

  const middleware = useMemo(() => {
    const middlewareArray = [offset(offsetDistance)]

    if (enableFlip) {
      middlewareArray.push(
        flip({
          fallbackPlacements: ["top-start", "bottom-end", "bottom-start", "left", "right"],
          boundary: boundary || undefined,
        }),
      )
    }

    if (enableShift) {
      middlewareArray.push(
        shift({
          padding: 16,
          boundary: boundary || undefined,
        }),
      )
    }

    if (enableHide) {
      middlewareArray.push(
        hide({
          boundary: boundary || undefined,
        }),
      )
    }

    if (enableArrow && arrowRef.current) {
      middlewareArray.push(
        arrow({
          element: arrowRef.current,
          padding: 8,
        }),
      )
    }

    return middlewareArray
  }, [offsetDistance, enableFlip, enableShift, enableHide, enableArrow, boundary])

  const floating = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware,
  })

  const { refs, floatingStyles, context, middlewareData } = floating

  // Calculate arrow position if enabled
  const arrowStyles = useMemo(() => {
    if (!enableArrow || !middlewareData.arrow) return {}

    const { x, y } = middlewareData.arrow
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[floating.placement.split("-")[0]]

    return {
      left: x != null ? `${x}px` : "",
      top: y != null ? `${y}px` : "",
      right: "",
      bottom: "",
      [staticSide as string]: "-4px",
    }
  }, [middlewareData.arrow, floating.placement, enableArrow])

  // Check if element is hidden due to boundary constraints
  const isHidden = middlewareData.hide?.referenceHidden || middlewareData.hide?.escaped

  return {
    ...floating,
    arrowRef,
    arrowStyles,
    isHidden: Boolean(isHidden),
    context: context as FloatingContext,
  }
}
