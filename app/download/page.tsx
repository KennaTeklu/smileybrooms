import { Construction, Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Construction className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">Download Center</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                We're working hard to bring you something amazing
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Download className="h-5 w-5" />
                  <span className="text-sm font-medium">Coming Soon</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
                  </ul>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Want to be notified when downloads are available?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button variant="default" className="w-full sm:w-auto">
                      Contact Us for Updates
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
