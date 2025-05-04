"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TermsAgreementPopupProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsAgreementPopup({ isOpen, onClose, onAccept }: TermsAgreementPopupProps) {
  const [activeTab, setActiveTab] = useState("terms")

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>Please read and accept our terms and conditions before proceeding.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 h-[50vh]">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">1. Introduction</h3>
                <p>
                  Welcome to Smiley Brooms. These Terms and Conditions govern your use of our website, mobile
                  applications, and services. By accessing or using our services, you agree to be bound by these Terms.
                </p>

                <h3 className="text-lg font-semibold">2. Service Description</h3>
                <p>
                  Smiley Brooms provides professional cleaning services for residential and commercial properties. Our
                  services include but are not limited to standard cleaning, deep cleaning, move-in/move-out cleaning,
                  and specialized cleaning services.
                </p>

                <h3 className="text-lg font-semibold">3. Booking and Cancellation</h3>
                <p>3.1. Bookings can be made through our website, mobile app, or by contacting our customer service.</p>
                <p>
                  3.2. Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may
                  incur a fee of up to 50% of the service cost.
                </p>
                <p>3.3. No-shows will be charged the full service amount.</p>

                <h3 className="text-lg font-semibold">4. Payment Terms</h3>
                <p>4.1. Payment is required at the time of booking unless otherwise specified.</p>
                <p>
                  4.2. We accept credit/debit cards, PayPal, and other payment methods as specified on our platform.
                </p>
                <p>4.3. Recurring service plans will be automatically charged according to the selected frequency.</p>

                <h3 className="text-lg font-semibold">5. Service Guarantee</h3>
                <p>
                  5.1. We strive to provide high-quality cleaning services. If you are not satisfied with our service,
                  please notify us within 24 hours, and we will re-clean the areas of concern at no additional cost.
                </p>
                <p>
                  5.2. Our satisfaction guarantee is subject to reasonable expectations and does not cover pre-existing
                  damage or conditions.
                </p>

                <h3 className="text-lg font-semibold">6. Customer Responsibilities</h3>
                <p>6.1. Customers must provide a safe and accessible environment for our cleaning professionals.</p>
                <p>6.2. Valuable or fragile items should be secured or removed from the cleaning area.</p>
                <p>
                  6.3. Customers are responsible for providing accurate information about the property and specific
                  cleaning requirements.
                </p>

                <h3 className="text-lg font-semibold">7. Liability</h3>
                <p>
                  7.1. Smiley Brooms is insured for property damage caused directly by our cleaning professionals during
                  service.
                </p>
                <p>7.2. Claims must be reported within 24 hours of service completion with supporting documentation.</p>
                <p>
                  7.3. We are not liable for pre-existing damage, normal wear and tear, or damage resulting from
                  customer negligence.
                </p>

                <h3 className="text-lg font-semibold">8. Accessibility Compliance</h3>
                <p>
                  8.1. Smiley Brooms is committed to providing accessible services to all customers, including those
                  with disabilities.
                </p>
                <p>
                  8.2. Our website and mobile applications are designed to be accessible according to WCAG 2.1
                  guidelines.
                </p>
                <p>
                  8.3. Customers with specific accessibility needs can contact our customer service for accommodations.
                </p>

                <h3 className="text-lg font-semibold">9. Intellectual Property</h3>
                <p>
                  9.1. All content on our website and mobile applications, including text, graphics, logos, and
                  software, is the property of Smiley Brooms and protected by copyright laws.
                </p>
                <p>9.2. Unauthorized use, reproduction, or distribution of our intellectual property is prohibited.</p>

                <h3 className="text-lg font-semibold">10. Dispute Resolution</h3>
                <p>
                  10.1. Any disputes arising from our services shall first be addressed through our customer service.
                </p>
                <p>
                  10.2. If a resolution cannot be reached, disputes will be resolved through arbitration in accordance
                  with the laws of the state where the service was provided.
                </p>

                <h3 className="text-lg font-semibold">11. Modifications to Terms</h3>
                <p>11.1. Smiley Brooms reserves the right to modify these Terms and Conditions at any time.</p>
                <p>
                  11.2. Changes will be effective upon posting to our website. Continued use of our services constitutes
                  acceptance of the modified terms.
                </p>

                <h3 className="text-lg font-semibold">12. Contact Information</h3>
                <p>For questions or concerns regarding these Terms and Conditions, please contact us at:</p>
                <p>
                  Email: legal@smileybrooms.com
                  <br />
                  Phone: (602) 800-0605
                  <br />
                  Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="privacy" className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 h-[50vh]">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">1. Information We Collect</h3>
                <p>
                  1.1. Personal Information: We collect information such as your name, email address, phone number,
                  billing and service addresses, and payment information.
                </p>
                <p>
                  1.2. Service Information: We collect details about the cleaning services you request, including
                  property size, service frequency, and special instructions.
                </p>
                <p>
                  1.3. Usage Information: We collect information about how you interact with our website and mobile
                  applications, including IP address, browser type, pages visited, and time spent.
                </p>

                <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
                <p>2.1. To provide and improve our cleaning services.</p>
                <p>2.2. To process payments and manage your account.</p>
                <p>2.3. To communicate with you about your bookings, promotions, and updates.</p>
                <p>2.4. To analyze usage patterns and enhance our website and applications.</p>
                <p>2.5. To comply with legal obligations.</p>

                <h3 className="text-lg font-semibold">3. Information Sharing</h3>
                <p>
                  3.1. Service Providers: We may share your information with third-party service providers who assist us
                  in operating our business, such as payment processors and cleaning professionals.
                </p>
                <p>
                  3.2. Legal Requirements: We may disclose your information if required by law or to protect our rights,
                  property, or safety.
                </p>
                <p>
                  3.3. Business Transfers: In the event of a merger, acquisition, or sale of assets, your information
                  may be transferred as part of the transaction.
                </p>

                <h3 className="text-lg font-semibold">4. Data Security</h3>
                <p>
                  4.1. We implement appropriate technical and organizational measures to protect your personal
                  information from unauthorized access, disclosure, alteration, or destruction.
                </p>
                <p>
                  4.2. While we strive to protect your information, no method of transmission over the Internet or
                  electronic storage is 100% secure.
                </p>

                <h3 className="text-lg font-semibold">5. Your Rights</h3>
                <p>5.1. Access and Correction: You have the right to access and correct your personal information.</p>
                <p>
                  5.2. Deletion: You may request the deletion of your personal information, subject to legal
                  requirements.
                </p>
                <p>5.3. Opt-Out: You can opt out of marketing communications at any time.</p>

                <h3 className="text-lg font-semibold">6. Cookies and Tracking Technologies</h3>
                <p>
                  6.1. We use cookies and similar tracking technologies to collect information about your browsing
                  activities and preferences.
                </p>
                <p>
                  6.2. You can manage your cookie preferences through your browser settings, but disabling cookies may
                  affect the functionality of our website.
                </p>

                <h3 className="text-lg font-semibold">7. Children's Privacy</h3>
                <p>7.1. Our services are not intended for individuals under the age of 18.</p>
                <p>
                  7.2. We do not knowingly collect personal information from children. If we become aware that we have
                  collected personal information from a child without parental consent, we will take steps to delete
                  that information.
                </p>

                <h3 className="text-lg font-semibold">8. Third-Party Links</h3>
                <p>8.1. Our website and applications may contain links to third-party websites or services.</p>
                <p>8.2. We are not responsible for the privacy practices or content of these third-party sites.</p>

                <h3 className="text-lg font-semibold">9. Changes to Privacy Policy</h3>
                <p>9.1. We may update our Privacy Policy from time to time.</p>
                <p>
                  9.2. We will notify you of any significant changes by posting the new Privacy Policy on our website or
                  through other communication channels.
                </p>

                <h3 className="text-lg font-semibold">10. Contact Information</h3>
                <p>For questions or concerns regarding our Privacy Policy, please contact us at:</p>
                <p>
                  Email: privacy@smileybrooms.com
                  <br />
                  Phone: (602) 800-0605
                  <br />
                  Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345
                </p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Decline
          </Button>
          <Button onClick={onAccept}>Accept Terms & Conditions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
