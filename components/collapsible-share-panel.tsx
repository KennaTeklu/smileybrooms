"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, X, Copy, Check, Facebook, Twitter, Mail, QrCode, ChevronLeft } from "lucide-react" // Changed ChevronRight to ChevronLeft
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { usePanelManager } from "@/lib/panel-manager-context"
import { cn } from "@/lib/utils"

export function CollapsibleSharePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const { registerPanel, unregisterPanel, setActivePanel, activePanel, getPanelConfig } = usePanelManager()

  // State for dynamic positioning
  const [panelTopPosition, setPanelTopPosition] = useState<string>("100px") // Initial position

  // Define configurable scroll range values
  const basePanelOffset = 100 // Base distance from the top of the viewport for settings/share
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  useEffect(() => {
    registerPanel("sharePanel", { isFullscreen: false, zIndex: 996 })
    return () => unregisterPanel("sharePanel")
  }, [registerPanel, unregisterPanel])

  useEffect(() => {
    if (isExpanded) {
      setActivePanel("sharePanel")
    } else if (activePanel === "sharePanel") {
      setActivePanel(null)
    }
  }, [isExpanded, setActivePanel, activePanel])

  useEffect(() => {
    if (activePanel && activePanel !== "sharePanel" && isExpanded) {
      setIsExpanded(false)
    }
  }, [activePanel, isExpanded])

  // Calculate panel position based on scroll and viewport
  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current) return

    const panelHeight = panelRef.current.offsetHeight || 200 // fallback height
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    const desiredTopFromScroll = scrollY + basePanelOffset
    const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPageMargin, scrollY + 50)

    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    calculatePanelPosition() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
    }
  }, [calculatePanelPosition])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsExpanded(false)
  })

  useKeyboardShortcuts({
    Escape: () => setIsExpanded(false),
  })

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({
      title: "Link Copied!",
      description: "The page URL has been copied to your clipboard.",
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }, [shareUrl])

  const handleShare = useCallback(
    async (platform: "facebook" | "twitter" | "email" | "qr") => {
      try {
        if (platform === "facebook") {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
        } else if (platform === "twitter") {
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this amazing cleaning service!`,
            "_blank",
          )
        } else if (platform === "email") {
          window.location.href = `mailto:?subject=Check out this cleaning service!&body=I found this amazing cleaning service: ${encodeURIComponent(shareUrl)}`
        } else if (platform === "qr") {
          toast({
            title: "QR Code Generated (Simulated)",
            description: "A QR code for this page would be generated here.",
            duration: 3000,
          })
        }
        toast({
          title: `Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
          description: "Thanks for sharing!",
          duration: 2000,
        })
      } catch (error) {
        console.error("Failed to share:", error)
        toast({
          title: "Sharing Failed",
          description: "Could not share the link. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    },
    [shareUrl],
  )

  const panelZIndex = getPanelConfig("sharePanel")?.zIndex || 996

  return (
    <TooltipProvider>
      <motion.div
        ref={panelRef}
        className="fixed right-[clamp(1rem,3vw,2rem)] z-[996]"
        style={{ zIndex: panelZIndex, top: panelTopPosition }} // Use dynamic top position
        initial={{ x: "150%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Trigger Button */}
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            "rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "border border-blue-500/20 backdrop-blur-sm relative",
            "sm:p-4 sm:rounded-xl", // Larger padding for larger screens
            "max-sm:p-2 max-sm:rounded-lg max-sm:w-10 max-sm:h-10 max-sm:overflow-hidden", // Smaller for small screens, icon only
          )}
          aria-label="Toggle share panel"
        >
          <Share2 className="h-5 w-5" />
          <ChevronLeft className="h-4 w-4 max-sm:hidden" /> {/* Hide chevron on small screens */}
        </motion.button>

        {/* Expandable Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Share This Page</h3>
                    <p className="text-blue-100 text-sm">Spread the word about our services!</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div>
                  <Label htmlFor="share-url" className="sr-only">
                    Shareable URL
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input id="share-url" type="text" value={shareUrl} readOnly className="flex-1" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleCopy} size="icon" className="shrink-0">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{copied ? "Copied!" : "Copy Link"}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleShare("facebook")}>
                    <Facebook className="h-4 w-4 mr-2" /> Facebook
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("twitter")}>
                    <Twitter className="h-4 w-4 mr-2" /> Twitter
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("email")}>
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("qr")}>
                    <QrCode className="h-4 w-4 mr-2" /> QR Code
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
