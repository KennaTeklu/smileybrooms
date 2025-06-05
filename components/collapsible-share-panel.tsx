"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  ChevronLeft,
  Copy,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Phone,
  Printer,
  Link,
  QrCode,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useScrollPosition } from "@/hooks/use-scroll-position"

interface SharePlatform {
  name: string
  icon: React.ReactNode
  color: string
  url: string
  category: "social" | "messaging" | "professional" | "other"
  template?: string
}

const sharePlatforms: SharePlatform[] = [
  // Social Media
  {
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-[#1877F2] hover:bg-[#0E65D9]",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
    category: "social",
    template: "Check out SmileyBrooms - Professional cleaning that will make your home sparkle! ✨ {url}",
  },
  {
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-[#1DA1F2] hover:bg-[#0C85D0]",
    url: "https://twitter.com/intent/tweet?text=",
    category: "social",
    template: "Just discovered SmileyBrooms - professional cleaning that will make you smile! 🧹✨ {url}",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "bg-[#0A66C2] hover:bg-[#084E96]",
    url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    category: "professional",
    template: "I recommend this professional cleaning service: {url} #ProfessionalCleaning #SmileyBrooms",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    color: "bg-[#E4405F] hover:bg-[#D1264A]",
    url: "https://www.instagram.com/",
    category: "social",
    template: "Check out @SmileyBrooms for your cleaning needs! {url} #CleanHome #ProfessionalCleaning",
  },
  // Messaging
  {
    name: "WhatsApp",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-[#25D366] hover:bg-[#20BD5C]",
    url: "https://api.whatsapp.com/send?text=",
    category: "messaging",
    template: "Hey! Check out this cleaning service I found. They're amazing! 🧹✨ {url}",
  },
  {
    name: "Telegram",
    icon: <Send className="h-4 w-4" />,
    color: "bg-[#0088CC] hover:bg-[#0077B3]",
    url: "https://t.me/share/url?url=",
    category: "messaging",
    template: "Found a great cleaning service - SmileyBrooms! {url}",
  },
  {
    name: "SMS",
    icon: <Phone className="h-4 w-4" />,
    color: "bg-green-600 hover:bg-green-700",
    url: "sms:?body=",
    category: "messaging",
    template: "Check out SmileyBrooms for your cleaning needs! {url}",
  },
  // Other
  {
    name: "Email",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-gray-600 hover:bg-gray-700",
    url: "mailto:?body=",
    category: "other",
    template:
      "Subject: Amazing Cleaning Service!\n\nHi,\n\nI found this great cleaning service: {url}\n\nBest regards,",
  },
  {
    name: "Copy Link",
    icon: <Copy className="h-4 w-4" />,
    color: "bg-blue-600 hover:bg-blue-700",
    url: "",
    category: "other",
  },
  {
    name: "Print",
    icon: <Printer className="h-4 w-4" />,
    color: "bg-gray-700 hover:bg-gray-800",
    url: "print",
    category: "other",
  },
]

export function CollapsibleSharePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("social")
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollPosition = useScrollPosition()

  // Get current URL and title
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
      setCurrentTitle(document.title || "SmileyBrooms")
    }
  }, [])

  // Handle click outside to collapse panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded])

  // Calculate panel position based on scroll (right side)
  const panelTopPosition = Math.max(20, Math.min(scrollPosition + 100, window.innerHeight - 400))

  const handleShare = (platform: SharePlatform) => {
    let shareText = platform.template || "{url}"
    shareText = shareText.replace("{url}", currentUrl).replace("{title}", currentTitle)

    if (platform.name === "Copy Link") {
      navigator.clipboard.writeText(currentUrl)
      setCopiedStates({ ...copiedStates, [platform.name]: true })
      setTimeout(() => setCopiedStates({ ...copiedStates, [platform.name]: false }), 2000)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        duration: 3000,
      })
      return
    }

    if (platform.name === "Print") {
      window.print()
      return
    }

    if (platform.name === "Email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(`Check out ${currentTitle}`)}&body=${encodeURIComponent(shareText)}`
      return
    }

    if (platform.name === "SMS") {
      window.location.href = `sms:?body=${encodeURIComponent(shareText)}`
      return
    }

    // For platforms that need manual sharing
    if (["Instagram"].includes(platform.name)) {
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
  }

  const filteredPlatforms = searchTerm
    ? sharePlatforms.filter((platform) => platform.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : sharePlatforms.filter((platform) => platform.category === activeTab)

  return (
    <div ref={panelRef} className="fixed right-0 z-50 flex" style={{ top: `${panelTopPosition}px` }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0, x: "100%" }}
            animate={{ width: "360px", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-xl overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/20"
                aria-label="Collapse share panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(sharePlatforms.find((p) => p.name === "Copy Link")!)}
                  className="flex items-center gap-2"
                >
                  {copiedStates["Copy Link"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Link className="h-3 w-3" />
                  )}
                  {copiedStates["Copy Link"] ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(currentUrl)
                    // Generate QR code logic here
                    toast({ title: "QR Code generated", description: "Link copied for QR generation" })
                  }}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-3 w-3" />
                  QR Code
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <Input
                type="search"
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pt-2">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="social" className="text-xs">
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="messaging" className="text-xs">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="text-xs">
                    Work
                  </TabsTrigger>
                  <TabsTrigger value="other" className="text-xs">
                    More
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 overflow-auto max-h-[50vh]">
                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredPlatforms.map((platform) => (
                      <motion.div key={platform.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-auto p-3 flex flex-col items-center gap-2 text-white border-0",
                            platform.color,
                          )}
                          onClick={() => handleShare(platform)}
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                            {platform.icon}
                          </div>
                          <span className="text-xs font-medium">{platform.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Current URL Display */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Link className="h-3 w-3" />
                <span className="truncate flex-1">{currentUrl}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0, x: "100%" }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white",
              "rounded-l-lg shadow-lg hover:from-blue-700 hover:to-purple-700",
              "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
              "transform hover:scale-105",
            )}
            aria-label="Open share options"
          >
            <Share2 className="h-5 w-5" />
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
