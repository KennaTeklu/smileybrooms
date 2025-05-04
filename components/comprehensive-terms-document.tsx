"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, FileText } from "lucide-react"

interface ComprehensiveTermsDocumentProps {
  onAccept?: () => void
  onDecline?: () => void
  showActions?: boolean
  initialTab?: string
}

export function ComprehensiveTermsDocument({
  onAccept,
  onDecline,
  showActions = true,
  initialTab = "general",
}: ComprehensiveTermsDocumentProps) {
  const [accepted, setAccepted] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // Consider "scrolled to bottom" when user has scrolled to 90% of the content
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      setHasScrolledToBottom(true)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" />
          Terms and Conditions
        </h2>
        <p className="mt-2 opacity-90">Please read these terms carefully before using our services</p>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <div className="px-6 pt-4 border-b">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[400px] p-6" onScroll={handleScroll}>
          <TabsContent value="general" className="mt-0 space-y-4">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
              <p className="text-gray-700 mb-2">
                Welcome to Smiley Brooms. These Terms and Conditions govern your use of our website, mobile
                applications, and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 mb-2">
                These Terms constitute a legally binding agreement between you and Smiley Brooms. If you do not agree
                with any part of these Terms, you must not use our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Definitions</h3>
              <p className="text-gray-700 mb-2">
                <strong>"Services"</strong> refers to cleaning services, consultations, and any other services offered
                by Smiley Brooms.
              </p>
              <p className="text-gray-700 mb-2">
                <strong>"User"</strong> refers to any individual who accesses or uses our website, mobile applications,
                or services.
              </p>
              <p className="text-gray-700 mb-2">
                <strong>"Content"</strong> refers to text, images, videos, audio, and other materials that appear on our
                platforms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Service Description</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms provides professional cleaning services for residential and commercial properties. Our
                services include but are not limited to regular cleaning, deep cleaning, move-in/move-out cleaning, and
                specialized cleaning services.
              </p>
              <p className="text-gray-700 mb-2">
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without
                prior notice.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. User Accounts</h3>
              <p className="text-gray-700 mb-2">
                To access certain features of our services, you may need to create an account. You are responsible for
                maintaining the confidentiality of your account credentials and for all activities that occur under your
                account.
              </p>
              <p className="text-gray-700 mb-2">
                You agree to provide accurate, current, and complete information during the registration process and to
                update such information to keep it accurate, current, and complete.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Privacy Policy</h3>
              <p className="text-gray-700 mb-2">
                Our Privacy Policy, which is incorporated into these Terms by reference, explains how we collect, use,
                and disclose information about you. By using our services, you consent to our collection, use, and
                disclosure of information as described in our Privacy Policy.
              </p>
            </section>
          </TabsContent>

          <TabsContent value="customer" className="mt-0 space-y-4">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Booking and Scheduling</h3>
              <p className="text-gray-700 mb-2">
                Customers may book cleaning services through our website, mobile application, or by contacting our
                customer service. All bookings are subject to availability and confirmation.
              </p>
              <p className="text-gray-700 mb-2">
                We require at least 24 hours' notice for scheduling or rescheduling services. Late cancellations or
                no-shows may incur fees as outlined in our Cancellation Policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Access to Property</h3>
              <p className="text-gray-700 mb-2">
                Customers must provide safe and reasonable access to the property for our cleaning professionals. This
                includes providing necessary entry instructions, alarm codes, or keys as applicable.
              </p>
              <p className="text-gray-700 mb-2">
                Customers are responsible for securing or removing valuable or fragile items before the cleaning
                service. Smiley Brooms is not responsible for damage to items that were not properly secured or for
                pre-existing conditions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Payment Terms</h3>
              <p className="text-gray-700 mb-2">
                Payment is required at the time of booking unless otherwise specified. We accept major credit cards,
                digital payment methods, and other forms of payment as indicated on our platforms.
              </p>
              <p className="text-gray-700 mb-2">
                Prices are subject to change without notice. Any price changes will not affect already confirmed
                bookings.
              </p>
              <p className="text-gray-700 mb-2">
                Additional charges may apply for services requested beyond the scope of the original booking, such as
                cleaning additional areas or handling excessive dirt or clutter.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Satisfaction Guarantee</h3>
              <p className="text-gray-700 mb-2">
                We strive to provide high-quality cleaning services. If you are not satisfied with our service, please
                notify us within 24 hours of service completion, and we will address your concerns promptly.
              </p>
              <p className="text-gray-700 mb-2">
                In case of legitimate dissatisfaction, we may offer to re-clean the affected areas or provide a partial
                refund at our discretion.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Customer Responsibilities</h3>
              <p className="text-gray-700 mb-2">
                Customers are responsible for accurately describing the property and cleaning needs when booking
                services. Misrepresentation may result in additional charges or service refusal.
              </p>
              <p className="text-gray-700 mb-2">
                Customers must ensure that the property is safe for our cleaning professionals. This includes securing
                pets, addressing any hazardous conditions, and informing us of any special precautions needed.
              </p>
            </section>
          </TabsContent>

          <TabsContent value="business" className="mt-0 space-y-4">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Service Providers</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms employs trained cleaning professionals who undergo background checks and receive proper
                training in cleaning techniques and safety protocols.
              </p>
              <p className="text-gray-700 mb-2">
                We reserve the right to assign or reassign cleaning professionals to any booking at our discretion.
                While we try to accommodate requests for specific cleaning professionals, we cannot guarantee
                availability.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Service Limitations</h3>
              <p className="text-gray-700 mb-2">
                Our cleaning services do not include moving heavy furniture, cleaning biohazardous materials, handling
                pest infestations, or performing repairs or maintenance tasks.
              </p>
              <p className="text-gray-700 mb-2">
                We reserve the right to refuse service if the property conditions pose health or safety risks to our
                cleaning professionals or if the requested services fall outside our scope of services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Quality Control</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms implements quality control measures to ensure consistent service quality. This may include
                follow-up surveys, spot checks, and regular training for our cleaning professionals.
              </p>
              <p className="text-gray-700 mb-2">
                We welcome customer feedback as part of our continuous improvement process. Feedback can be provided
                through our website, mobile application, or by contacting customer service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Business Hours and Availability</h3>
              <p className="text-gray-700 mb-2">
                Our standard business hours are Monday through Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM
                to 5:00 PM. Services outside these hours may be available at an additional cost.
              </p>
              <p className="text-gray-700 mb-2">
                Service availability may vary by location and season. We will inform customers of any limitations in
                availability when they book services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Insurance and Liability</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms maintains appropriate insurance coverage for our business operations. However, our
                liability is limited as specified in the Legal section of these Terms.
              </p>
              <p className="text-gray-700 mb-2">
                We are not responsible for pre-existing damage, normal wear and tear, or damage resulting from customer
                negligence or misrepresentation of property conditions.
              </p>
            </section>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-0 space-y-4">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Commitment to Accessibility</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms is committed to making our website, mobile applications, and services accessible to all
                users, including those with disabilities. We strive to comply with applicable accessibility standards
                and guidelines.
              </p>
              <p className="text-gray-700 mb-2">
                Our accessibility features include screen reader compatibility, keyboard navigation, color contrast
                considerations, and text resizing options. We continuously work to improve the accessibility of our
                digital platforms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Visual Impairment Accommodations</h3>
              <p className="text-gray-700 mb-2">
                Our website and mobile applications are designed to be compatible with screen readers and other
                assistive technologies used by individuals with visual impairments.
              </p>
              <p className="text-gray-700 mb-2">
                We provide text alternatives for non-text content, ensure sufficient color contrast, and allow for text
                resizing without loss of functionality.
              </p>
              <p className="text-gray-700 mb-2">
                Customers with visual impairments can request special accommodations for service delivery by contacting
                our customer service team.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Hearing Impairment Accommodations</h3>
              <p className="text-gray-700 mb-2">
                We provide text-based alternatives for audio content and ensure that important information is not
                conveyed through audio alone.
              </p>
              <p className="text-gray-700 mb-2">
                Customers with hearing impairments can communicate with us through email, chat, or text messaging. We
                also accommodate requests for written instructions or communication.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Motor and Mobility Accommodations</h3>
              <p className="text-gray-700 mb-2">
                Our digital platforms are designed to be navigable using keyboard controls and are compatible with
                various input devices used by individuals with motor impairments.
              </p>
              <p className="text-gray-700 mb-2">
                For our cleaning services, customers with mobility challenges can specify any special requirements or
                considerations when booking services. Our cleaning professionals will accommodate these needs to the
                extent possible.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Cognitive Accessibility</h3>
              <p className="text-gray-700 mb-2">
                We strive to present information in clear, simple language and provide consistent navigation throughout
                our digital platforms to assist users with cognitive disabilities.
              </p>
              <p className="text-gray-700 mb-2">
                Our booking process is designed to be straightforward, with clear instructions and minimal complexity.
                Customer service representatives are available to provide additional assistance if needed.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Feedback and Continuous Improvement</h3>
              <p className="text-gray-700 mb-2">
                We welcome feedback on the accessibility of our platforms and services. Users can report accessibility
                issues or request accommodations by contacting our customer service team.
              </p>
              <p className="text-gray-700 mb-2">
                We are committed to addressing accessibility concerns promptly and continuously improving our
                accessibility features and accommodations.
              </p>
            </section>
          </TabsContent>

          <TabsContent value="legal" className="mt-0 space-y-4">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Intellectual Property</h3>
              <p className="text-gray-700 mb-2">
                All content on our website and mobile applications, including text, graphics, logos, images, audio
                clips, and software, is the property of Smiley Brooms or its content suppliers and is protected by
                copyright laws.
              </p>
              <p className="text-gray-700 mb-2">
                Users may not reproduce, distribute, modify, display, perform, or use any content from our platforms
                without prior written permission from Smiley Brooms.
              </p>
              <p className="text-gray-700 mb-2">
                The Smiley Brooms name, logo, and related marks are trademarks of Smiley Brooms and may not be used
                without permission.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Limitation of Liability</h3>
              <p className="text-gray-700 mb-2">
                To the maximum extent permitted by law, Smiley Brooms shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including but not limited to loss of profits, data, or use,
                arising out of or in connection with our services.
              </p>
              <p className="text-gray-700 mb-2">
                Our total liability for any claim arising from or related to our services shall not exceed the amount
                paid by the customer for the specific service giving rise to the claim.
              </p>
              <p className="text-gray-700 mb-2">
                We are not liable for damage to items that were not properly secured, pre-existing conditions, or damage
                resulting from customer negligence or misrepresentation of property conditions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Indemnification</h3>
              <p className="text-gray-700 mb-2">
                You agree to indemnify, defend, and hold harmless Smiley Brooms, its officers, directors, employees,
                agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs,
                expenses, or fees (including reasonable attorneys' fees) arising from or relating to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-2">
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another person or entity</li>
                <li>Your provision of inaccurate or incomplete information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Dispute Resolution</h3>
              <p className="text-gray-700 mb-2">
                Any dispute arising from or relating to these Terms or our services shall first be attempted to be
                resolved through good-faith negotiation between the parties.
              </p>
              <p className="text-gray-700 mb-2">
                If negotiation is unsuccessful, the dispute shall be submitted to mediation in accordance with the rules
                of a mutually agreed-upon mediation service. The costs of mediation shall be shared equally by the
                parties.
              </p>
              <p className="text-gray-700 mb-2">
                If mediation is unsuccessful, the dispute may be resolved through arbitration or litigation in the
                appropriate courts of jurisdiction.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Governing Law</h3>
              <p className="text-gray-700 mb-2">
                These Terms shall be governed by and construed in accordance with the laws of the state where Smiley
                Brooms is headquartered, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 mb-2">
                Any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in
                the federal or state courts located in the jurisdiction where Smiley Brooms is headquartered.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Changes to Terms</h3>
              <p className="text-gray-700 mb-2">
                Smiley Brooms reserves the right to modify these Terms at any time. We will provide notice of
                significant changes through our website or by sending an email to registered users.
              </p>
              <p className="text-gray-700 mb-2">
                Your continued use of our services after such modifications constitutes your acceptance of the updated
                Terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Severability</h3>
              <p className="text-gray-700 mb-2">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining
                provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid
                provision that most closely reflects the intent of the original provision.
              </p>
            </section>
          </TabsContent>
        </ScrollArea>

        {showActions && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-start mb-4">
              <Checkbox
                id="terms-accept"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                disabled={!hasScrolledToBottom}
                className="mt-1"
              />
              <label
                htmlFor="terms-accept"
                className={`ml-2 text-sm ${!hasScrolledToBottom ? "text-gray-400" : "text-gray-700"}`}
              >
                I have read and agree to the Terms and Conditions
                {!hasScrolledToBottom && (
                  <span className="block text-amber-600 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    Please scroll through the entire document before accepting
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onDecline}>
                Decline
              </Button>
              <Button onClick={onAccept} disabled={!accepted} className="bg-blue-600 hover:bg-blue-700 text-white">
                {accepted ? (
                  <span className="flex items-center">
                    <Check size={16} className="mr-1" />
                    Accept Terms
                  </span>
                ) : (
                  "Accept Terms"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
