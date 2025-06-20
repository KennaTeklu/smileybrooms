"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Share2, Copy, Mail, MessageSquare, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CollapsibleSharePanelProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  shareText: string
  dynamicTop: number // New prop for dynamic positioning
  setPanelHeight: (height: number) => void // Callback to report height
}

export function CollapsibleSharePanel({
  isOpen,
  onClose,
  shareUrl,
  shareText,
  dynamicTop,
  setPanelHeight,
}: CollapsibleSharePanelProps) {
  const { toast } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isOpen, setPanelHeight]) // Recalculate height when open state changes

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied!",
      description: "The shareable link has been copied to your clipboard.",
    })
  }

  const handleShareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent("Check out this!")}&body=${encodeURIComponent(
      shareText + "\n\n" + shareUrl,
    )}`
  }

  const handleShareViaSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`
  }

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed right-4 z-[998] transition-all duration-300 ease-in-out"
      style={{ top: `${dynamicTop}px` }}
    >
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="share-link" className="sr-only">
              Share Link
            </Label>
            <div className="flex space-x-2">
              <Input id="share-link" readOnly value={shareUrl} className="flex-1" />
              <Button variant="outline" size="icon" onClick={handleCopyLink} className="bg-black text-white">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy Link</span>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleShareViaEmail}
              className="flex items-center gap-2 bg-black text-white"
            >
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button
              variant="outline"
              onClick={handleShareViaSMS}
              className="flex items-center gap-2 bg-black text-white"
            >
              <MessageSquare className="h-4 w-4" /> SMS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
