"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share2, QrCode, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import QRCode from "react-qr-code"

interface CollapsibleSharePanelProps {
  isOpen: boolean
  onClose: () => void
  shareUrl?: string
  title?: string
  text?: string
}

export function CollapsibleSharePanel({
  isOpen,
  onClose,
  shareUrl: propShareUrl,
  title = "SmileyBrooms",
  text = "Check out SmileyBrooms for amazing cleaning services!",
}: CollapsibleSharePanelProps) {
  const { toast } = useToast()
  const [currentUrl, setCurrentUrl] = useState("")
  const [showQrCode, setShowQrCode] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCurrentUrl(propShareUrl || window.location.href)
    }
  }, [isOpen, propShareUrl])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: currentUrl,
        })
        toast({
          title: "Shared successfully!",
          description: "The content has been shared.",
        })
      } catch (error) {
        console.error("Error sharing:", error)
        toast({
          title: "Sharing failed",
          description: "Could not share the content.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support the Web Share API.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl)
    toast({
      title: "Link copied!",
      description: "The page URL has been copied to your clipboard.",
    })
  }

  const handleToggleQrCode = () => {
    setShowQrCode((prev) => !prev)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-lg">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Share this page</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <SheetDescription className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Share the current page with your friends and family.
        </SheetDescription>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-url">Page URL</Label>
            <div className="flex items-center space-x-2">
              <Input id="share-url" readOnly value={currentUrl} className="flex-1" />
              <Button type="button" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button onClick={handleToggleQrCode} className="flex-1">
              <QrCode className="mr-2 h-4 w-4" /> {showQrCode ? "Hide QR" : "Show QR"}
            </Button>
          </div>
          {showQrCode && currentUrl && (
            <div className="flex justify-center p-4">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <QRCode value={currentUrl} size={256} level="H" />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
