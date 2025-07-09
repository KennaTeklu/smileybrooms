"use client"
export const dynamic = "force-dynamic"

import { useEffect } from "react"

interface SidePanelBackdropProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function SidePanelBackdrop({ isOpen, onClick, className = "" }: SidePanelBackdropProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${className}`}
      onClick={onClick}
      aria-hidden="true"
    />
  )
}
