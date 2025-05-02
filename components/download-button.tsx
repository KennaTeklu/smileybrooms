"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DownloadButtonProps {
  platform: "ios" | "android" | "macos" | "windows" | "linux-deb" | "linux-rpm" | "linux-appimage"
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
  directDownload?: boolean
}

export function DownloadButton({
  platform,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
  directDownload = false,
  children,
}: DownloadButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      if (platform === "windows" && directDownload) {
        // Direct download for Windows to C:\ drive
        window.location.href = "/api/windows-download"
        setTimeout(() => {
          setIsLoading(false)
        }, 3000)
      } else {
        // Navigate to download page with platform parameter
        router.push(`/download?platform=${platform}`)
      }
    } catch (error) {
      console.error("Download error:", error)
      setIsLoading(false)
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case "ios":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19c-4.3 0-7.8-3.4-7.8-7.8 0-4.3 3.4-7.8 7.8-7.8 4.3 0 7.8 3.4 7.8 7.8 0 4.3-3.4 7.8-7.8 7.8z" />
            <path d="M12 19V5" />
            <path d="M5 12h14" />
          </svg>
        )
      case "android":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        )
      case "macos":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 22h6" />
            <path d="M2 8.5A2.5 2.5 0 0 1 4.5 6h15A2.5 2.5 0 0 1 22 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-9z" />
            <path d="M12 6v16" />
          </svg>
        )
      case "windows":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
            <path d="M8 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
            <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
            <path d="M7 10v4" />
            <path d="M17 10v4" />
          </svg>
        )
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
        return directDownload ? "Windows (C:\\ Drive)" : "Windows"
      case "linux-deb":
        return "Linux (DEB)"
      case "linux-rpm":
        return "Linux (RPM)"
      case "linux-appimage":
        return "Linux"
      default:
        return "Download"
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} border-2 border-primary border-dashed`}
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {showIcon && getPlatformIcon()}
          {children || getPlatformName()}
        </>
      )}
    </Button>
  )
}
