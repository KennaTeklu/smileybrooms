import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Terms of Service</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">Last Updated: July 3, 2025</p>

      <Card className="shadow-lg max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to SmileyBrooms!</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-6">
          <p>
            These Terms of Service ("Terms") govern your access to and use of the SmileyBrooms website, applications,
            and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by
            these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
          </p>

          <Separator />

          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By creating an account, making a booking, or otherwise using the Service, you acknowledge that you have
            read, understood, and agree to be bound by these Terms. We reserve the right to update or modify these Terms
            at any time without prior notice. Your continued use of the Service after any such changes constitutes your
            acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p>
            SmileyBrooms provides an online platform that connects users with professional cleaning service providers.
            Our Service includes, but is not limited to, facilitating bookings, managing payments, and providing
            customer support. We do not directly provide cleaning services; rather, we act as an intermediary between
            you and independent cleaning professionals.
          </p>

          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <ul>
            <li>
              <strong>Account Creation:</strong> To access certain features of the Service, you may be required to
              create an account. You agree to provide accurate, current, and complete information during the
              registration process and to update such information to keep it accurate, current, and complete.
            </li>
            <li>
              <strong>Account Security:</strong> You are responsible for safeguarding your password and for any
              activities or actions under your account. We encourage you to use "strong" passwords (passwords that use a
              combination of upper and lower case letters, numbers, and symbols) with your account. SmileyBrooms cannot
              and will not be liable for any loss or damage arising from your failure to comply with the above
              requirements.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">4. Booking and Payments</h2>
          <ul>
            <li>
              <strong>Booking Confirmation:</strong> All bookings made through the Service are subject to acceptance and
              availability. A confirmation email will be sent once your booking is confirmed.
            </li>
            <li>
              <strong>Pricing:</strong> Prices for cleaning services are displayed on the Service and are subject to
              change. The final price for your service will be confirmed before you finalize your booking.
            </li>
            <li>
              <strong>Payment:</strong> Payments are processed securely through third-party payment processors (e.g.,
              Stripe). By using the Service, you agree to their terms and conditions. You authorize SmileyBrooms to
              charge your selected payment method for all fees incurred.
            </li>
            <li>
              <strong>Cancellations and Rescheduling:</strong> Cancellation and rescheduling policies are detailed in
              our FAQ section. Fees may apply for late cancellations.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in any way that violates these Terms.</li>
            <li>
              Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a
              person or entity.
            </li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            <li>Attempt to gain unauthorized access to the Service or its related systems or networks.</li>
          </ul>

          <h2 className="text-xl font-semibold">6. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, either express or
            implied. SmileyBrooms does not guarantee that the Service will be uninterrupted, error-free, or secure. To
            the fullest extent permitted by applicable law, SmileyBrooms shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting
            from (a) your access to or use of or inability to access or use the Service; (b) any conduct or content of
            any third party on the Service; or (c) unauthorized access, use, or alteration of your transmissions or
            content.
          </p>

          <h2 className="text-xl font-semibold">7. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the State of California, United
            States, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: <Link href="mailto:info@smileybrooms.com">info@smileybrooms.com</Link>
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
