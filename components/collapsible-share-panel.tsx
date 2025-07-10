"use client"
import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, X, Copy, QrCode, Search, Facebook, Twitter, Linkedin, MessageSquare, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useClipboard } from "@/hooks/use-clipboard"
import { useWebShare } from "@/hooks/use-web-share"
import QRCode from "qrcode.react" // Assuming you have this installed or a similar QR code library

interface SharePlatform {
  name: string
  icon: ReactNode
  url: string
}

export function CollapsibleSharePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("https://cleanpro.vercel.app") // Default URL
  const [shareTitle, setShareTitle] = useState("CleanPro - Professional Cleaning Services")
  const [shareText, setShareText] = useState("Get your home sparkling clean with CleanPro! Book now for a fresh start.")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { copy, copied } = useClipboard()
  const { share, isSupported: isWebShareSupported } = useWebShare()

  const togglePanel = () => setIsOpen(!isOpen)

  const handleCopyLink = () => {
    copy(shareUrl)
    toast({
      title: "Link Copied!",
      description: "The shareable link has been copied to your clipboard.",
      duration: 2000,
    })
  }

  const handleWebShare = async () => {
    if (isWebShareSupported) {
      try {
        await share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        toast({
          title: "Shared Successfully!",
          description: "Content has been shared via native sharing options.",
          duration: 2000,
        })
      } catch (error) {
        console.error("Web Share API failed:", error)
        toast({
          title: "Sharing Failed",
          description: "Could not share content. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } else {
      toast({
        title: "Web Share Not Supported",
        description: "Your browser does not support the Web Share API. Please use other options.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const sharePlatforms: SharePlatform[] = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
    { name: "SMS", icon: MessageSquare, url: `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}` },
    // Add more platforms as needed
  ]

  const filteredPlatforms = sharePlatforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50, x: 50, transition: { duration: 0.2 } },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-20 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={togglePanel}
        aria-label={isOpen ? "Close share panel" : "Open share panel"}
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-20 z-40 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border border-purple-200 bg-background shadow-lg sm:max-w-md"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="share-panel-title" className="text-xl font-semibold">
                Share This Page
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close share panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator />

            <Tabs defaultValue="quick-share" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="quick-share"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Quick Share
                </TabsTrigger>
                <TabsTrigger
                  value="all-platforms"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  All Platforms
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick-share" className="flex-1 p-4 space-y-4 overflow-auto">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="share-url">Shareable Link</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="share-url" value={shareUrl} readOnly className="flex-1" />
                    <Button onClick={handleCopyLink} size="icon" aria-label="Copy link">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleWebShare} disabled={!isWebShareSupported} className="h-auto py-3">
                    <Share2 className="mr-2 h-5 w-5" /> Native Share
                  </Button>
                  <Button
                    onClick={() => {
                      /* Implement QR code download/print */ toast({
                        title: "QR Code Action",
                        description: "QR code functionality to be implemented.",
                        duration: 2000,
                      })
                    }}
                    className="h-auto py-3"
                  >
                    <QrCode className="mr-2 h-5 w-5" /> QR Code
                  </Button>
                </div>

                <Separator />

                <div className="flex flex-col items-center justify-center p-4">
                  <h3 className="mb-4 text-lg font-medium">Scan QR Code</h3>
                  <div className="rounded-lg border p-2">
                    <QRCode value={shareUrl} size={180} level="H" renderAs="svg" />
                  </div>
                  <p className="mt-2 text-center text-sm text-muted-foreground">Scan this code to share the link.</p>
                </div>
              </TabsContent>

              <TabsContent value="all-platforms" className="flex-1 p-4 flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search platforms..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search sharing platforms"
                  />
                </div>
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {filteredPlatforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {platform.icon}
                        <span className="text-sm font-medium">{platform.name}</span>
                      </a>
                    ))}
                    {filteredPlatforms.length === 0 && (
                      <p className="col-span-full text-center text-muted-foreground">No platforms found.</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
