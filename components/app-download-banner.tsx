"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem("appBannerDismissed")
    if (!dismissed) {
      setIsVisible(true)
    }

    // Simple mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const dismissBanner = () => {
    setIsVisible(false)
    localStorage.setItem("appBannerDismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-3 z-40 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Download className="h-5 w-5 mr-2 hidden sm:block" />
          <p className="text-sm sm:text-base">
            {isMobile
              ? "Get our app for a better experience!"
              : "Download our app for scheduling and managing your cleaning services on the go!"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/download">
            <Button size="sm" variant="secondary" className="text-xs sm:text-sm whitespace-nowrap">
              Get App
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={dismissBanner} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
