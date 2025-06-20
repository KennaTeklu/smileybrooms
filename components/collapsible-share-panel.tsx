"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, ChevronLeft, Copy, Check, QrCode, Search, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { usePanelCollision } from "@/contexts/panel-collision-context"

type SharePlatform = {
  id: string
  name: string
  url: string
  icon: React.ReactNode
  color: string
  category: string
}

const sharePlatforms: SharePlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
    icon: <Share2 />,
    color: "bg-blue-700",
    category: "social",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/shareArticle?url=",
    icon: <Share2 />,
    color: "bg-blue-800",
    category: "work",
  },
  {
    id: "reddit",
    name: "Reddit",
    url: "https://www.reddit.com/submit?url=",
    icon: <Share2 />,
    color: "bg-orange-500",
    category: "social",
  },
  {
    id: "email",
    name: "Email",
    url: "mailto:?body=",
    icon: <Share2 />,
    color: "bg-gray-500",
    category: "more",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: "https://api.whatsapp.com/send?text=",
    icon: <Share2 />,
    color: "bg-green-500",
    category: "chat",
  },
  {
    id: "telegram",
    name: "Telegram",
    url: "https://telegram.me/share/url?url=",
    icon: <Share2 />,
    color: "bg-blue-400",
    category: "chat",
  },
  {
    id: "copy",
    name: "Copy Link",
    url: "",
    icon: <Share2 />,
    color: "bg-gray-500",
    category: "more",
  },
]

export function CollapsibleSharePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("social")
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { registerPanel, updatePanel, getAdjustedPosition } = usePanelCollision()

  const minTopOffset = 20
  const initialScrollOffset = 50
  const bottomPageMargin = 20
  const panelId = "share"

  useEffect(() => {
    setIsMounted(true)
    setCurrentUrl(typeof window !== "undefined" ? window.location.href : "")
    // Register this panel
    registerPanel(panelId, {
      isExpanded: false,
      position: { top: 50, right: 0 },
      width: isExpanded ? 320 : 48,
      height: isExpanded ? 600 : 48,
    })
  }, [registerPanel])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
    // Update panel state
    updatePanel(panelId, {
      isExpanded,
      width: isExpanded ? 320 : 48,
      height: isExpanded ? 600 : 48,
    })
  }, [isExpanded, updatePanel])

  const updatePositionAndHeight = useCallback(() => {
    setScrollPosition(typeof window !== "undefined" ? window.scrollY : 0)
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    if (!isMounted || isScrollPaused) return

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight()

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused, updatePositionAndHeight])

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  const documentHeight = typeof window !== "undefined" ? document.documentElement.scrollHeight : 0
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin
  const basePosition = {
    top: isScrollPaused
      ? Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))
      : Math.max(
          minTopOffset,
          Math.min((typeof window !== "undefined" ? window.scrollY : 0) + initialScrollOffset, maxPanelTop),
        ),
    right: 0,
  }

  // Get adjusted position to avoid collisions
  const adjustedPosition = getAdjustedPosition(panelId, basePosition)

  // Update panel position in context
  useEffect(() => {
    updatePanel(panelId, { position: adjustedPosition })
  }, [adjustedPosition, updatePanel])

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
    if (platform.id === "copy") {
      copyToClipboard()
      return
    }
    const shareUrl = platform.url + encodeURIComponent(currentUrl)
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const qrCodeSize = 200
  const logoSize = qrCodeSize * 0.2
  const logoPosition = (qrCodeSize - logoSize) / 2

  return isMounted ? (
    <motion.div
      ref={panelRef}
      className="fixed right-0 z-[998] flex"
      style={{ top: `${adjustedPosition.top}px` }}
      animate={{ top: adjustedPosition.top }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
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
                {isScrollPaused && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded ml-2">
                    Scroll Fixed
                  </span>
                )}
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
                  <QRCodeSVG
                    value={currentUrl}
                    size={qrCodeSize}
                    level="H"
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="text-gray-900 dark:text-gray-50"
                    imageSettings={{
                      src: "/favicon.png",
                      x: logoPosition,
                      y: logoPosition,
                      height: logoSize,
                      width: logoSize,
                      excavate: true,
                    }}
                  />
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
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search platforms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

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
                      {platform.id !== "copy" && <ExternalLink className="h-3 w-3 ml-auto text-gray-400" />}
                    </motion.button>
                  ))}
                </div>

                {filteredPlatforms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No platforms found.
                  </div>
                )}
              </div>
            </Tabs>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "48px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary rounded-l-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-200 flex items-center justify-center h-12 w-12"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand share panel"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  ) : null
}
