import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">Last updated: May 1, 2023</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website.
            They are widely used to make websites work more efficiently and provide information to the owners of the
            site.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for several reasons:</p>
          <ul>
            <li>Essential cookies: These are necessary for the website to function properly.</li>
            <li>
              Analytical/performance cookies: These allow us to recognize and count the number of visitors and see how
              visitors move around our website.
            </li>
            <li>Functionality cookies: These are used to recognize you when you return to our website.</li>
            <li>
              Targeting cookies: These record your visit to our website, the pages you have visited, and the links you
              have followed.
            </li>
          </ul>

          <h2>3. Types of Cookies We Use</h2>
          <p>
            <strong>Session Cookies:</strong> These are temporary cookies that are erased when you close your browser.
            They do not collect information from your computer.
          </p>
          <p>
            <strong>Persistent Cookies:</strong> These remain on your device until they expire or you delete them. They
            collect information about how you use the website, such as which pages you visit most often.
          </p>

          <h2>4. Third-Party Cookies</h2>
          <p>
            We also use third-party cookies from services like Google Analytics, which help us understand how you use
            our website so we can improve it.
          </p>

          <h2>5. Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can usually find these settings
            in the "options" or "preferences" menu of your browser. You can also use your browser settings to delete
            cookies that have already been set.
          </p>

          <h2>6. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
            Cookie Policy on this page and updating the "Last updated" date.
          </p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Cookie Policy, please contact us at privacy@smileybrooms.com.</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>

        <Button asChild>
          <Link href="/privacy">View Privacy Policy</Link>
        </Button>
      </div>
    </div>
  )
}
