"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnimatedDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsDownloading(false)
    setIsComplete(true)

    // Reset after 3 seconds
    setTimeout(() => setIsComplete(false), 3000)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <motion.div
        className="flex items-center gap-2"
        animate={{
          scale: isDownloading ? 0.95 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{
            rotate: isDownloading ? 360 : 0,
          }}
          transition={{
            duration: 1,
            repeat: isDownloading ? Number.POSITIVE_INFINITY : 0,
            ease: "linear",
          }}
        >
          {isComplete ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        </motion.div>
        <span className="font-medium">
          {isDownloading ? "Downloading..." : isComplete ? "Downloaded!" : "Download App"}
        </span>
      </motion.div>

      {/* Progress bar */}
      {isDownloading && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      )}
    </Button>
  )
}
