"use client"
import type { ReactNode } from "react"
import React from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronDown,
  Share2,
  Copy,
  QrCode,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  PhoneIcon as Whatsapp,
  PinIcon as Pinterest,
  RssIcon as Reddit,
  TwitterIcon as Tumblr,
  Link,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWebShare } from "@/hooks/use-web-share"
import QRCode from "react-qr-code" // Import the QR code library

interface SharePlatform {
  id: string
  name: string
  icon: ReactNode
  url: string
  color: string
  category: "social" | "chat" | "work" | "more"
  description: string
  popular?: boolean
  template?: string // Make template optional, but use it if present
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
    icon: <Link className="h-4 w-4" />,
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
    icon: <Whatsapp className="h-4 w-4" />,
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
    icon: <Link className="h-4 w-4" />,
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
  // Add more platforms with templates if needed for 'work' and 'more' categories
  {
    id: "github",
    name: "GitHub",
    icon: <Link className="h-4 w-4" />, // Using Link for work-related platforms
    url: "https://github.com/",
    color: "bg-gray-800",
    category: "work",
    description: "Share on GitHub",
    template: "Check out this cleaning service website: {url} - Great UI/UX design! (Shared via {platformName})",
  },
  {
    id: "slack",
    name: "Slack",
    icon: <Link className="h-4 w-4" />,
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
    icon: <Link className="h-4 w-4" />, // Using Link for print
    url: "print", // Special keyword for print
    color: "bg-gray-700",
    category: "more",
    description: "Print this page",
    template: "Printing page: {url}", // Placeholder template
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: <Pinterest className="h-4 w-4" />,
    url: "https://pinterest.com/pin/create/button/?url=",
    color: "bg-red-600",
    category: "social",
    description: "Pin this page",
    template:
      "Check out Smiley Brooms - professional cleaning that will make your home sparkle! ✨ Pin this on {platformName}: {url}",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: <Reddit className="h-4 w-4" />,
    url: "https://reddit.com/submit?url=",
    color: "bg-orange-600",
    category: "social",
    description: "Share on Reddit",
    template:
      "Just discovered Smiley Brooms - professional cleaning that will make you smile! 🧹✨ Share this on {platformName}: {url}",
  },
  {
    id: "tumblr",
    name: "Tumblr",
    icon: <Tumblr className="h-4 w-4" />,
    url: "https://www.tumblr.com/share/link?url=",
    color: "bg-pink-600",
    category: "social",
    description: "Share on Tumblr",
    template:
      "Check out Smiley Brooms - professional cleaning that will make your home sparkle! ✨ Share this on {platformName}: {url}",
  },
]

export function CollapsibleSharePanel() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [shareUrl, setShareUrl] = React.useState("https://www.smileybrooms.com/share-this-page")
  const [shareTitle, setShareTitle] = React.useState("Check out Smiley Brooms - Your Cleaning Partner!")
  const [shareText, setShareText] = React.useState(
    "Experience the best cleaning service with Smiley Brooms. Get a sparkling clean home today!",
  )
  const { toast } = useToast()
  const { share, isSupported } = useWebShare()
  const [copied, setCopied] = React.useState(false)
  const [showQR, setShowQR] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [currentUrl, setCurrentUrl] = React.useState("")
  const [shareCount, setShareCount] = React.useState(0)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const qrCodeRef = React.useRef<HTMLDivElement>(null) // Ref for QR code container

  // Handle mounting for SSR
  React.useEffect(() => {
    setIsMounted(true)
    setCurrentUrl(window.location.href)
  }, [])

  const handleCopyLink = React.useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({
      title: "Link Copied!",
      description: "The shareable link has been copied to your clipboard.",
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }, [shareUrl, toast])

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

  const handleShare = async (platform: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        toast({
          title: "Shared Successfully!",
          description: `Content shared via ${platform}.`,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        toast({
          title: "Sharing Cancelled or Failed",
          description: "Could not share content.",
          variant: "destructive",
        })
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      let url = ""
      switch (platform) {
        case "Twitter":
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
          break
        case "Facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          break
        case "LinkedIn":
          url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`
          break
        case "WhatsApp":
          url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          break
        case "Email":
          url = `mailto:?subject=${encodeURIComponent(`Check out Smiley Brooms`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
          break
        case "SMS":
          url = `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          break
        default:
          break
      }
      if (url) {
        window.open(url, "_blank")
      } else {
        toast({
          title: "Sharing Not Supported",
          description: `Direct sharing to ${platform} is not supported in this browser.`,
          variant: "destructive",
        })
      }
    }
  }

  const filteredPlatforms = sharePlatforms.filter((p) => p.name.toLowerCase().includes(shareUrl.toLowerCase()))

  const popularPlatforms = sharePlatforms.filter((platform) => platform.popular)

  const shareOnPlatform = (platform: SharePlatform) => {
    if (!isSupported) {
      toast({
        title: "Offline",
        description: "You are offline. Please connect to the internet to share.",
        variant: "destructive",
      })
      return
    }

    let shareText = platform.template || "{url}"
    shareText = shareText.replace("{url}", currentUrl).replace("{platformName}", platform.name) // Replace platform name

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

    // For platforms that don't have direct sharing URLs (e.g., Instagram, GitHub)
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-md rounded-md border bg-white p-4 shadow-sm dark:bg-gray-950"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-2">
        <h4 className="text-lg font-semibold">Share This Page</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle share panel</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4 px-4 pb-2">
        <Separator />

        <div className="grid gap-2">
          <Label htmlFor="share-url">Shareable Link</Label>
          <div className="flex space-x-2">
            <Input id="share-url" type="text" value={shareUrl} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="share-title">Title</Label>
          <Input id="share-title" type="text" value={shareTitle} onChange={(e) => setShareTitle(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="share-text">Description</Label>
          <Input id="share-text" type="text" value={shareText} onChange={(e) => setShareText(e.target.value)} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setShowQR(!showQR)} variant="outline">
            <QrCode className="mr-2 h-4 w-4" /> QR Code
          </Button>
          {isSupported && (
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Native Share
            </Button>
          )}
        </div>

        {showQR && (
          <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
            <div
              ref={qrCodeRef}
              className="w-32 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center mb-3 p-2"
            >
              <QRCode value={shareUrl} size={128} bgColor="#FFFFFF" fgColor="#000000" level="H" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">Scan to share this page</p>
            <Button size="sm" variant="outline" onClick={downloadQR}>
              <Link className="mr-2 h-3 w-3" />
              Download
            </Button>
          </div>
        )}

        <Separator />

        <h5 className="text-md font-semibold mb-2">Share on Social Media</h5>
        <div className="grid grid-cols-3 gap-4 max-h-[200px] overflow-y-auto pr-2">
          {filteredPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                {platform.icon}
              </Button>
              <span>{platform.name}</span>
            </a>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
