"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function AnimatedDownloadButton({ href, platform }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = () => {
    setIsDownloading(true)
    setDownloadProgress(0)

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsDownloading(false)
            setDownloadProgress(0)
            // Redirect to the actual download
            window.location.href = href
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 200)

    // Track download event
    try {
      console.log(`App download initiated: ${platform}`)
      // You would typically send this to your analytics service
      // Example: analytics.trackDownload(platform)
    } catch (error) {
      console.error("Error tracking download:", error)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} className="relative overflow-hidden">
      {isDownloading ? (
        <>
          <span className="relative z-10">Downloading... {downloadProgress}%</span>
          <div className="absolute left-0 top-0 bottom-0 bg-primary/30" style={{ width: `${downloadProgress}%` }} />
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download
        </>
      )}
    </Button>
  )
}
