"use client"

import type React from "react"

interface SidepanelFooterProps {
  children: React.ReactNode
  className?: string
}

export function SidepanelFooter({ children, className = "" }: SidepanelFooterProps) {
  return <div className={`border-t p-4 ${className}`}>{children}</div>
}
