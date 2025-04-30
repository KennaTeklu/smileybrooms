"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Download, HardDrive } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WindowsDownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const router = useRouter()

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Start the download
      window.location.href = "/api/windows-download"

      // Show instructions after a short delay
      setTimeout(() => {
        setShowInstructions(true)
        setIsDownloading(false)
      }, 3000)
    } catch (error) {
      console.error("Download error:", error)
      setIsDownloading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Download smileybrooms for Windows</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-6 w-6 text-blue-500" />
              Install to C:\ Drive
            </CardTitle>
            <CardDescription>Our recommended installation location for best performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              For optimal performance and to ensure all features work correctly, we recommend installing smileybrooms
              directly to your C:\ drive.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <HardDrive className="h-6 w-6 text-blue-500 mr-2" />
                <div>
                  <h4 className="font-semibold text-blue-800">Why install to C:\ drive?</h4>
                  <p className="text-blue-700">
                    Installing to your C:\ drive ensures the application has proper permissions and can access all
                    necessary system resources.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Installation Steps:</h3>
            <ol className="list-decimal pl-6 mb-4 space-y-1">
              <li>Click the "Download Now" button below</li>
              <li>When prompted, select "Save As" and choose C:\ as the save location</li>
              <li>Run the installer from C:\ after download completes</li>
              <li>Follow the on-screen instructions to complete installation</li>
            </ol>

            {showInstructions && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <div>
                    <h4 className="font-semibold text-green-800">Download Started!</h4>
                    <p className="text-green-700">
                      Your download has started. Please save the file to your C:\ drive when prompted. After
                      downloading, run the installer to complete the setup.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleDownload} disabled={isDownloading} className="w-full md:w-auto text-lg py-3 px-8">
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            By downloading, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
          <p className="mt-2">Version 1.0.0 | Released April 30, 2023</p>
        </div>
      </div>
    </div>
  )
}
