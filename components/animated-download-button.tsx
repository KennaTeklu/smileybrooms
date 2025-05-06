"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function AnimatedDownloadButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [platform, setPlatform] = useState<string | null>(null)

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    if (/(android)/i.test(userAgent)) {
      setPlatform("android")
    } else if (/(iphone|ipad|ipod)/i.test(userAgent)) {
      setPlatform("ios")
    } else if (/(mac)/i.test(userAgent)) {
      setPlatform("mac")
    } else if (/(win)/i.test(userAgent)) {
      setPlatform("windows")
    } else if (/(linux)/i.test(userAgent)) {
      setPlatform("linux")
    }
  }, [])

  const getPlatformText = () => {
    switch (platform) {
      case "android":
        return "Download for Android"
      case "ios":
        return "Download for iOS"
      case "mac":
        return "Download for Mac"
      case "windows":
        return "Download for Windows"
      case "linux":
        return "Download for Linux"
      default:
        return "Download App"
    }
  }

  const getPlatformLink = () => {
    switch (platform) {
      case "android":
        return "/downloads/smiley-brooms-android.html"
      case "ios":
        return "/downloads/smiley-brooms-ios.html"
      case "mac":
        return "/downloads/smiley-brooms-macos.html"
      case "windows":
        return "/downloads/smiley-brooms-windows.html"
      case "linux":
        return "/downloads/smiley-brooms-linux.html"
      default:
        return "/download"
    }
  }

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative overflow-hidden group"
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: isHovered ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Download className="h-4 w-4" />
              <span>{getPlatformText()}</span>
            </motion.div>
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 5 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem asChild>
            <Link href="/downloads/smiley-brooms-ios.html">iOS App</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/downloads/smiley-brooms-android.html">Android App</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/downloads/smiley-brooms-macos.html">macOS App</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/downloads/smiley-brooms-windows.html">Windows App</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/downloads/smiley-brooms-linux.html">Linux App</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
