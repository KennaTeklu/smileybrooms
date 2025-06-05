import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Clock, Smartphone, Monitor, Tablet } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Download className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">SmileyBrooms Mobile App</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're working hard to bring you the best mobile experience for booking and managing your cleaning services.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              Our mobile app is currently in development and will be available soon!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              In the meantime, you can use our fully responsive website on any device to book and manage your cleaning
              services.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book a Cleaning Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Mobile App</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Quick booking on the go</li>
                <li>• Push notifications</li>
                <li>• Real-time tracking</li>
                <li>• Easy rescheduling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Desktop Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Full-featured booking</li>
                <li>• Detailed service options</li>
                <li>• Account management</li>
                <li>• Service history</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Tablet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Tablet Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Touch-friendly interface</li>
                <li>• Large, clear buttons</li>
                <li>• Easy navigation</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-900 dark:text-blue-100">Stay Updated</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Be the first to know when our mobile app launches!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Notify Me</Button>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              We'll only send you updates about the app launch. No spam, ever.
            </p>
          </CardContent>
        </Card>

        {/* Current Options */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Book Your Cleaning Today</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Don't wait for the app! You can book your cleaning service right now using our website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="default">
                View Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
