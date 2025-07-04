import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Apple, SmartphoneIcon as Android, Globe } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Download Our App</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Access your bookings, manage services, and get exclusive offers on the go!
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* iOS App Card */}
        <Card className="flex flex-col items-center text-center p-6 shadow-lg">
          <Apple className="h-16 w-16 text-gray-700 dark:text-gray-300 mb-4" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">iOS App</CardTitle>
            <CardDescription>For iPhone and iPad users.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between w-full">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Download on the App Store for a seamless experience on your Apple devices.
            </p>
            <Button size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download on the App Store
            </Button>
          </CardContent>
        </Card>

        {/* Android App Card */}
        <Card className="flex flex-col items-center text-center p-6 shadow-lg">
          <Android className="h-16 w-16 text-gray-700 dark:text-gray-300 mb-4" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Android App</CardTitle>
            <CardDescription>For Android smartphones and tablets.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between w-full">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Get it on Google Play for a smooth experience on your Android devices.
            </p>
            <Button size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Get it on Google Play
            </Button>
          </CardContent>
        </Card>

        {/* Web App / PWA Card */}
        <Card className="flex flex-col items-center text-center p-6 shadow-lg">
          <Globe className="h-16 w-16 text-gray-700 dark:text-gray-300 mb-4" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Web App (PWA)</CardTitle>
            <CardDescription>Access from any browser.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between w-full">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              No download needed! Add our Progressive Web App to your home screen for quick access.
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link href="/">
                <Globe className="mr-2 h-5 w-5" />
                Access Web App
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Why Download?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Our dedicated mobile app offers enhanced features, faster performance, and exclusive mobile-only discounts.
        </p>
        <ul className="list-disc list-inside text-left inline-block text-gray-700 dark:text-gray-300 mt-4 space-y-2">
          <li>Easy booking and rescheduling</li>
          <li>Real-time service updates</li>
          <li>In-app chat support</li>
          <li>Exclusive mobile promotions</li>
          <li>Secure payment options</li>
        </ul>
      </div>
    </div>
  )
}
