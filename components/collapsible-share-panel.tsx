"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  X,
  Copy,
  QrCode,
  Search,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Phone,
  Check,
  ExternalLink,
  Download,
  Sparkles,
  Globe,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useToast } from "@/components/ui/use-toast"
import QRCode from "react-qr-code" // Import the QR code library

// Constants for positioning
const DEFAULT_COLLAPSED_TOP_OFFSET = 300
const EXPANDED_SHARE_TOP_OFFSET = 0
const CHATBOT_PANEL_ACTIVE_SHARE_TOP_OFFSET = 500

interface SharePlatform {
  id: string
  name: string
  icon: React.ReactNode
  url: string
  color: string
  category: "social" | "chat" | "work" | "more"
  description: string
  popular?: boolean
  template?: string
}

interface CollapsibleSharePanelProps {
  chatbotPanelInfo?: {
    isExpanded: boolean
  }
}

const sharePlatforms: SharePlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    url: "https://www.facebook.com/sharer/sharer.php?u=",
    color: "bg-blue-600",
    category: "social",
    description: "Share with friends and family",
    popular: true,
    template:
      "Check out Smiley Brooms - professional cleaning that will make your home sparkle! ✨ Share on {platformName}: {url}",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    url: "https://twitter.com/intent/tweet?url=",
    color: "bg-sky-500",
    category: "social",
    description: "Tweet to your followers",
    popular: true,
    template:
      "Just discovered Smiley Brooms - professional cleaning that will make you smile! 🧹✨ Tweet this on {platformName}: {url}",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    color: "bg-blue-700",
    category: "social",
    description: "Share professionally",
    popular: true,
    template:
      "I recommend this professional cleaning service for homes and offices. Find out more on {platformName}: {url} #ProfessionalCleaning #SmileyBrooms",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    url: "https://www.instagram.com/", // Instagram doesn't have a direct share URL for web
    color: "bg-pink-600",
    category: "social",
    description: "Share to your story",
    template:
      "Check out @SmileyBrooms for your cleaning needs! Link in bio: {url} #CleanHome #ProfessionalCleaning (Shared via {platformName})",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: <MessageCircle className="h-4 w-4" />,
    url: "https://wa.me/?text=",
    color: "bg-green-600",
    category: "chat",
    description: "Send to contacts",
    popular: true,
    template: "Hey! Check out this cleaning service I found. They're amazing! 🧹✨ (Sent via {platformName}): {url}",
  },
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-4 w-4" />,
    url: "mailto:?subject=Check this out&body=",
    color: "bg-gray-600",
    category: "chat",
    description: "Send via email",
    template:
      "Subject: Check out this amazing cleaning service!\n\nHi,\n\nI found this great cleaning service called Smiley Brooms. They offer professional cleaning with a smile!\n\n{url}\n\nTheir services include regular cleaning, deep cleaning, move-in/out cleaning, and office cleaning. Prices are competitive and the quality is excellent.\n\nThought you might be interested.\n\nBest regards, (Shared via {platformName})",
  },
  {
    id: "sms",
    name: "SMS",
    icon: <Phone className="h-4 w-4" />,
    url: "sms:?body=",
    color: "bg-green-500",
    category: "chat",
    description: "Send text message",
    template:
      "Check out Smiley Brooms for your cleaning needs! Professional, reliable, and affordable (Sent via {platformName}): {url}",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.47-4.03c.19-.17-.04-.27-.3-.1L9.28 13.47l-2.38-.75c-.52-.16-.53-.52.11-.77l9.28-3.57c.43-.16.81.1.67.77z" />
      </svg>
    ),
    url: "https://t.me/share/url?url=",
    color: "bg-blue-400",
    category: "chat",
    description: "Share on Telegram",
    template:
      "Found a great cleaning service - Smiley Brooms! Professional cleaning for your home or office (Shared via {platformName}): {url}",
  },
  {
    id: "github",
    name: "GitHub",
    icon: <Zap className="h-4 w-4" />,
    url: "https://github.com/",
    color: "bg-gray-800",
    category: "work",
    description: "Share on GitHub",
    template: "Check out this cleaning service website: {url} - Great UI/UX design! (Shared via {platformName})",
  },
  {
    id: "slack",
    name: "Slack",
    icon: <Zap className="h-4 w-4" />,
    url: "https://slack.com/",
    color: "bg-purple-700",
    category: "work",
    description: "Share on Slack",
    template:
      "Found a great cleaning service for our office: {url} - They offer professional cleaning with flexible scheduling! (Shared via {platformName})",
  },
  {
    id: "copy-link",
    name: "Copy Link",
    icon: <Copy className="h-4 w-4" />,
    url: "", // No external URL for copy
    color: "bg-gray-500",
    category: "more",
    description: "Copy link to clipboard",
    template: "{url}", // Just the URL for copying
  },
  {
    id: "print",
    name: "Print",
    icon: <Download className="h-4 w-4" />,
    url: "print", // Special keyword for print
    color: "bg-gray-700",
    category: "more",
    description: "Print this page",
    template: "Printing page: {url}", // Placeholder template
  },
]

