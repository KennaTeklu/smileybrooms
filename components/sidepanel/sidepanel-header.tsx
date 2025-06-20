"use client"

import type React from "react"

import { X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface SidePanelHeaderProps {
  title: string
  subtitle?: string
  onClose: () => void
  onBack?: () => void
  progress?: number
  showProgress?: boolean
  actions?: React.ReactNode
}

export function SidePanelHeader({
  title,
  subtitle,
  onClose,
  onBack,
  progress = 0,
  showProgress = false,
  actions,
}: SidePanelHeaderProps) {
  return (
    <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8" aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showProgress && (
        <div className="px-4 pb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
        </div>
      )}
    </div>
  )
}
