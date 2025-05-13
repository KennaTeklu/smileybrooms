import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">Last updated: May 1, 2023</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register, express interest in
            our services, or otherwise contact us. This information may include your name, email address, phone number,
            address, and payment information.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, operate, and maintain our services</li>
            <li>Improve, personalize, and expand our services</li>
            <li>Understand and analyze how you use our services</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service, updates, and marketing</li>
            <li>Process your transactions</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>
            We may share your information with our service providers who help us provide our services, comply with legal
            obligations, or protect our rights. We do not sell your personal information to third parties.
          </p>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, such as the right to
            access, correct, delete, or restrict processing of your data. Please contact us to exercise these rights.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
            information from children under 18. If you become aware that a child has provided us with personal
            information, please contact us immediately.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@smileybrooms.com.</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>

        <Button asChild>
          <Link href="/terms">View Terms of Service</Link>
        </Button>
      </div>
    </div>
  )
}
