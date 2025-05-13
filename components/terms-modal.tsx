"use client"

import type React from "react"

import { useTerms } from "@/lib/terms-context"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ShieldCheck, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function TermsModal() {
  const { showTermsModal, closeTermsModal, acceptTerms, termsAccepted } = useTerms()
  const [activeTab, setActiveTab] = useState<string>("terms")
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
  })
  const { toast } = useToast()

  // Reset scroll state when modal opens or tab changes
  useEffect(() => {
    if (showTermsModal) {
      setHasScrolledToBottom({ terms: false, privacy: false })
    }
  }, [showTermsModal, activeTab])

  const handleScroll = (tab: string) => (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // Consider "scrolled to bottom" when within 20px of the bottom
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setHasScrolledToBottom((prev) => ({ ...prev, [tab]: true }))
    }
  }

  const handleAccept = () => {
    acceptTerms()
    closeTermsModal()
    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our terms and conditions.",
    })
  }

  return (
    <Dialog open={showTermsModal} onOpenChange={closeTermsModal}>
      <DialogContent className="max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1200px] h-[90vh] p-0 gap-0 top-[5vh] translate-y-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Terms and Privacy Policy
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeTermsModal}
                className="h-8 w-8 rounded-full"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
            <div className="px-6 pt-4 border-b flex-shrink-0">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="terms" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  Privacy Policy
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-grow overflow-hidden relative">
              <TabsContent value="terms" className="h-full m-0 p-0 absolute inset-0">
                <ScrollArea className="h-full w-full" onScroll={handleScroll("terms")}>
                  <div className="space-y-4 p-6">
                    <h3 className="text-2xl font-semibold">Terms of Service</h3>
                    <p className="text-muted-foreground">Last updated: May 7, 2023</p>

                    <h4 className="text-xl font-medium mt-6">1. Introduction</h4>
                    <p className="leading-relaxed">
                      Welcome to SmileyBrooms ("Company", "we", "our", "us")! These Terms of Service govern your use of
                      our website and services.
                    </p>

                    <h4 className="text-xl font-medium mt-6">2. Acceptance of Terms</h4>
                    <p className="leading-relaxed">
                      By accessing or using our services, you agree to be bound by these Terms. If you disagree with any
                      part of the terms, you may not access the service.
                    </p>

                    <h4 className="text-xl font-medium mt-6">3. Service Description</h4>
                    <p className="leading-relaxed">
                      SmileyBrooms provides professional cleaning services for residential and commercial properties.
                      Our services include regular cleaning, deep cleaning, move-in/move-out cleaning, and office
                      cleaning.
                    </p>

                    <h4 className="text-xl font-medium mt-6">4. Booking and Cancellation</h4>
                    <p className="leading-relaxed">
                      You may book our services through our website or mobile app. Cancellations must be made at least
                      24 hours before the scheduled service. Late cancellations may incur a fee of up to 50% of the
                      service cost.
                    </p>

                    <h4 className="text-xl font-medium mt-6">5. Payment Terms</h4>
                    <p className="leading-relaxed">
                      Payment is due at the time of booking. We accept credit cards, debit cards, and other payment
                      methods specified on our website. Recurring services will be automatically charged according to
                      the selected frequency.
                    </p>

                    <h4 className="text-xl font-medium mt-6">6. Service Guarantee</h4>
                    <p className="leading-relaxed">
                      We strive to provide high-quality cleaning services. If you are not satisfied with our service,
                      please contact us within 24 hours, and we will re-clean the areas of concern at no additional
                      cost.
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="privacy" className="h-full m-0 p-0 absolute inset-0">
                <ScrollArea className="h-full w-full" onScroll={handleScroll("privacy")}>
                  <div className="space-y-4 p-6">
                    <h3 className="text-2xl font-semibold">Privacy Policy</h3>
                    <p className="text-muted-foreground">Last updated: May 7, 2023</p>

                    <h4 className="text-xl font-medium mt-6">1. Information We Collect</h4>
                    <p className="leading-relaxed">
                      We collect personal information that you voluntarily provide to us when you register, express
                      interest in our services, or otherwise contact us.
                    </p>

                    <h4 className="text-xl font-medium mt-6">2. How We Use Your Information</h4>
                    <p className="leading-relaxed">We use your information to:</p>
                    <ul className="list-disc pl-8 space-y-2 mt-2">
                      <li>Provide, operate, and maintain our services</li>
                      <li>Improve, personalize, and expand our services</li>
                      <li>Understand and analyze how you use our services</li>
                      <li>Develop new products, services, features, and functionality</li>
                      <li>Communicate with you for customer service, updates, and marketing</li>
                    </ul>

                    <h4 className="text-xl font-medium mt-6">3. Sharing Your Information</h4>
                    <p className="leading-relaxed">
                      We may share your information with our service providers who help us provide our services, comply
                      with legal obligations, or protect our rights. We do not sell your personal information to third
                      parties.
                    </p>

                    <h4 className="text-xl font-medium mt-6">4. Cookies and Tracking Technologies</h4>
                    <p className="leading-relaxed">
                      We use cookies and similar tracking technologies to track activity on our website and store
                      certain information. You can instruct your browser to refuse all cookies or to indicate when a
                      cookie is being sent.
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>

            <DialogFooter className="px-6 py-4 border-t mt-auto flex-shrink-0">
              <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
                <div className="w-full sm:w-auto order-2 sm:order-1">
                  {!hasScrolledToBottom[activeTab] && activeTab === "terms" && (
                    <p className="text-amber-600 dark:text-amber-400 text-sm">Please scroll to the bottom to accept</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <Button variant="outline" onClick={closeTermsModal} className="w-full sm:w-auto">
                    Close
                  </Button>
                  <Button
                    onClick={handleAccept}
                    disabled={!hasScrolledToBottom[activeTab] && activeTab === "terms"}
                    className="w-full sm:w-auto"
                    aria-disabled={!hasScrolledToBottom[activeTab] && activeTab === "terms"}
                  >
                    I Accept
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
