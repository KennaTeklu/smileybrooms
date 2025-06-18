"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollContainerDetection } from "@/hooks/useScrollContainerDetection"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { usePanelManager } from "@/lib/panel-manager-context"
import CartDisplayContent from "@/components/cart-display-content"

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const panelVariants = {
  hidden: {
    opacity: 0,
    x: "100%",
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
  },
}

export const CartPanel = forwardRef<HTMLDivElement, CartPanelProps>(({ isOpen, onClose, className }, ref) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { detectionRef, activeContainer } = useScrollContainerDetection()
  const { cart } = useCart()
  const router = useRouter()
  const [isCheckoutPending, setIsCheckoutPending] = useState(false)
  const { registerPanel, unregisterPanel, setActivePanel, activePanel } = usePanelManager()

  useEffect(() => {
    registerPanel("cartPanel", { isFullscreen: false, zIndex: 998 })
    return () => unregisterPanel("cartPanel")
  }, [registerPanel, unregisterPanel])

  useEffect(() => {
    if (isOpen) {
      setActivePanel("cartPanel")
      document.body.style.overflow = "hidden"
      document.body.classList.add("panel-locked")
    } else if (activePanel === "cartPanel") {
      setActivePanel(null)
      document.body.style.overflow = ""
      document.body.classList.remove("panel-locked")
    }
  }, [isOpen, setActivePanel, activePanel])

  useEffect(() => {
    if (activePanel && activePanel !== "cartPanel" && isOpen) {
      onClose()
    }
  }, [activePanel, isOpen, onClose])

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleCheckout = () => {
    setIsCheckoutPending(true)
    onClose()
  }

  const handleAnimationComplete = (definition: string) => {
    if (definition === "exit" && isCheckoutPending) {
      router.push("/cart")
      setIsCheckoutPending(false)
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={panelVariants}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      exit="exit"
      onAnimationComplete={handleAnimationComplete}
      className={cn(
        "fixed inset-y-0 right-0 z-[998] w-full max-w-md bg-background border-l shadow-2xl",
        "flex flex-col",
        className,
      )}
      data-testid="cart-panel"
    >
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          aria-label="Close cart"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Cart content */}
      <div ref={detectionRef} className="flex-1 flex flex-col">
        <CartDisplayContent onCheckout={handleCheckout} onContinueShopping={onClose} className="flex-1 flex flex-col" />
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && activeContainer && (
        <div className="absolute bottom-0 left-0 bg-black/80 text-white text-xs p-2 rounded-tr">
          Scroll: {activeContainer.isRoot ? "Root" : "Container"} | Can scroll:{" "}
          {activeContainer.canScrollVertically ? "Y" : ""}
          {activeContainer.canScrollHorizontally ? "X" : ""}
        </div>
      )}
    </motion.div>
  )
})

CartPanel.displayName = "CartPanel"
