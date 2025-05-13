"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface DeploymentInfo {
  version: string
  environment: string
  timestamp: string
  commitSha?: string
}

export function DeploymentStatus() {
  const [deployInfo, setDeployInfo] = useState<DeploymentInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // This would typically come from environment variables
    // set during the build process
    setDeployInfo({
      version: process.env.NEXT_PUBLIC_VERSION || "development",
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
      timestamp: new Date().toISOString(),
      commitSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7),
    })

    // Only show in development or with keyboard shortcut
    const isDevEnvironment = process.env.NODE_ENV === "development"
    setIsVisible(isDevEnvironment)

    // Add keyboard shortcut to toggle visibility (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsVisible((prev) => !prev)
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isVisible || !deployInfo) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border text-xs">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Environment:</span>
          <Badge variant={deployInfo.environment === "production" ? "default" : "outline"}>
            {deployInfo.environment}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Version:</span>
          <span className="font-mono">{deployInfo.version}</span>
        </div>
        {deployInfo.commitSha && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Commit:</span>
            <span className="font-mono">{deployInfo.commitSha}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Deployed:</span>
          <span>{new Date(deployInfo.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default DeploymentStatus
