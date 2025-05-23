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
  }
>(({ className, children, forceScrollable = false, showScrollbar = true, onScroll, ...props }, ref) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = React.useState(false)

  React.useEffect(() => {
    if (forceScrollable && scrollAreaRef.current) {
      const cleanup = forceEnableScrolling(scrollAreaRef.current)
      return cleanup
    }
  }, [forceScrollable])

  // Check for overflow on mount and when children change
  React.useEffect(() => {
    const checkOverflow = () => {
      if (scrollAreaRef.current) {
        const hasVerticalOverflow = scrollAreaRef.current.scrollHeight > scrollAreaRef.current.clientHeight
        setHasOverflow(hasVerticalOverflow)
      }
    }

    checkOverflow()

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(checkOverflow)
    if (scrollAreaRef.current) {
      resizeObserver.observe(scrollAreaRef.current)
    }

    return () => {
      if (scrollAreaRef.current) {
        resizeObserver.disconnect()
      }
    }
  }, [children])

  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden h-full w-full", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={scrollAreaRef}
        className="h-full w-full rounded-[inherit] [&>div]:!block"
        onScroll={onScroll}
        style={{
          // Ensure the viewport is scrollable
          overflowY: forceScrollable || hasOverflow ? "scroll" : "auto",
        }}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {showScrollbar && (hasOverflow || forceScrollable) && <ScrollBar />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

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
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
