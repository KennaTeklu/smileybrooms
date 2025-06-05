"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  ChevronLeft,
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
  Slack,
  Check,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useScrollPosition } from "@/hooks/use-scroll-position"

interface SharePlatform {
  id: string
  name: string
  icon: React.ReactNode
  url: string
  color: string
  category: "social" | "chat" | "work" | "more"
}

const sharePlatforms: SharePlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    url: "https://www.facebook.com/sharer/sharer.php?u=",
    color: "bg-blue-600",
    category: "social",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter className="h-4 w-4" />,
    url: "https://twitter.com/intent/tweet?url=",
    color: "bg-sky-500",
    category: "social",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    url: "https://www.linkedin.com/sharing/share-offsite/?url=",
    color: "bg-blue-700",
    category: "social",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    url: "https://www.instagram.com/",
    color: "bg-pink-600",
    category: "social",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: <MessageCircle className="h-4 w-4" />,
    url: "https://wa.me/?text=",
    color: "bg-green-600",
    category: "chat",
  },
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-4 w-4" />,
    url: "mailto:?subject=Check this out&body=",
    color: "bg-gray-600",
    category: "chat",
  },
  {
    id: "sms",
    name: "SMS",
    icon: <Phone className="h-4 w-4" />,
    url: "sms:?body=",
    color: "bg-green-500",
    category: "chat",
  },
  {
    id: "slack",
    name: "Slack",
    icon: <Slack className="h-4 w-4" />,
    url: "https://slack.com/intl/en-in/",
    color: "bg-purple-600",
    category: "work",
  },
]

export function CollapsibleSharePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("social")
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollPosition = useScrollPosition()

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

  // Calculate panel position based on scroll
  const panelTopPosition =
    typeof window !== "undefined" ? Math.max(20, Math.min(scrollPosition + 100, window.innerHeight - 400)) : 20

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const filteredPlatforms = sharePlatforms.filter(
    (platform) =>
      platform.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || platform.category === activeTab),
  )

  const shareOnPlatform = (platform: SharePlatform) => {
    const shareUrl = platform.url + encodeURIComponent(currentUrl)
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  return (
    <div ref={panelRef} className="fixed right-0 z-50 flex" style={{ top: `${panelTopPosition}px` }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse share panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="w-32 h-32 bg-white rounded flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </motion.div>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 p-2">
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
              </TabsList>

              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search platforms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Platform Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-auto">
                  {filteredPlatforms.map((platform) => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => shareOnPlatform(platform)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-left",
                        "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                      )}
                    >
                      <div className={cn("p-2 rounded text-white", platform.color)}>{platform.icon}</div>
                      <span className="text-sm font-medium">{platform.name}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-gray-400" />
                    </motion.button>
                  ))}
                </div>

                {filteredPlatforms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No platforms found</p>
                  </div>
                )}
              </div>
            </Tabs>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open share panel"
          >
            <ChevronLeft className="h-4 w-4" />
            <Share2 className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
