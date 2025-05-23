"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cva } from "class-variance-authority"
import { X, Maximize2, Minimize2 } from "lucide-react"

import { cn } from "@/lib/utils"

// Drawer context for managing state
interface DrawerContextValue {
  direction?: "top" | "bottom" | "left" | "right"
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full"
  isFullscreen?: boolean
  setIsFullscreen?: (value: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextValue>({})

// Main Drawer component
interface DrawerProps extends React.ComponentProps<typeof DrawerPrimitive.Root> {
  direction?: "top" | "bottom" | "left" | "right"
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full"
  preventScroll?: boolean
  closeThreshold?: number
  velocityThreshold?: number
}

const Drawer = ({
  shouldScaleBackground = true,
  direction = "bottom",
  size = "default",
  preventScroll = true,
  closeThreshold = 0.25,
  velocityThreshold = 500,
  children,
  ...props
}: DrawerProps) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  return (
    <DrawerContext.Provider value={{ direction, size, isFullscreen, setIsFullscreen }}>
      <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        preventScrollRestoration={preventScroll}
        closeThreshold={closeThreshold}
        velocityThreshold={velocityThreshold}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  )
}
Drawer.displayName = "Drawer"

// Drawer Trigger
const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-95",
      className,
    )}
    {...props}
  >
    {children}
  </DrawerPrimitive.Trigger>
))
DrawerTrigger.displayName = DrawerPrimitive.Trigger.displayName

// Drawer Portal
const DrawerPortal = DrawerPrimitive.Portal

// Drawer Close
const DrawerClose = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-full p-2.5 transition-all duration-200",
      "hover:bg-accent hover:rotate-90",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "group",
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
    <span className="sr-only">Close</span>
  </DrawerPrimitive.Close>
))
DrawerClose.displayName = DrawerPrimitive.Close.displayName

// Enhanced Drawer Overlay with blur and animation
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

