"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, X, Copy, Check, Facebook, Twitter, Mail, ChevronLeft } from "lucide-react" // Changed ChevronRight to ChevronLeft
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
    async (platform: "facebook" | "twitter" | "email" | "qr" | "linkedin" | "whatsapp") => {
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
        } else if (platform === "linkedin") {
          window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=Check out this amazing cleaning service!`,
            "_blank",
          )
        } else if (platform === "whatsapp") {
          window.open(`https://wa.me/?text=Check out this amazing cleaning service! ${encodeURIComponent(shareUrl)}`, "_blank")
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
                  <Button variant="outline" onClick={() => handleShare("linkedin")}>
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9.495h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.062 2.062 2.062 0 0 1 2.063-2.062c1.132 0 2.064.93 2.064 2.062 0 1.132-.932 2.062-2.064 2.062zm1.787 13.019H3.55v-11.63h3.574v11.63zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.979 0 1.776-.773 1.776-1.729V1.729C24 .774 23.204 0 22.225 0z"/></svg> LinkedIn
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("whatsapp")}>
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67-.149-.198 0-.52.074-.76.372-.227.299-.593.76-.726.91-.133.149-.266.198-.493.074-.226-.149-1.05-.387-1.995-1.237-.746-.606-1.249-1.354-1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254-.292.387-.431.134-.139.179-.238.266-.373.087-.133.044-.25-.014-.373-.058-.129-.52-.148-.76-.148-.227 0-.493.099-.746.198-.24.099-.695.347-1.06.726C6.557 10.6 5.94 11.862 5.94 12.043c0 .18.152.358.152.358l.014.014c.391.391.746.821 1.06 1.169.314.349.65.65 1.005.92.355.271.71.481 1.06.65.35.17.639.254.92.254.28 0 .546-.099.79-.297.24-.198.45-.593.639-.891.189-.299.314-.481.447-.606.133-.124.266-.198.40-.198.067 0 .134.009.198.014.067.009.134.014.201.014.266.009.52-.099.746-.198.227-.099.493-.198.726-.297.238-.099.472-.149.67-.149.198 0 .52.074.76.372.227.299.593.76.726.91.133.149.266-.198.493.074.226-.149 1.05-.387 1.995-1.237.746-.606 1.249-1.354 1.392-1.593-.143-.238-.014-.366.101-.481.114-.114.254\
