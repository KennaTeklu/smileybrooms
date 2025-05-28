"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"
import { forceEnableScrolling } from "@/lib/scroll-utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    forceScrollable?: boolean
    showScrollbar?: boolean
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
    orientation?: "vertical" | "horizontal" | "both"
  }
>(
  (
    {
      className,
      children,
      forceScrollable = false,
      showScrollbar = true,
      onScroll,
      orientation = "vertical",
      ...props
    },
    ref,
  ) => {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)
    const [hasOverflow, setHasOverflow] = React.useState(false)
    const [scrollPosition, setScrollPosition] = React.useState(0)
    const scrollAreaId = React.useId()

    // Use a ref to track content changes to avoid infinite loops
    const contentRef = React.useRef(children)

    React.useEffect(() => {
      if (forceScrollable && scrollAreaRef.current) {
        const cleanup = forceEnableScrolling(scrollAreaRef.current)
        return cleanup
      }
    }, [forceScrollable])

    // Check for overflow only when necessary
    React.useEffect(() => {
      const checkOverflow = () => {
        if (scrollAreaRef.current) {
          const hasVerticalOverflow = scrollAreaRef.current.scrollHeight > scrollAreaRef.current.clientHeight
          const hasHorizontalOverflow = scrollAreaRef.current.scrollWidth > scrollAreaRef.current.clientWidth

          const newHasOverflow =
            (orientation === "vertical" && hasVerticalOverflow) ||
            (orientation === "horizontal" && hasHorizontalOverflow) ||
            (orientation === "both" && (hasVerticalOverflow || hasHorizontalOverflow))

          // Only update state if the overflow status has changed
          if (hasOverflow !== newHasOverflow) {
            setHasOverflow(newHasOverflow)
          }
        }
      }

      // Update content ref to detect changes
      contentRef.current = children

      checkOverflow()

      // Use ResizeObserver to detect size changes
      const resizeObserver = new ResizeObserver(() => {
        checkOverflow()
      })

      if (scrollAreaRef.current) {
        resizeObserver.observe(scrollAreaRef.current)
      }

      return () => {
        resizeObserver.disconnect()
      }
    }, [children, orientation, hasOverflow])

    const handleScroll = React.useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        if (onScroll) {
          onScroll(event)
        }

        // Update scroll position for ARIA attributes
        if (scrollAreaRef.current) {
          const element = scrollAreaRef.current
          const position =
            orientation !== "horizontal"
              ? element.scrollTop / (element.scrollHeight - element.clientHeight || 1)
              : element.scrollLeft / (element.scrollWidth - element.clientWidth || 1)

          // Avoid unnecessary state updates
          const newPosition = Math.max(0, Math.min(1, position)) * 100
          if (Math.abs(newPosition - scrollPosition) > 1) {
            setScrollPosition(newPosition)
          }
        }
      },
      [onScroll, orientation, scrollPosition],
    )

    return (
      <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
        <ScrollAreaPrimitive.Viewport
          ref={scrollAreaRef}
          className="h-full w-full rounded-[inherit]"
          onScroll={handleScroll}
          style={{
            // Ensure the viewport is scrollable
            overflowY: orientation !== "horizontal" ? (forceScrollable || hasOverflow ? "scroll" : "auto") : "hidden",
            overflowX: orientation !== "vertical" ? (forceScrollable || hasOverflow ? "scroll" : "auto") : "hidden",
          }}
          tabIndex={0}
          aria-label={`Scrollable content${orientation !== "both" ? ` with ${orientation} scrolling` : ""}`}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {showScrollbar && (hasOverflow || forceScrollable) && (
          <>
            {orientation !== "horizontal" && (
              <ScrollBar
                orientation="vertical"
                aria-label="Vertical scrollbar"
                aria-controls={`${scrollAreaId}-content`}
                aria-valuenow={scrollPosition}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            )}
            {orientation !== "vertical" && (
              <ScrollBar
                orientation="horizontal"
                aria-label="Horizontal scrollbar"
                aria-controls={`${scrollAreaId}-content`}
                aria-valuenow={scrollPosition}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            )}
          </>
        )}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  },
)
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="relative flex-1 rounded-full bg-border"
      aria-label={`${orientation} scrollbar thumb`}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
