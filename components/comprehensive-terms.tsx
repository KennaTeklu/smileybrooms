"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, ChevronDown, ChevronUp, FileText, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComprehensiveTermsProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function ComprehensiveTerms({ isOpen, onAccept, onDecline }: ComprehensiveTermsProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [hasCheckedAcknowledge, setHasCheckedAcknowledge] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 20
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const Section = ({
    title,
    children,
    id,
  }: {
    title: string
    children: React.ReactNode
    id: string
  }) => {
    const isExpanded = expandedSections[id] !== false // Default to expanded

    return (
      <div className="mb-6 border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isExpanded && <div className="p-4 bg-white dark:bg-gray-900">{children}</div>}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDecline()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customer</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Legal</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 h-[50vh] mt-4" ref={scrollAreaRef} onScroll={handleScroll}>
            <TabsContent value="general" className="mt-0">
              <div className="space-y-4">
                <Section title="Introduction" id="intro">
                  <p className="mb-4">
                    Welcome to Smiley Brooms. These Terms and Conditions govern your use of our website, mobile
                    applications, and services. By accessing or using our services, you agree to be bound by these
                    Terms.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you ("Customer", "User", or "You") and
                    Smiley Brooms LLC ("Company", "We", "Us", or "Our"). Please read these terms carefully before using
                    our services.
                  </p>
                </Section>

                <Section title="Service Description" id="service-desc">
                  <p className="mb-4">
                    Smiley Brooms provides professional cleaning services for residential and commercial properties. Our
                    services include but are not limited to standard cleaning, deep cleaning, move-in/move-out cleaning,
                    and specialized cleaning services.
                  </p>
                  <p className="mb-4">
                    The specific services to be provided will be those selected by you during the booking process and
                    confirmed in your service agreement. We reserve the right to refuse service for any reason not
                    prohibited by law.
                  </p>
                  <p>
                    Service availability may vary by location, and certain services may require minimum purchases or be
                    subject to additional terms and conditions.
                  </p>
                </Section>

                <Section title="Booking and Cancellation" id="booking">
                  <p className="mb-2">
                    <strong>Booking Process:</strong> Bookings can be made through our website, mobile app, or by
                    contacting our customer service.
                  </p>
                  <p className="mb-2">
                    <strong>Confirmation:</strong> All bookings are subject to confirmation and availability of service
                    providers.
                  </p>
                  <p className="mb-2">
                    <strong>Cancellations:</strong> Cancellations must be made at least 24 hours before the scheduled
                    service. Late cancellations may incur a fee of up to 50% of the service cost.
                  </p>
                  <p className="mb-2">
                    <strong>No-shows:</strong> Failure to provide access to the property at the scheduled time will
                    result in a charge for the full service amount.
                  </p>
                  <p className="mb-2">
                    <strong>Rescheduling:</strong> Requests to reschedule must be made at least 24 hours before the
                    scheduled service to avoid cancellation fees.
                  </p>
                </Section>

                <Section title="Payment Terms" id="payment">
                  <p className="mb-2">
                    <strong>Payment Timing:</strong> Payment is required at the time of booking unless otherwise
                    specified.
                  </p>
                  <p className="mb-2">
                    <strong>Payment Methods:</strong> We accept credit/debit cards, PayPal, and other payment methods as
                    specified on our platform.
                  </p>
                  <p className="mb-2">
                    <strong>Recurring Services:</strong> Recurring service plans will be automatically charged according
                    to the selected frequency.
                  </p>
                  <p className="mb-2">
                    <strong>Price Changes:</strong> We reserve the right to modify our prices at any time. Price changes
                    will not affect already confirmed bookings.
                  </p>
                  <p className="mb-2">
                    <strong>Taxes:</strong> All applicable taxes will be added to the final price as required by law.
                  </p>
                </Section>

                <Section title="Service Guarantee" id="guarantee">
                  <p className="mb-2">
                    <strong>Quality Assurance:</strong> We strive to provide high-quality cleaning services. If you are
                    not satisfied with our service, please notify us within 24 hours, and we will re-clean the areas of
                    concern at no additional cost.
                  </p>
                  <p className="mb-2">
                    <strong>Limitations:</strong> Our satisfaction guarantee is subject to reasonable expectations and
                    does not cover pre-existing damage or conditions.
                  </p>
                  <p className="mb-2">
                    <strong>Claim Process:</strong> To make a claim under our service guarantee, you must contact our
                    customer service within 24 hours of service completion with specific details about the areas of
                    concern.
                  </p>
                </Section>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="mt-0">
              <div className="space-y-4">
                <Section title="Customer Responsibilities" id="customer-resp">
                  <p className="mb-2">
                    <strong>Safe Environment:</strong> Customers must provide a safe and accessible environment for our
                    cleaning professionals.
                  </p>
                  <p className="mb-2">
                    <strong>Valuables:</strong> Valuable or fragile items should be secured or removed from the cleaning
                    area.
                  </p>
                  <p className="mb-2">
                    <strong>Accurate Information:</strong> Customers are responsible for providing accurate information
                    about the property and specific cleaning requirements.
                  </p>
                  <p className="mb-2">
                    <strong>Property Access:</strong> Customers must ensure that our cleaning professionals have access
                    to the property at the scheduled time.
                  </p>
                  <p className="mb-2">
                    <strong>Pets:</strong> Customers should secure pets to ensure the safety of both the pets and our
                    cleaning professionals.
                  </p>
                </Section>

                <Section title="Service Expectations" id="expectations">
                  <p className="mb-2">
                    <strong>Scope of Work:</strong> Our services are limited to the cleaning tasks specified in your
                    service agreement.
                  </p>
                  <p className="mb-2">
                    <strong>Time Estimates:</strong> Service duration estimates are approximate and may vary based on
                    the condition of the property.
                  </p>
                  <p className="mb-2">
                    <strong>Cleaning Products:</strong> Unless otherwise specified, we will use our own
                    professional-grade cleaning products. If you have specific product preferences or allergies, please
                    inform us in advance.
                  </p>
                  <p className="mb-2">
                    <strong>Equipment:</strong> We provide all necessary cleaning equipment and supplies unless
                    otherwise specified.
                  </p>
                </Section>

                <Section title="Recurring Services" id="recurring">
                  <p className="mb-2">
                    <strong>Scheduling:</strong> Recurring services will be scheduled at the frequency selected during
                    booking.
                  </p>
                  <p className="mb-2">
                    <strong>Modifications:</strong> Changes to recurring service schedules must be requested at least 48
                    hours in advance.
                  </p>
                  <p className="mb-2">
                    <strong>Cancellation:</strong> Recurring service plans can be canceled with 7 days' notice.
                    Cancellation requests must be submitted in writing.
                  </p>
                  <p className="mb-2">
                    <strong>Service Adjustments:</strong> We reserve the right to adjust service details for recurring
                    plans with advance notice to the customer.
                  </p>
                </Section>

                <Section title="Communication" id="communication">
                  <p className="mb-2">
                    <strong>Contact Methods:</strong> We will communicate with you via email, phone, or through our
                    mobile application.
                  </p>
                  <p className="mb-2">
                    <strong>Service Updates:</strong> You will receive notifications about your scheduled services,
                    including confirmations and reminders.
                  </p>
                  <p className="mb-2">
                    <strong>Feedback:</strong> We encourage customers to provide feedback about our services to help us
                    improve.
                  </p>
                  <p className="mb-2">
                    <strong>Customer Support:</strong> Our customer support team is available during business hours to
                    address any questions or concerns.
                  </p>
                </Section>

                <Section title="Referral Program" id="referral">
                  <p className="mb-2">
                    <strong>Eligibility:</strong> Current customers in good standing are eligible to participate in our
                    referral program.
                  </p>
                  <p className="mb-2">
                    <strong>Rewards:</strong> Referral rewards will be issued according to the terms of the current
                    referral program.
                  </p>
                  <p className="mb-2">
                    <strong>Restrictions:</strong> Referral rewards cannot be combined with certain other promotions or
                    discounts.
                  </p>
                  <p className="mb-2">
                    <strong>Program Changes:</strong> We reserve the right to modify or terminate the referral program
                    at any time.
                  </p>
                </Section>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="mt-0">
              <div className="space-y-4">
                <Section title="Accessibility Commitment" id="access-commit">
                  <p className="mb-4">
                    Smiley Brooms is committed to providing accessible services to all customers, including those with
                    disabilities. We strive to ensure that our website, mobile applications, and services are accessible
                    to individuals with various disabilities.
                  </p>
                  <p>
                    Our accessibility initiatives are guided by the Web Content Accessibility Guidelines (WCAG) 2.1 and
                    applicable laws and regulations.
                  </p>
                </Section>

                <Section title="Visual Impairments" id="visual">
                  <p className="mb-2">
                    <strong>Website Accessibility:</strong> Our website is designed to be compatible with screen readers
                    and other assistive technologies.
                  </p>
                  <p className="mb-2">
                    <strong>Text Alternatives:</strong> We provide text alternatives for non-text content to ensure it
                    can be changed into other forms people need, such as large print, braille, speech, symbols, or
                    simpler language.
                  </p>
                  <p className="mb-2">
                    <strong>Color Contrast:</strong> We maintain sufficient color contrast between text and backgrounds
                    to ensure readability.
                  </p>
                  <p className="mb-2">
                    <strong>Resizable Text:</strong> Our website content can be resized without loss of functionality.
                  </p>
                  <p className="mb-2">
                    <strong>Service Accommodations:</strong> Customers with visual impairments can request specific
                    accommodations for our cleaning services by contacting our customer support.
                  </p>
                </Section>

                <Section title="Hearing Impairments" id="hearing">
                  <p className="mb-2">
                    <strong>Text Communication:</strong> We offer text-based communication options for customers with
                    hearing impairments.
                  </p>
                  <p className="mb-2">
                    <strong>Captions:</strong> Video content on our website includes captions or transcripts.
                  </p>
                  <p className="mb-2">
                    <strong>Service Accommodations:</strong> Customers with hearing impairments can request specific
                    accommodations for our cleaning services by contacting our customer support.
                  </p>
                </Section>

                <Section title="Mobility Impairments" id="mobility">
                  <p className="mb-2">
                    <strong>Keyboard Navigation:</strong> Our website can be navigated using a keyboard for users who
                    cannot use a mouse.
                  </p>
                  <p className="mb-2">
                    <strong>Service Accommodations:</strong> We can provide specialized cleaning services for homes
                    designed for individuals with mobility impairments.
                  </p>
                  <p className="mb-2">
                    <strong>Equipment Considerations:</strong> Our cleaning professionals are trained to work around
                    mobility equipment such as wheelchairs, walkers, and other assistive devices.
                  </p>
                </Section>

                <Section title="Cognitive Impairments" id="cognitive">
                  <p className="mb-2">
                    <strong>Clear Navigation:</strong> Our website features clear navigation and consistent layout to
                    assist users with cognitive impairments.
                  </p>
                  <p className="mb-2">
                    <strong>Simple Language:</strong> We strive to use clear, simple language throughout our website and
                    communications.
                  </p>
                  <p className="mb-2">
                    <strong>Service Accommodations:</strong> Customers with cognitive impairments can request specific
                    accommodations for our cleaning services by contacting our customer support.
                  </p>
                </Section>

                <Section title="Service Animals" id="service-animals">
                  <p className="mb-2">
                    <strong>Policy:</strong> Service animals are welcome in properties where we provide cleaning
                    services.
                  </p>
                  <p className="mb-2">
                    <strong>Notification:</strong> Please inform us in advance if a service animal will be present
                    during the cleaning service.
                  </p>
                  <p className="mb-2">
                    <strong>Considerations:</strong> Our cleaning professionals will take appropriate precautions to
                    ensure the safety and comfort of service animals.
                  </p>
                </Section>

                <Section title="Requesting Accommodations" id="request-accom">
                  <p className="mb-2">
                    <strong>Contact Method:</strong> To request accessibility accommodations, please contact our
                    customer support at (602) 800-0605 or accessibility@smileybrooms.com.
                  </p>
                  <p className="mb-2">
                    <strong>Advance Notice:</strong> We request that accommodation needs be communicated at least 48
                    hours before the scheduled service when possible.
                  </p>
                  <p className="mb-2">
                    <strong>Documentation:</strong> In some cases, we may request documentation to better understand and
                    address specific accommodation needs.
                  </p>
                </Section>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-0">
              <div className="space-y-4">
                <Section title="Liability" id="liability">
                  <p className="mb-2">
                    <strong>Insurance Coverage:</strong> Smiley Brooms is insured for property damage caused directly by
                    our cleaning professionals during service.
                  </p>
                  <p className="mb-2">
                    <strong>Claim Process:</strong> Claims must be reported within 24 hours of service completion with
                    supporting documentation.
                  </p>
                  <p className="mb-2">
                    <strong>Limitations:</strong> We are not liable for pre-existing damage, normal wear and tear, or
                    damage resulting from customer negligence.
                  </p>
                  <p className="mb-2">
                    <strong>Maximum Liability:</strong> Our liability is limited to the cost of the service provided or
                    the actual cost of repair/replacement, whichever is less.
                  </p>
                  <p className="mb-2">
                    <strong>Consequential Damages:</strong> We are not liable for indirect, special, incidental, or
                    consequential damages arising from our services.
                  </p>
                </Section>

                <Section title="Intellectual Property" id="ip">
                  <p className="mb-2">
                    <strong>Ownership:</strong> All content on our website and mobile applications, including text,
                    graphics, logos, and software, is the property of Smiley Brooms and protected by copyright laws.
                  </p>
                  <p className="mb-2">
                    <strong>Prohibited Use:</strong> Unauthorized use, reproduction, or distribution of our intellectual
                    property is prohibited.
                  </p>
                  <p className="mb-2">
                    <strong>User Content:</strong> By submitting content to our platform (such as reviews or feedback),
                    you grant us a non-exclusive, royalty-free license to use, modify, and display that content.
                  </p>
                  <p className="mb-2">
                    <strong>Trademarks:</strong> Smiley Brooms, our logo, and other marks are trademarks of Smiley
                    Brooms LLC. These may not be used without our prior written permission.
                  </p>
                </Section>

                <Section title="Privacy and Data Protection" id="privacy">
                  <p className="mb-2">
                    <strong>Privacy Policy:</strong> Our collection and use of personal information is governed by our
                    Privacy Policy.
                  </p>
                  <p className="mb-2">
                    <strong>Data Security:</strong> We implement appropriate technical and organizational measures to
                    protect your personal information.
                  </p>
                  <p className="mb-2">
                    <strong>Data Retention:</strong> We retain personal information only for as long as necessary to
                    fulfill the purposes for which it was collected.
                  </p>
                  <p className="mb-2">
                    <strong>Third-Party Sharing:</strong> We may share your information with third-party service
                    providers who assist us in operating our business.
                  </p>
                  <p className="mb-2">
                    <strong>Your Rights:</strong> You have certain rights regarding your personal information, including
                    the right to access, correct, and delete your data.
                  </p>
                </Section>

                <Section title="Dispute Resolution" id="disputes">
                  <p className="mb-2">
                    <strong>Initial Resolution:</strong> Any disputes arising from our services shall first be addressed
                    through our customer service.
                  </p>
                  <p className="mb-2">
                    <strong>Arbitration:</strong> If a resolution cannot be reached, disputes will be resolved through
                    arbitration in accordance with the laws of the state where the service was provided.
                  </p>
                  <p className="mb-2">
                    <strong>Class Action Waiver:</strong> You agree to waive any right to participate in a class action
                    lawsuit against Smiley Brooms.
                  </p>
                  <p className="mb-2">
                    <strong>Governing Law:</strong> These Terms and Conditions are governed by the laws of the state
                    where our principal place of business is located.
                  </p>
                  <p className="mb-2">
                    <strong>Venue:</strong> Any legal proceedings shall be brought exclusively in the courts of the
                    state where our principal place of business is located.
                  </p>
                </Section>

                <Section title="Modifications to Terms" id="modifications">
                  <p className="mb-2">
                    <strong>Right to Modify:</strong> Smiley Brooms reserves the right to modify these Terms and
                    Conditions at any time.
                  </p>
                  <p className="mb-2">
                    <strong>Notification:</strong> We will notify users of significant changes through our website or
                    email.
                  </p>
                  <p className="mb-2">
                    <strong>Effective Date:</strong> Changes will be effective upon posting to our website.
                  </p>
                  <p className="mb-2">
                    <strong>Continued Use:</strong> Continued use of our services after changes constitutes acceptance
                    of the modified terms.
                  </p>
                </Section>

                <Section title="Severability" id="severability">
                  <p className="mb-4">
                    If any provision of these Terms and Conditions is found to be invalid or unenforceable, the
                    remaining provisions shall remain in full force and effect.
                  </p>
                  <p>
                    The invalid or unenforceable provision shall be replaced by a valid and enforceable provision that
                    comes closest to the intention underlying the invalid provision.
                  </p>
                </Section>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className={cn("mt-4 transition-opacity duration-300", hasScrolledToBottom ? "opacity-100" : "opacity-50")}>
          <div className="flex items-start space-x-2 mb-4">
            <Checkbox
              id="terms-acknowledge"
              checked={hasCheckedAcknowledge}
              onCheckedChange={(checked) => setHasCheckedAcknowledge(checked === true)}
              disabled={!hasScrolledToBottom}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms-acknowledge"
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  !hasScrolledToBottom && "text-gray-400",
                )}
              >
                I have read and agree to the Terms and Conditions
              </Label>
              {!hasScrolledToBottom && (
                <p className="text-xs text-muted-foreground">
                  Please scroll to the bottom of each section to enable this checkbox
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button
            onClick={onAccept}
            disabled={!hasScrolledToBottom || !hasCheckedAcknowledge}
            className={cn(
              "relative",
              hasScrolledToBottom && hasCheckedAcknowledge && "bg-green-600 hover:bg-green-700",
            )}
          >
            {hasScrolledToBottom && hasCheckedAcknowledge && <Check className="mr-2 h-4 w-4" />}
            Accept Terms & Conditions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
