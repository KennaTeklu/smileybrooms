"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { SidePanelHeader } from "./sidepanel-header"
import { SidePanelContent } from "./sidepanel-content"
import { SidePanelFooter } from "./sidepanel-footer"
import { SidePanelBackdrop } from "./sidepanel-backdrop"
import ErrorBoundary from "../error-boundary"

interface AdvancedSidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  onBack?: () => void
  progress?: number
  showProgress?: boolean
  width?: "sm" | "md" | "lg" | "xl"
  position?: "left" | "right"
  preserveScrollPosition?: boolean
  scrollKey?: string
  headerActions?: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
    loading?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  priceDisplay?: {
    label: string
    amount: number
    currency?: string
  }
  footerContent?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const widthClasses = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[500px]",
  xl: "w-[600px]",
}

const mobileWidthClasses = {
  sm: "sm:w-80",
  md: "sm:w-96",
  lg: "sm:w-[500px]",
  xl: "sm:w-[600px]",
}

export function AdvancedSidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  onBack,
  progress = 0,
  showProgress = false,
  width = "md",
  position = "right",
  preserveScrollPosition = false,
  scrollKey = "default",
  headerActions,
  primaryAction,
  secondaryAction,
  priceDisplay,
  footerContent,
  children,
  className = "",
}: AdvancedSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const panelContent = (
    <>
      <SidePanelBackdrop isOpen={isOpen} onClick={onClose} />

      <div
        ref={panelRef}
        className={`
          fixed top-0 ${position === "right" ? "right-0" : "left-0"} h-full
          w-full ${mobileWidthClasses[width]} max-w-full
          bg-white dark:bg-gray-900 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : position === "right" ? "translate-x-full" : "-translate-x-full"}
          flex flex-col
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <ErrorBoundary>
          <SidePanelHeader
            title={title}
            subtitle={subtitle}
            onClose={onClose}
            onBack={onBack}
            progress={progress}
            showProgress={showProgress}
            actions={headerActions}
          />

          <SidePanelContent preserveScrollPosition={preserveScrollPosition} scrollKey={scrollKey}>
            {children}
          </SidePanelContent>

          {(primaryAction || secondaryAction || priceDisplay || footerContent) && (
            <SidePanelFooter
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              priceDisplay={priceDisplay}
            >
              {footerContent}
            </SidePanelFooter>
          )}
        </ErrorBoundary>
      </div>
    </>
  )

  return createPortal(panelContent, document.body)
}
