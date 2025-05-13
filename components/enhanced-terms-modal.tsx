"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ShieldCheck } from "lucide-react"

interface EnhancedTermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  initialTab?: "terms" | "privacy"
}

export default function EnhancedTermsModal({
  isOpen,
  onClose,
  onAccept,
  initialTab = "terms",
}: EnhancedTermsModalProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<boolean>(false)

  // Reset scroll state when modal opens or tab changes
  useEffect(() => {
    setHasScrolledToBottom(false)
  }, [isOpen, activeTab])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // Consider "scrolled to bottom" when within 20px of the bottom
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setHasScrolledToBottom(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Terms and Privacy Policy
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="mt-4">
            <ScrollArea
              className="h-[400px] rounded-md border flex-grow overflow-hidden"
              onScroll={handleScroll}
              scrollHideDelay={300}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Terms of Service</h3>
                <p>Last updated: May 7, 2023</p>

                <h4 className="font-medium">1. Introduction</h4>
                <p>
                  Welcome to SmileyBrooms ("Company", "we", "our", "us")! These Terms of Service govern your use of our
                  website and services.
                </p>

                {/* Additional terms content */}
                <h4 className="font-medium">2. Acceptance of Terms</h4>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with any
                  part of the terms, you may not access the service.
                </p>

                {/* More terms content */}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="privacy" className="mt-4">
            <ScrollArea
              className="h-[400px] rounded-md border flex-grow overflow-hidden"
              onScroll={handleScroll}
              scrollHideDelay={300}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy Policy</h3>
                <p>Last updated: May 7, 2023</p>

                {/* Privacy policy content */}
                <h4 className="font-medium">1. Information We Collect</h4>
                <p>
                  We collect personal information that you voluntarily provide to us when you register, express interest
                  in our services, or otherwise contact us.
                </p>

                {/* More privacy content */}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            Close
          </Button>
          <Button
            onClick={onAccept}
            disabled={!hasScrolledToBottom && activeTab === "terms"}
            className="sm:order-2"
            aria-disabled={!hasScrolledToBottom && activeTab === "terms"}
          >
            I Accept
          </Button>
          {!hasScrolledToBottom && activeTab === "terms" && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2 sm:mt-0 sm:order-3">
              Please scroll to the bottom to accept
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