export function CollapsibleSharePanel({ chatbotPanelInfo }: CollapsibleSharePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("social")
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const [shareCount, setShareCount] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const { toast } = useToast()

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    setCurrentUrl(window.location.href)
  }, [])

  // Calculate panel position based on scroll and viewport
  const [panelTopPosition, setPanelTopPosition] = useState<number>(DEFAULT_COLLAPSED_TOP_OFFSET)

  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current) return

    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight
    const panelHeight = isExpanded ? panelRef.current.offsetHeight : 0

    // Minimum distance from top of viewport
    const minTopOffset = 20

    // Margin from bottom of document
    const bottomPageMargin = 20

    // Base offset calculation
    let baseTopOffset = isExpanded ? EXPANDED_SHARE_TOP_OFFSET : DEFAULT_COLLAPSED_TOP_OFFSET

    // Adjust if chatbot panel is expanded
    if (chatbotPanelInfo?.isExpanded) {
      baseTopOffset = CHATBOT_PANEL_ACTIVE_SHARE_TOP_OFFSET
    }

    // Calculate desired position from scroll
    const desiredTopFromScroll = scrollY + baseTopOffset

    // Ensure panel doesn't go beyond document bottom
    const maxTopAtDocumentBottom = Math.max(documentHeight - panelHeight - bottomPageMargin, scrollY + minTopOffset)

    // Final position is the minimum of desired and max positions
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)
    setPanelTopPosition(finalTop)
  }, [isExpanded, chatbotPanelInfo?.isExpanded])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    calculatePanelPosition()

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
    }
  }, [calculatePanelPosition])

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsExpanded(false)
  })

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "alt+s": () => setIsExpanded((prev) => !prev),
    Escape: () => setIsExpanded(false),
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      vibrate(50)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadQR = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector("svg")
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          const pngFile = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.href = pngFile
          downloadLink.download = "smileybrooms-qr-code.png"
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
          toast({
            title: "QR Code Downloaded!",
            description: "The QR code has been saved as a PNG image.",
          })
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
      } else {
        toast({
          title: "Download Failed",
          description: "Could not find QR code to download.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredPlatforms = sharePlatforms.filter(
    (platform) =>
      platform.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || platform.category === activeTab),
  )

  const popularPlatforms = sharePlatforms.filter((platform) => platform.popular)

  const shareOnPlatform = (platform: SharePlatform) => {
    vibrate(50)

    if (!isOnline) {
      toast({
        title: "Offline",
        description: "You are offline. Please connect to the internet to share.",
        variant: "destructive",
      })
      return
    }

    let shareText = platform.template || "{url}"
    shareText = shareText.replace("{url}", currentUrl).replace("{platformName}", platform.name)

    if (platform.id === "copy-link") {
      navigator.clipboard.writeText(currentUrl)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        duration: 3000,
      })
      return
    }

    if (platform.id === "print") {
      window.print()
      return
    }

    if (platform.id === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(`Check out Smiley Brooms`)}&body=${encodeURIComponent(shareText)}`
      return
    }

    if (platform.id === "sms") {
      window.location.href = `sms:?body=${encodeURIComponent(shareText)}`
      return
    }

    // For platforms that don't have direct sharing URLs
    if (["instagram", "github", "slack"].includes(platform.id)) {
      navigator.clipboard.writeText(shareText)
      window.open(platform.url, "_blank")
      toast({
        title: `${platform.name} opened`,
        description: "Share text copied to clipboard. Please paste it manually.",
      })
      return
    }

    // For all other platforms with sharing URLs
    const shareUrl = platform.url + encodeURIComponent(shareText)
    window.open(shareUrl, "_blank", "width=600,height=400")
    setShareCount((prev) => prev + 1)
    toast({
      title: "Shared!",
      description: `Content shared successfully on ${platform.name}.`,
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Collapsed State - Trigger Button */}
      {!isExpanded && (
        <motion.div
          className="fixed z-[998]"
          style={{
            top: `${panelTopPosition}px`,
            right: 0,
            width: "fit-content",
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  ref={buttonRef}
                  variant="outline"
                  onClick={() => setIsExpanded(true)}
                  className={cn(
                    "flex h-auto w-auto flex-col items-start gap-0.5 rounded-l-xl rounded-r-none border-r-0 px-4 py-3",
                    "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
                    "border-2 border-purple-200/50 dark:border-purple-800/50",
                    "hover:bg-purple-50 dark:hover:bg-purple-900/20",
                    "transition-all duration-300",
                  )}
                  style={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(147, 51, 234, 0.05)",
                  }}
                  aria-label="Open share panel"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-purple-600 dark:text-purple-400">Share</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Spread the word</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Open share options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}

      {/* Expanded State - Full Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={panelRef}
            className="fixed z-[998] flex flex-col overflow-hidden rounded-l-2xl border-b-2 border-l-2 border-t-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            style={{
              top: `${panelTopPosition}px`,
              right: 0,
              width: "100%",
              maxWidth: "420px",
              maxHeight: "80vh",
              borderColor: "rgba(168, 85, 247, 0.5)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(147, 51, 234, 0.1), -5px 0 15px rgba(0, 0, 0, 0.1)",
            }}
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: "100%", maxWidth: "420px", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-panel-title"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 id="share-panel-title" className="text-lg font-bold">
                      Share Options
                    </h3>
                    <p className="text-purple-100 text-sm">Spread the word</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {shareCount > 0 && (
                    <Badge className="bg-white/20 text-white border-white/30">{shareCount} shared</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                    aria-label="Close share panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick Actions */}
              <div className="p-5 border-b border-gray-200/50 dark:border-gray-800/50 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/50"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/50"
                    onClick={() => setShowQR(!showQR)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                </div>

                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50"
                  >
                    <div
                      ref={qrCodeRef}
                      className="w-32 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center mb-3 p-2"
                    >
                      <QRCode value={currentUrl} size={128} bgColor="#FFFFFF" fgColor="#000000" level="H" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">Scan to share this page</p>
                    <Button size="sm" variant="outline" onClick={downloadQR}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </motion.div>
                )}

                {/* Popular Platforms Quick Access */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular</span>
                  </div>
                  <div className="flex gap-2">
                    {popularPlatforms.slice(0, 4).map((platform) => (
                      <Button
                        key={platform.id}
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnPlatform(platform)}
                        className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/50"
                      >
                        <div className={cn("p-1 rounded text-white mr-2", platform.color)}>{platform.icon}</div>
                        <span className="text-xs">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs for Platform Categories */}
              <Tabs defaultValue="social" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 p-3 m-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
                  <TabsTrigger value="social" className="rounded-lg font-medium text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="rounded-lg font-medium text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="work" className="rounded-lg font-medium text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Work
                  </TabsTrigger>
                  <TabsTrigger value="more" className="rounded-lg font-medium text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    More
                  </TabsTrigger>
                </TabsList>

                <div className="p-5">
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search platforms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 focus:border-purple-400 dark:focus:border-purple-600"
                    />
                  </div>

                  {/* Platform Grid */}
                  <div className="grid grid-cols-1 gap-3 max-h-[40vh] overflow-auto">
                    {filteredPlatforms.map((platform) => (
                      <motion.button
                        key={platform.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => shareOnPlatform(platform)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border text-left",
                          "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm",
                          "hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200",
                          "border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700",
                          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                        )}
                      >
                        <div className={cn("p-3 rounded-xl text-white shadow-sm", platform.color)}>{platform.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{platform.name}</span>
                            {platform.popular && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{platform.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </motion.button>
                    ))}
                  </div>

                  {filteredPlatforms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No platforms found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
