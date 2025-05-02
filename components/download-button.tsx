"use client"

import type React from "react"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DownloadButtonProps {
  platform: string
  size?: "default" | "sm" | "lg"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function DownloadButton({
  platform,
  size = "default",
  className,
  showIcon = true,
  children,
}: DownloadButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = () => {
    let url = "/api/download"

    // Add platform parameter
    url += `?platform=${platform}`

    // Open platform-specific link in new tab
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleDownload}
      size={size}
      className={cn("bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showIcon && <Download className={cn("mr-2 h-4 w-4", isHovered && "animate-bounce")} />}
      {children || "Download"}
    </Button>
  )
}
