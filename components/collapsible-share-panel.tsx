"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  X,
  QrCode,
  Facebook,
  Twitter,
  Mail,
  MessageSquare,
  Check,
  Copy,
  ShareIcon,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useClipboard } from "@/hooks/use-clipboard"
import { useWebShare } from "@/hooks/use-web-share"

export function CollapsibleSharePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [shareUrl, setShareUrl] = useState("")
  const [shareTitle, setShareTitle] = useState("SmileyBrooms - Your Cleaning Service")
  const [shareText, setShareText] = useState("Get your home sparkling clean with SmileyBrooms!")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)

  const { copy, copied } = useClipboard()
  const { share, isSupported: isWebShareSupported } = useWebShare()

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    // Set the current URL as the default share URL
    setShareUrl(window.location.href)
  }, [])

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsOpen(false)
  })

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "alt+s": () => setIsOpen((prev) => !prev), // Alt + S for Share
    Escape: () => setIsOpen(false),
  })

  // Generate QR code when shareUrl changes
  useEffect(() => {
    const generateQrCode = async () => {
      if (shareUrl) {
        try {
          const QRCode = await import("qrcode").then((m) => m.default)
          const dataUrl = await QRCode.toDataURL(shareUrl, { width: 256, margin: 2 })
          setQrCodeDataUrl(dataUrl)
        } catch (error) {
          console.error("Failed to generate QR code:", error)
          setQrCodeDataUrl(null)
        }
      } else {
        setQrCodeDataUrl(null)
      }
    }
    generateQrCode()
  }, [shareUrl])

  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        // Optionally, provide feedback that native share was successful
      } catch (error) {
        console.error("Native share failed:", error)
        // Optionally, provide feedback that native share failed
      }
    }
  }

  // Define animation variants for the panel
  const panelVariants = {
    hidden: { opacity: 0, x: "100%", scale: 0.8, originX: 1, originY: 1 },
    visible: { opacity: 1, x: "0%", scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, x: "100%", scale: 0.8, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  // Define animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.8, transition: { type: "spring", damping: 25, stiffness: 300 } },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  if (!isMounted) {
    return null
  }

  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedShareText = encodeURIComponent(shareText)
  const encodedShareTitle = encodeURIComponent(shareTitle)

  return (
    <TooltipProvider>
      <motion.div
        ref={panelRef}
        // Fixed positioning at bottom-right, responsive margin
        className="fixed z-[997] bottom-4 right-4 sm:right-4 md:right-4 lg:right-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={buttonVariants} // Apply button variants to the container for initial button animation
      >
        {/* Trigger Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
                "border-2 border-purple-200/50 dark:border-purple-800/50",
                "hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                "transition-all duration-300 hover:scale-105 relative",
              )}
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(168, 85, 247, 0.05)",
              }}
              aria-label={isOpen ? "Close share panel" : "Open share panel"}
            >
              {isOpen ? (
                <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 rotate-180" />
              ) : (
                <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{isOpen ? "Close Share" : "Open Share"}</TooltipContent>
        </Tooltip>

        {/* Expandable Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants} // Apply panel variants here
              className={cn(
                "absolute bottom-full right-0 mb-3 w-full max-w-[90vw] sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border-2 border-purple-200/50 dark:border-purple-800/50",
                "relative flex flex-col",
              )}
              style={{
                maxHeight: "80vh", // Adjusted max height for better mobile fit
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)",
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Share This Page</h3>
                      <p className="text-purple-100 text-sm">Spread the word about SmileyBrooms!</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                    aria-label="Close share panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Share Content */}
              <div className="p-5 flex-1 overflow-auto space-y-6">
                {/* Share URL */}
                <div className="space-y-2">
                  <Label htmlFor="share-url" className="text-gray-700 dark:text-gray-300">
                    Shareable Link
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="share-url"
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1"
                      aria-label="Shareable link"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copy(shareUrl)}
                          aria-label={copied ? "Link copied" : "Copy link to clipboard"}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{copied ? "Copied!" : "Copy Link"}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Share Title */}
                <div className="space-y-2">
                  <Label htmlFor="share-title" className="text-gray-700 dark:text-gray-300">
                    Title
                  </Label>
                  <Input
                    id="share-title"
                    type="text"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    aria-label="Share title"
                  />
                </div>

                {/* Share Text */}
                <div className="space-y-2">
                  <Label htmlFor="share-text" className="text-gray-700 dark:text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="share-text"
                    type="text"
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                    aria-label="Share description"
                  />
                </div>

                {/* QR Code */}
                {qrCodeDataUrl && (
                  <div className="space-y-2 text-center">
                    <Label className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5" />
                      QR Code
                    </Label>
                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <img
                        src={qrCodeDataUrl || "/placeholder.svg"}
                        alt="QR Code for sharing"
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-md"
                        aria-label="QR code to share this page"
                      />
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  {isWebShareSupported && (
                    <Button
                      onClick={handleNativeShare}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      aria-label="Share using native share dialog"
                    >
                      <ShareIcon className="mr-2 h-4 w-4" />
                      Native Share
                    </Button>
                  )}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&quote=${encodedShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm",
                      "bg-blue-600 hover:bg-blue-700 text-white transition-colors",
                    )}
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm",
                      "bg-blue-400 hover:bg-blue-500 text-white transition-colors",
                    )}
                    aria-label="Share on X (Twitter)"
                  >
                    <Twitter className="mr-2 h-4 w-4" />X (Twitter)
                  </a>
                  <a
                    href={`mailto:?subject=${encodedShareTitle}&body=${encodedShareText}%0A%0A${encodedShareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm",
                      "bg-gray-500 hover:bg-gray-600 text-white transition-colors",
                    )}
                    aria-label="Share via Email"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                  <a
                    href={`sms:?body=${encodedShareText}%20${encodedShareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm",
                      "bg-green-500 hover:bg-green-600 text-white transition-colors",
                    )}
                    aria-label="Share via SMS"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
