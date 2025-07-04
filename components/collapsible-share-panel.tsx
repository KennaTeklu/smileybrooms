"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, Copy, Mail, Facebook, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface CollapsibleSharePanelProps {
  onClose: () => void
  onPanelStateChange: (state: { expanded: boolean; height: number }) => void
}

const SHARE_PANEL_WIDTH = 350

export function CollapsibleSharePanel({ onClose, onPanelStateChange }: CollapsibleSharePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Always expanded when rendered by parent
  const panelRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (panelRef.current) {
      onPanelStateChange({ expanded: isExpanded, height: panelRef.current.offsetHeight })
    }
  }, [isExpanded, onPanelStateChange])

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://www.example.com"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    toast({
      title: "Link Copied!",
      description: "The page URL has been copied to your clipboard.",
    })
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: SHARE_PANEL_WIDTH }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: SHARE_PANEL_WIDTH }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed top-12 right-12 z-50",
            `w-[${SHARE_PANEL_WIDTH}px]`,
            "bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800",
          )}
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share This Page
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close share panel">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-4">
              <div>
                <Label htmlFor="share-link" className="sr-only">
                  Shareable Link
                </Label>
                <div className="flex space-x-2">
                  <Input id="share-link" readOnly value={currentUrl} className="flex-1" />
                  <Button onClick={handleCopyLink} aria-label="Copy link">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share via Social Media:</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Share on Facebook">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Share on Twitter">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Share via Email">
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
