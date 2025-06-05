import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Download className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">Download Center</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                We're working hard to bring you something amazing
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Coming Soon</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our download center is currently under development. We're preparing downloadable resources, guides,
                  and tools to enhance your cleaning service experience.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What's Coming:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                    <li>• Cleaning checklists and guides</li>
                    <li>• Service agreements and contracts</li>
                    <li>• Mobile app for iOS and Android</li>
                    <li>• Maintenance schedules and reminders</li>
                    <li>• Invoice and receipt downloads</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Want to be notified when downloads are available?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      Notify Me
                    </Button>
                    <Link href="/" passHref>
                      <Button className="flex-1 sm:flex-none">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need immediate assistance?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
