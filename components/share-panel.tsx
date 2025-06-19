/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import {
  Share2,
  ChevronLeft,
  Search,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Copy,
  Printer,
  MessageCircle,
  Phone,
  Send,
  Github,
  Slack,
  DiscIcon as Discord,
  Dribbble,
  Figma,
  Framer,
  Gitlab,
  Pocket,
  Trello,
  Bookmark,
  ImageIcon,
  Code,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useClickOutside } from "@/hooks/use-click-outside"

type SocialPlatform = {
  name: string
  icon: React.ReactNode
  color: string
  url: string
  template?: string
}

const socialPlatforms: Record<string, SocialPlatform[]> = {
  social: [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-[#1877F2] hover:bg-[#0E65D9]",
      url: "https://www.facebook.com/sharer/sharer.php?u=",
      template: "Check out Smiley Brooms - professional cleaning that will make your home sparkle! ✨ {url}",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-[#1DA1F2] hover:bg-[#0C85D0]",
      url: "https://twitter.com/intent/tweet?text=",
      template: "Just discovered Smiley Brooms - professional cleaning that will make you smile! 🧹✨ {url}",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-[#0A66C2] hover:bg-[#084E96]",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
      template:
        "I recommend this professional cleaning service for homes and offices: {url} #ProfessionalCleaning #SmileyBrooms",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-[#E4405F] hover:bg-[#D1264A]",
      url: "https://www.instagram.com/",
      template: "Check out @SmileyBrooms for your cleaning needs! Link in bio: {url} #CleanHome #ProfessionalCleaning",
    },
    {
      name: "Pinterest",
      icon: <ImageIcon className="h-5 w-5" />,
      color: "bg-[#BD081C] hover:bg-[#9E0718]",
      url: "https://pinterest.com/pin/create/button/?url=",
      template: "Professional cleaning services that transform your space! #HomeDecor #CleaningTips {url}",
    },
    {
      name: "Reddit",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#FF4500] hover:bg-[#E03D00]",
      url: "https://www.reddit.com/submit?url=",
      template: "Found this great cleaning service - anyone else tried them? {url}",
    },
    {
      name: "Tumblr",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#36465D] hover:bg-[#29364A]",
      url: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=",
      template: "Smiley Brooms - Professional Cleaning Services ✨🧹 {url}",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#25D366] hover:bg-[#20BD5C]",
      url: "https://api.whatsapp.com/send?text=",
      template: "Hey! Check out this cleaning service I found. They're amazing! 🧹✨ {url}",
    },
    {
      name: "Telegram",
      icon: <Send className="h-5 w-5" />,
      color: "bg-[#0088CC] hover:bg-[#0077B3]",
      url: "https://t.me/share/url?url=",
      template: "Found a great cleaning service - Smiley Brooms! Professional cleaning for your home or office: {url}",
    },
    {
      name: "Snapchat",
      icon: <ImageIcon className="h-5 w-5" />,
      color: "bg-[#FFFC00] hover:bg-[#E6E300] text-black",
      url: "https://www.snapchat.com/",
      template: "Swipe up to check out this amazing cleaning service! 🧹✨ {url}",
    },
  ],
  messaging: [
    {
      name: "Messenger",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#0084FF] hover:bg-[#0073E6]",
      url: "https://www.messenger.com/",
      template:
        "Hey, I found this great cleaning service! Check them out: {url} They offer professional cleaning with a smile! 😊",
    },
    {
      name: "Skype",
      icon: <Phone className="h-5 w-5" />,
      color: "bg-[#00AFF0] hover:bg-[#0099D6]",
      url: "https://web.skype.com/",
      template: "Looking for a cleaning service? I recommend Smiley Brooms: {url} They're professional and reliable!",
    },
    {
      name: "Slack",
      icon: <Slack className="h-5 w-5" />,
      color: "bg-[#4A154B] hover:bg-[#3B1139]",
      url: "https://slack.com/",
      template:
        "Found a great cleaning service for our office: {url} - They offer professional cleaning with flexible scheduling!",
    },
    {
      name: "Discord",
      icon: <Discord className="h-5 w-5" />,
      color: "bg-[#5865F2] hover:bg-[#4752C4]",
      url: "https://discord.com/",
      template:
        "Hey everyone! Check out this cleaning service I just used: {url} - They did an amazing job on my place!",
    },
    {
      name: "WeChat",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#7BB32E] hover:bg-[#6A9D29]",
      url: "https://www.wechat.com/",
      template:
        "Professional cleaning service recommendation: {url} - Smiley Brooms offers quality cleaning for homes and offices!",
    },
    {
      name: "Line",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#00C300] hover:bg-[#00A900]",
      url: "https://line.me/",
      template: "Check out Smiley Brooms for your cleaning needs! {url} - Professional, reliable, and affordable!",
    },
    {
      name: "Viber",
      icon: <Phone className="h-5 w-5" />,
      color: "bg-[#7360F2] hover:bg-[#5D4BD9]",
      url: "https://www.viber.com/",
      template: "Hey! I just used this cleaning service and they're amazing: {url} - My home has never been cleaner!",
    },
  ],
  professional: [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      color: "bg-[#181717] hover:bg-[#2B2B2B]",
      url: "https://github.com/",
      template: "Check out this cleaning service website: {url} - Great UI/UX design!",
    },
    {
      name: "GitLab",
      icon: <Gitlab className="h-5 w-5" />,
      color: "bg-[#FC6D26] hover:bg-[#E65C21]",
      url: "https://gitlab.com/",
      template: "Interesting cleaning service website: {url} - Clean code, clean homes!",
    },
    {
      name: "Dribbble",
      icon: <Dribbble className="h-5 w-5" />,
      color: "bg-[#EA4C89] hover:bg-[#D83A7D]",
      url: "https://dribbble.com/",
      template: "Love the design of this cleaning service website! {url} - Great color scheme and layout!",
    },
    {
      name: "Behance",
      icon: <ImageIcon className="h-5 w-5" />,
      color: "bg-[#1769FF] hover:bg-[#0F5BDA]",
      url: "https://www.behance.net/",
      template: "Great UI design for this cleaning service: {url} - Modern, clean, and user-friendly!",
    },
    {
      name: "Figma",
      icon: <Figma className="h-5 w-5" />,
      color: "bg-[#F24E1E] hover:bg-[#D9421A]",
      url: "https://www.figma.com/",
      template: "Interesting design patterns on this cleaning service website: {url} - Worth checking out!",
    },
    {
      name: "Framer",
      icon: <Framer className="h-5 w-5" />,
      color: "bg-[#0055FF] hover:bg-[#0044CC]",
      url: "https://www.framer.com/",
      template: "Check out the animations on this cleaning service site: {url} - Smooth transitions and great UX!",
    },
    {
      name: "Medium",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#000000] hover:bg-[#333333]",
      url: "https://medium.com/",
      template:
        "I found this great cleaning service that transformed my home: {url} - Here's my experience with Smiley Brooms!",
    },
    {
      name: "Dev.to",
      icon: <Code className="h-5 w-5" />,
      color: "bg-[#0A0A0A] hover:bg-[#333333]",
      url: "https://dev.to/",
      template: "Check out this well-designed cleaning service website: {url} - Great example of modern web design!",
    },
    {
      name: "Stack Overflow",
      icon: <Code className="h-5 w-5" />,
      color: "bg-[#F58025] hover:bg-[#E67321]",
      url: "https://stackoverflow.com/",
      template: "Interesting implementation on this cleaning service site: {url} - Any thoughts on the tech stack?",
    },
  ],
  other: [
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      color: "bg-gray-600 hover:bg-gray-700",
      url: "mailto:?body=",
      template:
        "Subject: Check out this amazing cleaning service!\n\nHi,\n\nI found this great cleaning service called Smiley Brooms. They offer professional cleaning with a smile!\n\n{url}\n\nTheir services include regular cleaning, deep cleaning, move-in/out cleaning, and office cleaning. Prices are competitive and the quality is excellent.\n\nThought you might be interested.\n\nBest regards,",
    },
    {
      name: "SMS",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700",
      url: "sms:?body=",
      template: "Check out Smiley Brooms for your cleaning needs! Professional, reliable, and affordable: {url}",
    },
    {
      name: "Copy Link",
      icon: <Copy className="h-5 w-5" />,
      color: "bg-gray-500 hover:bg-gray-600",
      url: "",
    },
    {
      name: "Print",
      icon: <Printer className="h-5 w-5" />,
      color: "bg-gray-700 hover:bg-gray-800",
      url: "print",
    },
    {
      name: "Pocket",
      icon: <Pocket className="h-5 w-5" />,
      color: "bg-[#EF3F56] hover:bg-[#DA3A4D]",
      url: "https://getpocket.com/save?url=",
      template: "Save this cleaning service for later: {url} - Smiley Brooms offers professional cleaning services!",
    },
    {
      name: "Instapaper",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#1F1F1F] hover:bg-[#333333]",
      url: "https://www.instapaper.com/edit?url=",
      template: "Smiley Brooms - Professional Cleaning Services: {url} - Save for your next cleaning needs!",
    },
    {
      name: "Flipboard",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#E12828] hover:bg-[#C91F1F]",
      url: "https://share.flipboard.com/bookmarklet/popout?v=2&url=",
      template:
        "Professional cleaning services that will make you smile: {url} - Smiley Brooms offers quality cleaning!",
    },
    {
      name: "Evernote",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#00A82D] hover:bg-[#008F26]",
      url: "https://www.evernote.com/clip.action?url=",
      template: "Smiley Brooms - Cleaning Service to remember: {url} - Note for future cleaning needs!",
    },
    {
      name: "Trello",
      icon: <Trello className="h-5 w-5" />,
      color: "bg-[#0079BF] hover:bg-[#006AA3]",
      url: "https://trello.com/",
      template: "Task: Check out this cleaning service - {url} - Consider booking for monthly cleaning!",
    },
    {
      name: "Notion",
      icon: <Bookmark className="h-5 w-5" />,
      color: "bg-[#000000] hover:bg-[#333333]",
      url: "https://www.notion.so/",
      template:
        "Smiley Brooms - Professional Cleaning Services\n\n{url}\n\nServices:\n- Regular Cleaning\n- Deep Cleaning\n- Move-in/out Cleaning\n- Office Cleaning",
    },
  ],
}

export default function SharePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [scrollY, setScrollY] = useState(0)
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const { toast } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)

  // Smooth scroll position with spring physics
  const smoothScrollY = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  // Track scroll position with smooth animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      smoothScrollY.set(window.scrollY)
    }

    // Use passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial position setting
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [smoothScrollY])

  // Close panel when clicking outside
  useClickOutside(panelRef, () => {
    if (isOpen) setIsOpen(false)
  })

  // Get current URL and page title
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
      setCurrentTitle(document.title || "Smiley Brooms")
    }
  }, [])

  const handleShare = (platform: SocialPlatform) => {
    // Prepare the share text with template
    let shareText = platform.template || "{url}"
    shareText = shareText.replace("{url}", currentUrl).replace("{title}", currentTitle)

    if (platform.name === "Copy Link") {
      navigator.clipboard.writeText(currentUrl)
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

    // For platforms that don't have direct sharing URLs
    if (
      [
        "Instagram",
        "Snapchat",
        "Messenger",
        "WeChat",
        "Line",
        "Viber",
        "Slack",
        "Discord",
        "GitHub",
        "GitLab",
        "Figma",
        "Framer",
        "Notion",
        "Trello",
      ].includes(platform.name)
    ) {
      // Copy the text to clipboard for manual sharing
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
    ? Object.values(socialPlatforms)
        .flat()
        .filter((platform) => platform.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : null

  return (
    <motion.div
      className="fixed right-0 z-50"
      style={{
        top: scrollY > 100 ? "auto" : "50%",
        bottom: scrollY > 100 ? "80px" : "auto",
        y: scrollY > 100 ? 0 : "-50%",
        transition: "top 0.3s ease, bottom 0.3s ease, transform 0.3s ease",
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-l-lg overflow-hidden flex"
          >
            <div className="w-72 sm:w-80 max-h-[80vh] overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search platforms..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Copy Link Button */}
              <Button
                variant="default"
                className="w-full mb-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl)
                  toast({
                    title: "Link copied!",
                    description: "The link has been copied to your clipboard.",
                    duration: 3000,
                  })
                }}
              >
                <Link className="h-4 w-4" />
                <span>Copy Link to Clipboard</span>
              </Button>

              {filteredPlatforms ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredPlatforms.map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className={cn("flex items-center justify-start gap-2 text-white", platform.color)}
                      onClick={() => handleShare(platform)}
                    >
                      {platform.icon}
                      <span className="truncate">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <Tabs defaultValue="social" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="messaging">Chat</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>

                  {Object.entries(socialPlatforms).map(([category, platforms]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {platforms.map((platform) => (
                          <Button
                            key={platform.name}
                            variant="outline"
                            className={cn("flex items-center justify-start gap-2 text-white", platform.color)}
                            onClick={() => handleShare(platform)}
                          >
                            {platform.icon}
                            <span className="truncate">{platform.name}</span>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex items-center justify-center p-3 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open share options"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
