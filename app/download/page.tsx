"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DownloadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const platform = searchParams.get("platform")
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!platform) {
      setError("No platform specified")
      return
    }

    // Start download automatically
    startDownload()
  }, [platform])

  const startDownload = async () => {
    try {
      // Get download URL from API
      const response = await fetch(`/api/download?platform=${platform}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Start download
      setDownloadStarted(true)

      // Create a direct download link
      const link = document.createElement("a")
      link.href = data.url
      link.download = data.url.split("/").pop() || "smiley-brooms-app"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Track download event
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "app_download", {
          platform: platform,
          method: "direct",
        })
      }
    } catch (err) {
      console.error("Download error:", err)
      setError("Failed to start download. Please try again.")
    }
  }

  const getPlatformName = () => {
    switch (platform) {
      case "ios":
        return "iOS"
      case "android":
        return "Android"
      case "macos":
        return "macOS"
      case "windows":
        return "Windows"
      case "linux-deb":
        return "Linux (DEB)"
      case "linux-rpm":
        return "Linux (RPM)"
      case "linux-appimage":
        return "Linux (AppImage)"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Downloading Smiley Brooms</CardTitle>
          <CardDescription>
            {downloadStarted
              ? `Your download for ${getPlatformName()} should begin automatically.`
              : `Preparing your ${getPlatformName()} download...`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              <p>{error}</p>
            </div>
          ) : downloadStarted ? (
            <div className="rounded-md bg-green-50 p-4 text-green-700">
              <p>Download started! If your download doesn't begin automatically, click the button below.</p>
            </div>
          ) : (
            <div className="flex justify-center p-6">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {downloadStarted && (
            <Button className="w-full" onClick={startDownload}>
              Download Again
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            Return to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
