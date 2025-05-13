"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SharePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = "Check out SmileyBrooms - Professional Cleaning Services"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        duration: 3000,
      })
    })
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      "_blank",
    )
  }

  const shareViaLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
      `Check out this website: ${shareUrl}`,
    )}`
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-40 right-4 z-50 rounded-full shadow-md"
        onClick={togglePanel}
        aria-label="Share this page"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-40 right-16 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-64 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Share This Page</h3>
            <Button variant="ghost" size="sm" onClick={togglePanel} aria-label="Close share panel">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={shareViaFacebook}>
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={shareViaTwitter}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={shareViaLinkedin}>
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={shareViaEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
