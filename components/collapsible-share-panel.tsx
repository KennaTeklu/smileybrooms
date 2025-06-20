"use client"

import { useRef, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, X, Copy, Printer, Download, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface CollapsibleSharePanelProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  setPanelHeight: (height: number) => void
  dynamicBottom: number
}

export function CollapsibleSharePanel({
  isExpanded,
  setIsExpanded,
  setPanelHeight,
  dynamicBottom,
}: CollapsibleSharePanelProps) {
  const { toast } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isExpanded, setPanelHeight])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Smiley Brooms Cleaning Service",
          text: "Check out Smiley Brooms for professional cleaning services!",
          url: window.location.href,
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
        title: "Web Share API not supported",
        description: "Please use the copy link option instead.",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "The page link has been copied to your clipboard.",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // This is a placeholder. Actual download logic depends on content type.
    toast({
      title: "Download initiated",
      description: "Simulating content download.",
    })
    // Example: Create a dummy blob and download
    const blob = new Blob(["This is your downloaded content."], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-content.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed right-4 z-[998] transition-all duration-300 ease-in-out",
        isExpanded ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible",
      )}
      style={{ bottom: `${dynamicBottom}px` }}
    >
      <Card className="w-72 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-lg font-semibold">Share Options</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} aria-label="Close share panel">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-2 grid gap-2">
          <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share via Web Share
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" /> Copy Link
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Page
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download Content
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" /> SMS
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
