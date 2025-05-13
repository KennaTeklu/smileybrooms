import type { Metadata } from "next"
import AppScreenshots from "@/components/app-screenshots"
import AppFeaturesComparison from "@/components/app-features-comparison"
import { Button } from "@/components/ui/button"
import { Apple, Smartphone, Monitor } from "lucide-react"

export const metadata: Metadata = {
  title: "Download SmileyBrooms App",
  description: "Download the SmileyBrooms app for iOS, Android, or desktop to manage your cleaning services on the go.",
}

export default function DownloadPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Download SmileyBrooms App</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get the SmileyBrooms app for a seamless cleaning service experience on your preferred device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Experience SmileyBrooms on Mobile</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our mobile app gives you the full SmileyBrooms experience with additional features like real-time
              tracking, push notifications, and offline access to your bookings.
            </p>

            <div className="space-y-4">
              <Button asChild size="lg" className="w-full">
                <a href="/downloads/smiley-brooms.apk" download>
                  <Smartphone className="mr-2 h-5 w-5" />
                  Download for Android
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full">
                <a href="/downloads/smiley-brooms.ipa" download>
                  <Apple className="mr-2 h-5 w-5" />
                  Download for iOS
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full">
                <a href="/downloads/smiley-brooms.dmg" download>
                  <Monitor className="mr-2 h-5 w-5" />
                  Download for Desktop
                </a>
              </Button>
            </div>
          </div>

          <div>
            <AppScreenshots />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Features Comparison</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            See how the SmileyBrooms experience differs across platforms.
          </p>

          <AppFeaturesComparison />
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Having trouble downloading or installing the app? Our support team is here to help.
          </p>
          <Button asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
