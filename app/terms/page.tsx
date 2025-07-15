"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, Info, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Terms of Service
            </CardTitle>
            <CardDescription>Last Updated: July 15, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Introduction
              </h3>
              <p>
                Welcome to Smiley Brooms! These Terms of Service ("Terms") govern your use of our website, services, and
                applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by
                these Terms. If you do not agree to these Terms, please do not use the Service.
              </p>
              <p>
                Smiley Brooms provides professional cleaning services for residential and commercial properties. Our
                goal is to deliver high-quality, reliable, and efficient cleaning solutions tailored to your needs.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking and Cancellations
              </h3>
              <p>
                <strong>Booking:</strong> All service bookings are subject to availability. We recommend booking in
                advance to secure your preferred time slot. You will receive a confirmation email once your booking is
                successful.
              </p>
              <p>
                <strong>Cancellations:</strong> You may cancel or reschedule your cleaning service up to 24 hours before
                the scheduled time without any charge. Cancellations made less than 24 hours in advance may incur a
                cancellation fee equal to 50% of the service cost. No-shows will be charged the full service cost.
              </p>
              <p>
                <strong>Rescheduling:</strong> Rescheduling is subject to availability. We will do our best to
                accommodate your new preferred time.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing and Payment
              </h3>
              <p>
                <strong>Pricing:</strong> Our prices are based on the size of your property, the type of service
                requested, and any additional add-ons. All prices are displayed on our website and are subject to
                change. Estimates provided are based on the information you provide; actual costs may vary upon
                inspection.
              </p>
              <p>
                <strong>Payment:</strong> Payment is due upon completion of the service, unless otherwise specified
                (e.g., for online pre-payments). We accept major credit cards, PayPal, and other payment methods as
                indicated on our checkout page. For certain custom services, an email for pricing will be required, and
                payment terms will be agreed upon separately.
              </p>
              <p>
                <strong>Late Payments:</strong> A late fee may be applied to overdue payments.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Service Guarantee
              </h3>
              <p>
                We strive for 100% customer satisfaction. If you are not completely satisfied with our cleaning service,
                please contact us within 24 hours of the service completion. We will return to re-clean any areas of
                concern at no additional charge. This guarantee does not apply to issues beyond our control or if the
                property conditions prevent us from performing our duties effectively.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Limitation of Liability
              </h3>
              <p>
                Smiley Brooms will not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct
                or content of any third party on the Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or content, whether based on warranty,
                contract, tort (including negligence) or any other legal theory, whether or not we have been informed of
                the possibility of such damage, and even if a remedy set forth herein is found to have failed of its
                essential purpose.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Changes to Terms
              </h3>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                What constitutes a material change will be determined at our sole discretion. By continuing to access or
                use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Contact Us
              </h3>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>
                Email:{" "}
                <a href="mailto:support@smileybrooms.com" className="text-primary hover:underline">
                  support@smileybrooms.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+15551234567" className="text-primary hover:underline">
                  (555) 123-4567
                </a>
              </p>
              <p>Address: 123 Clean Street, Suite 100, City, State, ZIP</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