// Content size variants
const drawerContentVariants = cva(
  "fixed z-50 flex flex-col bg-background shadow-2xl transition-all duration-300 ease-out",
  {
    variants: {
      direction: {
        bottom: "inset-x-0 bottom-0 rounded-t-[20px] border-t",
        top: "inset-x-0 top-0 rounded-b-[20px] border-b",
        left: "inset-y-0 left-0 rounded-r-[20px] border-r",
        right: "inset-y-0 right-0 rounded-l-[20px] border-l",
      },
      size: {
        default: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
      fullscreen: {
        true: "!inset-0 !rounded-none !h-full !w-full !max-h-full !max-w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Bottom drawer sizes
      {
        direction: "bottom",
        size: "sm",
        fullscreen: false,
        className: "max-h-[25vh]",
      },
      {
        direction: "bottom",
        size: "default",
        fullscreen: false,
        className: "max-h-[50vh]",
      },
      {
        direction: "bottom",
        size: "md",
        fullscreen: false,
        className: "max-h-[65vh]",
      },
      {
        direction: "bottom",
        size: "lg",
        fullscreen: false,
        className: "max-h-[80vh]",
      },
      {
        direction: "bottom",
        size: "xl",
        fullscreen: false,
        className: "max-h-[90vh]",
      },
      {
        direction: "bottom",
        size: "full",
        fullscreen: false,
        className: "max-h-[95vh]",
      },
      // Top drawer sizes
      {
        direction: "top",
        size: "sm",
        fullscreen: false,
        className: "max-h-[25vh]",
      },
      {
        direction: "top",
        size: "default",
        fullscreen: false,
        className: "max-h-[50vh]",
      },
      {
        direction: "top",
        size: "md",
        fullscreen: false,
        className: "max-h-[65vh]",
      },
      {
        direction: "top",
        size: "lg",
        fullscreen: false,
        className: "max-h-[80vh]",
      },
      {
        direction: "top",
        size: "xl",
        fullscreen: false,
        className: "max-h-[90vh]",
      },
      {
        direction: "top",
        size: "full",
        fullscreen: false,
        className: "max-h-[95vh]",
      },
      // Left drawer sizes
      {
        direction: "left",
        size: "sm",
        fullscreen: false,
        className: "max-w-[320px]",
      },
      {
        direction: "left",
        size: "default",
        fullscreen: false,
        className: "max-w-[400px]",
      },
      {
        direction: "left",
        size: "md",
        fullscreen: false,
        className: "max-w-[500px]",
      },
      {
        direction: "left",
        size: "lg",
        fullscreen: false,
        className: "max-w-[600px]",
      },
      {
        direction: "left",
        size: "xl",
        fullscreen: false,
        className: "max-w-[800px]",
      },
      {
        direction: "left",
        size: "full",
        fullscreen: false,
        className: "max-w-[95vw]",
      },
      // Right drawer sizes
      {
        direction: "right",
        size: "sm",
        fullscreen: false,
        className: "max-w-[320px]",
      },
      {
        direction: "right",
        size: "default",
        fullscreen: false,
        className: "max-w-[400px]",
      },
      {
        direction: "right",
        size: "md",
        fullscreen: false,
        className: "max-w-[500px]",
      },
      {
        direction: "right",
        size: "lg",
        fullscreen: false,
        className: "max-w-[600px]",
      },
      {
        direction: "right",
        size: "xl",
        fullscreen: false,
        className: "max-w-[800px]",
      },
      {
        direction: "right",
        size: "full",
        fullscreen: false,
        className: "max-w-[95vw]",
      },
    ],
    defaultVariants: {
      direction: "bottom",
      size: "default",
      fullscreen: false,
    },
  },
)

// Enhanced Drawer Content
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { direction, size, isFullscreen, setIsFullscreen } = React.useContext(DrawerContext)
  const [isDragging, setIsDragging] = React.useState(false)

  // Animation classes based on direction
  const animationClasses = {
    bottom:
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    top: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    left: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    right:
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          drawerContentVariants({ direction, size, fullscreen: isFullscreen }),
          animationClasses[direction || "bottom"],
          "data-[state=open]:duration-500 data-[state=closed]:duration-300",
          isDragging && "transition-none",
          className,
        )}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        {...props}
      >
        {/* Drag handle for bottom/top drawers */}
        {(direction === "bottom" || direction === "top") && !isFullscreen && (
          <div
            className={cn(
              "mx-auto my-4 h-1.5 w-16 rounded-full bg-muted-foreground/20",
              "transition-all duration-200 hover:bg-muted-foreground/40",
              "cursor-grab active:cursor-grabbing",
              direction === "top" && "order-last",
            )}
          />
        )}

        {/* Fullscreen toggle button */}
        {setIsFullscreen && size !== "full" && (
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn(
              "absolute top-4 right-14 rounded-full p-2.5 transition-all duration-200",
              "hover:bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "group",
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <Maximize2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            )}
          </button>
        )}

        {/* Close button */}
        <DrawerClose />

        {/* Content wrapper with overflow handling */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20",
            "hover:scrollbar-thumb-muted-foreground/40",
          )}
        >
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = "DrawerContent"

// Enhanced Drawer Header
const DrawerHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 px-6 py-4",
      "border-b border-border/50",
      "bg-gradient-to-b from-background to-background/95",
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
DrawerHeader.displayName = "DrawerHeader"

// Enhanced Drawer Footer
const DrawerFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end",
      "border-t border-border/50",
      "bg-gradient-to-t from-background to-background/95",
      "mt-auto",
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
DrawerFooter.displayName = "DrawerFooter"

// Enhanced Drawer Title
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", "text-foreground", className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

// Enhanced Drawer Description
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", "leading-relaxed", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

// Drawer Body for consistent padding
const DrawerBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 px-6 py-4", "space-y-4", className)} {...props}>
    {children}
  </div>
)
DrawerBody.displayName = "DrawerBody"

// Nested Drawer support
const DrawerNestedRoot = DrawerPrimitive.NestedRoot

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerNestedRoot,
}
