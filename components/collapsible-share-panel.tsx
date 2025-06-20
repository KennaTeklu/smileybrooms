"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Share2, ChevronLeft, Copy, Check, QrCode, Search, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react" // Corrected import for QRCodeSVG

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
    id: "twitter",
    name: "Twitter",
    url: "https://twitter.com/intent/tweet?url=",
    icon: <Share2 />,
    color: "bg-blue-500",
    category: "social",
  },
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

interface CollapsibleSharePanelProps {
  id: string
  isExpanded: boolean
  onToggle: (id: string) => void
}

export function CollapsibleSharePanel({ id, isExpanded, onToggle }: CollapsibleSharePanelProps) {
  const [activeTab, setActiveTab] = useState("social")
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    setCurrentUrl(window.location.href)
  }, [])

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

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

  const qrCodeSize = 256
  const logoSize = qrCodeSize * 0.2 // Reduced to 20% of QR code size
  const logoPosition = (qrCodeSize - logoSize) / 2 // Center the logo

  return (
    <div className="flex">
      {isExpanded ? (
        <div
          key="expanded"
          className="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800 h-full"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share
            </h2>
            <Button variant="ghost" size="icon" onClick={() => onToggle(id)} aria-label="Collapse share panel">
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
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                {/* Render the QR code here with image settings */}
                <QRCodeSVG
                  value={currentUrl}
                  size={qrCodeSize}
                  level="H"
                  bgColor="transparent" // Make background transparent to use parent's background
                  fgColor="currentColor" // Use current text color for QR code
                  className="text-gray-900 dark:text-gray-50" // Apply text color for dark/light mode
                  imageSettings={{
                    src: "/favicon.png", // Path to your logo
                    x: logoPosition,
                    y: logoPosition,
                    height: logoSize,
                    width: logoSize,
                    excavate: true, // Create a transparent hole for the image
                  }}
                />
              </div>
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
                {/* Content inside this div is scrollable */}
                {filteredPlatforms.map((platform) => (
                  <button
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
                  </button>
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
        </div>
      ) : (
        <button
          key="collapsed"
          className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary rounded-l-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-200 flex items-center justify-center h-12 w-12"
          onClick={() => onToggle(id)}
          aria-label="Expand share panel"
        >
          <Share2 className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
