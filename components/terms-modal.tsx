"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TermsModal({ trigger, className }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="link" className={className}>
            Terms of Service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] mt-16 sm:mt-20">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h2 className="text-lg font-semibold">1. Introduction</h2>
            <p>
              Welcome to smileybrooms LLC. These Terms of Service govern your use of our website, mobile applications,
              and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>

            <h2 className="text-lg font-semibold">2. Services</h2>
            <p>
              smileybrooms LLC provides cleaning services for residential and commercial properties. We offer various
              cleaning packages and options as described on our website and mobile applications.
            </p>

            <h2 className="text-lg font-semibold">3. Booking and Payments</h2>
            <p>
              When booking our services, you agree to provide accurate and complete information. Payments are processed
              securely through our payment processors. We accept various payment methods as indicated on our checkout
              page.
            </p>
            <p>
              Prices are subject to change without notice. We reserve the right to refuse service to anyone for any
              reason at any time.
            </p>

            <h2 className="text-lg font-semibold">4. Cancellation Policy</h2>
            <p>
              Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may be
              subject to a cancellation fee of up to 50% of the service cost. No-shows will be charged the full service
              amount.
            </p>

            <h2 className="text-lg font-semibold">5. Service Guarantee</h2>
            <p>
              We strive to provide high-quality cleaning services. If you are not satisfied with our service, please
              contact us within 24 hours, and we will address your concerns promptly.
            </p>
            <p>
              Our satisfaction guarantee allows us to redo parts of the cleaning that did not meet expectations within
              24 hours of the original service. This guarantee does not cover new stains, spills, or messes that occur
              after our service has been completed. The guarantee is limited to one redo per service and is subject to
              availability.
            </p>

            <h2 className="text-lg font-semibold">6. Property Access and Safety</h2>
            <p>
              You are responsible for providing safe access to your property. Our cleaners must be able to work in a
              safe environment. We reserve the right to refuse service if the working conditions are deemed unsafe.
            </p>

            <h2 className="text-lg font-semibold">7. Liability</h2>
            <p>
              smileybrooms LLC is insured for property damage caused by our staff during service. However, we are not
              responsible for damage due to faulty items, pre-existing conditions, or acts of nature.
            </p>
            <p>
              Please remove or secure valuable and fragile items before our arrival. We are not responsible for damage
              to items that were not properly secured or for pre-existing damage.
            </p>

            <h2 className="text-lg font-semibold">8. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and
              protect your personal information.
            </p>

            <h2 className="text-lg font-semibold">9. Website and App Usage</h2>
            <p>
              Our website and mobile applications are provided for legitimate use in connection with our cleaning
              services. Any attempt to manipulate, abuse, or exploit our systems, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Attempting to obtain unauthorized discounts or services</li>
              <li>Creating multiple accounts to circumvent limitations or restrictions</li>
              <li>Submitting false information or fraudulent payment details</li>
              <li>Reverse engineering or attempting to compromise our systems</li>
              <li>Using automated tools, bots, or scripts to interact with our website</li>
              <li>Engaging in any activity that disrupts or interferes with our services</li>
            </ul>
            <p className="mt-2">
              is strictly prohibited and may result in termination of your account, denial of service, and potential
              legal action. We reserve the right to refuse service to anyone who violates these terms.
            </p>

            <h2 className="text-lg font-semibold">10. Service Limitations</h2>
            <p>Our cleaning services have certain limitations. We do not provide:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Hazardous waste removal or cleaning of biohazardous materials</li>
              <li>Cleaning of areas that require specialized equipment or training not specified in your service</li>
              <li>Moving of heavy furniture or items exceeding 25 pounds</li>
              <li>Cleaning of areas that are inaccessible or unsafe</li>
              <li>Services that violate local, state, or federal laws and regulations</li>
            </ul>

            <h2 className="text-lg font-semibold">11. Modifications to Terms</h2>
            <p>
              smileybrooms LLC reserves the right to modify these Terms at any time. Changes will be effective
              immediately upon posting on our website. Your continued use of our services after any changes indicates
              your acceptance of the modified Terms.
            </p>

            <h2 className="text-lg font-semibold">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the state where smileybrooms
              LLC operates, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-lg font-semibold">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: support@smileybrooms.com
              <br />
              Phone: 602-800-0605
            </p>

            <p className="text-xs text-gray-500 mt-8">
              Last updated: April 30, 2023
              <br />© 2023 smileybrooms LLC. All rights reserved.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
