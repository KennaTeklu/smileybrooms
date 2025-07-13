import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing or using the SmileyBrooms website and services, you agree to be bound by these Terms of Service
            and all terms incorporated by reference. If you do not agree to all of these terms, do not use our website
            or services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">2. Services Provided</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            SmileyBrooms provides professional cleaning services for residential and commercial properties. Our services
            include, but are not limited to, standard cleaning, deep cleaning, move-in/move-out cleaning, and
            specialized cleaning tasks as agreed upon.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">3. Booking and Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            All bookings are subject to availability. Payment is required in full upon completion of the service, or as
            per the agreed-upon payment schedule for recurring services. We accept various payment methods as indicated
            on our website.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">4. Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Cancellations or rescheduling requests must be made at least 24 hours prior to the scheduled service time.
            Cancellations made within 24 hours may incur a cancellation fee.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">5. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            SmileyBrooms will perform services with reasonable care and skill. We are not liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting
            from (a) your access to or use of or inability to access or use the services; (b) any conduct or content of
            any third party on the services; or (c) unauthorized access, use, or alteration of your transmissions or
            content.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">6. Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service shall be governed and construed in accordance with the laws of the State of
            California, without regard to its conflict of law provisions.
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Link href="/" passHref>
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
