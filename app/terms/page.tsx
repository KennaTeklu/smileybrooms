"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTerms } from "@/lib/terms-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ShieldCheck, Check, ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { hasAcceptedTerms, saveTermsAcceptance } from "@/lib/terms-utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function TermsPage() {
  const { termsAccepted, acceptTerms } = useTerms()
  const [activeTab, setActiveTab] = useState<string>("terms")
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
  })
  const [localTermsAccepted, setLocalTermsAccepted] = useState(false)
  const { toast } = useToast()

  // Check if terms have been accepted
  useEffect(() => {
    setLocalTermsAccepted(termsAccepted || hasAcceptedTerms())
  }, [termsAccepted])

  const handleScroll = (tab: string) => (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // Consider "scrolled to bottom" when within 20px of the bottom
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setHasScrolledToBottom((prev) => ({ ...prev, [tab]: true }))
    }
  }

  const handleAcceptTerms = () => {
    acceptTerms()
    saveTermsAcceptance()
    setLocalTermsAccepted(true)
    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our terms and conditions.",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl md:text-3xl">Terms and Conditions</CardTitle>
              <CardDescription>Please review our terms and privacy policy</CardDescription>
            </div>
            {localTermsAccepted && (
              <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                <Check className="h-4 w-4 mr-1" />
                Accepted
              </div>
            )}
          </div>
        </CardHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6">
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
          </div>

          <CardContent className="p-6">
            <TabsContent value="terms" className="mt-0">
              <ScrollArea className="h-[500px] rounded-md border p-4" onScroll={handleScroll("terms")}>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Terms of Service</h3>
                  <p className="text-sm text-gray-500">Last updated: May 7, 2023</p>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">1. Introduction</h4>
                    <p>
                      Welcome to SmileyBrooms ("Company", "we", "our", "us")! These Terms of Service govern your use of
                      our website and services.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">2. Acceptance of Terms</h4>
                    <p>
                      By accessing or using our services, you agree to be bound by these Terms. If you disagree with any
                      part of the terms, you may not access the service.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">3. Service Description</h4>
                    <p>
                      SmileyBrooms provides professional cleaning services for residential and commercial properties.
                      Our services include regular cleaning, deep cleaning, move-in/move-out cleaning, and office
                      cleaning.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">4. Booking and Cancellation</h4>
                    <p>
                      You may book our services through our website or mobile app. Cancellations must be made at least
                      24 hours before the scheduled service. Late cancellations may incur a fee of up to 50% of the
                      service cost.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">5. Payment Terms</h4>
                    <p>
                      Payment is due at the time of booking. We accept credit cards, debit cards, and other payment
                      methods specified on our website. Recurring services will be automatically charged according to
                      the selected frequency.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">6. Service Guarantee</h4>
                    <p>
                      We strive to provide high-quality cleaning services. If you are not satisfied with our service,
                      please contact us within 24 hours, and we will re-clean the areas of concern at no additional
                      cost.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">7. Access to Property</h4>
                    <p>
                      You are responsible for ensuring our cleaners have access to your property at the scheduled time.
                      If our cleaners cannot access your property, you may be charged a lockout fee.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">8. Liability</h4>
                    <p>
                      We are insured for property damage caused by our cleaners. However, we are not responsible for
                      damage due to faulty or improper installation of items, pre-existing damage, or normal wear and
                      tear.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">9. Modifications to Terms</h4>
                    <p>
                      We reserve the right to modify these terms at any time. We will provide notice of significant
                      changes. Your continued use of our services after such modifications constitutes your acceptance
                      of the updated terms.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">10. Governing Law</h4>
                    <p>
                      These terms shall be governed by and construed in accordance with the laws of the state where our
                      company is registered, without regard to its conflict of law provisions.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <ScrollArea className="h-[500px] rounded-md border p-4" onScroll={handleScroll("privacy")}>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Privacy Policy</h3>
                  <p className="text-sm text-gray-500">Last updated: May 7, 2023</p>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">1. Information We Collect</h4>
                    <p>
                      We collect personal information that you voluntarily provide to us when you register, express
                      interest in our services, or otherwise contact us. This information may include your name, email
                      address, phone number, address, and payment information.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">2. How We Use Your Information</h4>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Provide, operate, and maintain our services</li>
                      <li>Improve, personalize, and expand our services</li>
                      <li>Understand and analyze how you use our services</li>
                      <li>Develop new products, services, features, and functionality</li>
                      <li>Communicate with you for customer service, updates, and marketing</li>
                      <li>Process your transactions</li>
                      <li>Find and prevent fraud</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">3. Sharing Your Information</h4>
                    <p>
                      We may share your information with our service providers who help us provide our services, comply
                      with legal obligations, or protect our rights. We do not sell your personal information to third
                      parties.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">4. Cookies and Tracking Technologies</h4>
                    <p>
                      We use cookies and similar tracking technologies to track activity on our website and store
                      certain information. You can instruct your browser to refuse all cookies or to indicate when a
                      cookie is being sent.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">5. Data Security</h4>
                    <p>
                      We implement appropriate security measures to protect your personal information. However, no
                      method of transmission over the Internet or electronic storage is 100% secure, and we cannot
                      guarantee absolute security.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">6. Your Rights</h4>
                    <p>
                      Depending on your location, you may have rights regarding your personal information, such as the
                      right to access, correct, delete, or restrict processing of your data. Please contact us to
                      exercise these rights.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">7. Children's Privacy</h4>
                    <p>
                      Our services are not intended for individuals under the age of 18. We do not knowingly collect
                      personal information from children under 18. If you become aware that a child has provided us with
                      personal information, please contact us immediately.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">8. Changes to This Privacy Policy</h4>
                    <p>
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                      the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-lg font-medium">9. Contact Us</h4>
                    <p>
                      If you have any questions about this Privacy Policy, please contact us at
                      privacy@smileybrooms.com.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 bg-gray-50 dark:bg-gray-800 border-t">
            {!localTermsAccepted ? (
              <>
                <Button
                  onClick={handleAcceptTerms}
                  disabled={!hasScrolledToBottom[activeTab]}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  Accept Terms & Conditions
                </Button>
                {!hasScrolledToBottom[activeTab] && (
                  <p className="text-amber-600 dark:text-amber-400 text-sm">
                    Please scroll to the bottom to accept the {activeTab === "terms" ? "terms" : "privacy policy"}
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex items-center gap-2 flex-1">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-300">You have accepted our terms and conditions</span>
                </div>
                <Link href="/" passHref>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Return to Home
                  </Button>
                </Link>
              </div>
            )}
          </CardFooter>
        </Tabs>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>

        <div className="flex items-center space-x-2">
          <Checkbox id="accept" />
          <Label htmlFor="accept">I have read and accept the terms</Label>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          nav, footer, button, .print\\:hidden {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .card {
            box-shadow: none !important;
            border: none !important;
          }
          .scroll-area {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  )
}
