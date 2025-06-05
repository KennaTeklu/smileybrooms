import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Download className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Download Feature</CardTitle>
          <CardDescription className="text-gray-600">We're working hard to bring you this feature</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Coming Soon</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Our team is currently developing the download functionality. This feature will allow you to save and
              access your cleaning service details offline.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-500">Expected completion: Q2 2024</p>

            <Button asChild className="w-full">
              <Link href="/" className="flex items-center justify-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Home</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
