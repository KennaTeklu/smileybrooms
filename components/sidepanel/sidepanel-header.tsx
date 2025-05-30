"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidepanelHeaderProps {
  title: string
  onClose: () => void
  className?: string
}

export function SidepanelHeader({ title, onClose, className = "" }: SidepanelHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b p-4 ${className}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}
