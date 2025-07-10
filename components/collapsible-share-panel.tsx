"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, X, Search, QrCode, Mail, MessageSquare, Facebook, Twitter, Linkedin, Clipboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function CollapsibleSharePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
      // In a real app, you'd generate a QR code image from shareUrl
      // For now, a placeholder or a simple text-based QR code link
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`,
      )
    }
  }, [])

  const togglePanel = () => setIsOpen(!isOpen)

  // Close panel if ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "The page URL has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadQrCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = "qrcode.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: "QR Code Downloaded!",
        description: "The QR code image has been downloaded.",
      })
    }
  }

  const sharePlatforms = [
    { name: "Email", icon: Mail, action: () => window.open(`mailto:?subject=Check out this page&body=${shareUrl}`) },
    { name: "SMS", icon: MessageSquare, action: () => window.open(`sms:?body=Check out this page: ${shareUrl}`) },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank"),
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out this page`, "_blank"),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`, "_blank"),
    },
    // Add more platforms as needed
  ]

  const filteredPlatforms = sharePlatforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-20 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
        onClick={togglePanel}
        aria-label={isOpen ? "Close share panel" : "Open share panel"}
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-4 right-4 z-50 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border bg-background shadow-lg sm:max-w-md",
              "border-purple-200 bg-purple-50/50 backdrop-blur-md dark:border-purple-800 dark:bg-purple-950/50",
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="share-panel-title" className="text-xl font-bold text-purple-800 dark:text-purple-200">
                Share This Page
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close share panel">
                <X className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </Button>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search platforms..."
                  className="pl-9 pr-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Tabs defaultValue="quick-actions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
                  <TabsTrigger value="all-platforms">All Platforms</TabsTrigger>
                </TabsList>
                <TabsContent value="quick-actions" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleCopyLink} className="h-auto flex-col py-3 bg-transparent">
                      <Clipboard className="mb-1 h-5 w-5" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadQrCode}
                      className="h-auto flex-col py-3 bg-transparent"
                    >
                      <QrCode className="mb-1 h-5 w-5" />
                      Download QR
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sharePlatforms[0].action()}
                      className="h-auto flex-col py-3"
                    >
                      <Mail className="mb-1 h-5 w-5" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sharePlatforms[1].action()}
                      className="h-auto flex-col py-3"
                    >
                      <MessageSquare className="mb-1 h-5 w-5" />
                      SMS
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="all-platforms" className="mt-4">
                  <ScrollArea className="h-[calc(80vh-250px)] pr-4">
                    <div className="grid grid-cols-2 gap-3">
                      {filteredPlatforms.length > 0 ? (
                        filteredPlatforms.map((platform) => (
                          <Button
                            key={platform.name}
                            variant="outline"
                            onClick={platform.action}
                            className="h-auto flex-col py-3 bg-transparent"
                          >
                            <platform.icon className="mb-1 h-5 w-5" />
                            {platform.name}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-2 text-center text-gray-500">No platforms found.</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
