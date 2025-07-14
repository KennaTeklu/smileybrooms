"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Apple,
  SmartphoneIcon as Android,
  Download,
} from "lucide-react"
import Image from "next/image"

export default function DownloadPage() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available shortly.",
      variant: "default",
    })
  }

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
              Download Our App & Connect
            </h1>
            <p className="max-w-[900px] text-lg text-gray-700 md:text-xl dark:text-gray-300">
              Get the full Smiley Brooms experience on your mobile device and stay connected with us on social media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Mobile App Download Section */}
            <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-xl border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mobile App</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Download our app for seamless booking, tracking, and exclusive offers.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/placeholder-gjl3r.png" // Placeholder for app screenshot
                    alt="Smiley Brooms App"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-semibold"
                    onClick={handleFeatureComingSoon}
                  >
                    <Apple className="h-6 w-6" />
                    App Store
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold"
                    onClick={handleFeatureComingSoon}
                  >
                    <Android className="h-6 w-6" />
                    Google Play
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & Newsletter Section */}
            <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-xl border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Stay Connected</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Follow us on social media and subscribe to our newsletter for updates and promotions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Media Icons */}
                <div className="flex justify-center gap-6">
                  <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Facebook">
                    <Facebook className="h-8 w-8 text-blue-600 hover:text-blue-700" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Twitter">
                    <Twitter className="h-8 w-8 text-sky-500 hover:text-sky-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Instagram">
                    <Instagram className="h-8 w-8 text-pink-600 hover:text-pink-700" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="LinkedIn">
                    <Linkedin className="h-8 w-8 text-blue-700 hover:text-blue-800" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="YouTube">
                    <Youtube className="h-8 w-8 text-red-600 hover:text-red-700" />
                  </Button>
                </div>

                {/* Newsletter Subscription */}
                <div className="space-y-2">
                  <Label htmlFor="newsletter-email" className="text-gray-700 dark:text-gray-300">
                    Subscribe to our Newsletter
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="your@example.com"
                      className="flex-1 bg-gray-100/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleFeatureComingSoon}
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Downloadable Resources */}
          <div className="w-full max-w-4xl space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Other Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Smiley Brooms Brochure</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Learn more about our services and commitment to quality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleFeatureComingSoon}>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Service Price List</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Detailed pricing for all our cleaning packages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleFeatureComingSoon}>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Eco-Friendly Practices</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Our guide to sustainable and safe cleaning methods.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleFeatureComingSoon}>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
