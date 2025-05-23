"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const drawerVariants = cva(
  "fixed z-50 flex flex-col bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full border-l",
        left: "inset-y-0 left-0 h-full border-r",
        top: "inset-x-0 top-0 w-full border-b",
        bottom: "inset-x-0 bottom-0 w-full border-t",
      },
      size: {
        sm: "w-3/4 sm:max-w-sm",
        default: "w-3/4 sm:max-w-md",
        lg: "w-3/4 sm:max-w-lg",
        xl: "w-3/4 sm:max-w-xl",
        full: "w-screen",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  },
)

const overlayVariants = cva(
  "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
  {
    variants: {
      state: {
        open: "opacity-100",
        closed: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      state: "closed",
    },
  },
)

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof drawerVariants> {
  open?: boolean
  onClose?: () => void
  hideCloseButton?: boolean
  showScrollbar?: boolean
  closeOnClickOutside?: boolean
  closeOnEsc?: boolean
  preventScroll?: boolean
}

export function Drawer({
  className,
  children,
  side = "right",
  size = "default",
  open = false,
  onClose,
  hideCloseButton = false,
  showScrollbar = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  preventScroll = true,
  ...props
}: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(open)
  const drawerRef = React.useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = React.useState(0)

  // Sync open state with prop
  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  // Handle ESC key press
  React.useEffect(() => {
    if (!closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, closeOnEsc])

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (!preventScroll) return

    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, preventScroll])

  // Handle click outside
  const handleOverlayClick = React.useCallback(() => {
    if (closeOnClickOutside) {
      setIsOpen(false)
      onClose?.()
    }
  }, [closeOnClickOutside, onClose])

  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setScrollPosition(target.scrollTop)
  }

  // Calculate transform based on side
  const getTransform = () => {
    if (!isOpen) {
      switch (side) {
        case "right":
          return "translateX(100%)"
        case "left":
          return "translateX(-100%)"
        case "top":
          return "translateY(-100%)"
        case "bottom":
          return "translateY(100%)"
      }
    }
    return "translate(0)"
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={overlayVariants({ state: isOpen ? "open" : "closed" })}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(drawerVariants({ side, size }), className)}
        style={{ transform: getTransform() }}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        {...props}
      >
        {/* Header with close button */}
        {!hideCloseButton && (
          <div className="flex items-center justify-end p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content with ScrollArea */}
        <ScrollArea className="flex-1" showScrollbar={showScrollbar} forceScrollable={true} onScroll={handleScroll}>
          {children}
        </ScrollArea>

        {/* Optional scroll indicator */}
        {scrollPosition > 20 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        )}
      </div>
    </>
  )
}
