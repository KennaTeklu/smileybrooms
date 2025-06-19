/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidePanelFooterProps {
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
  children?: React.ReactNode
}

export function SidePanelFooter({ primaryAction, secondaryAction, priceDisplay, children }: SidePanelFooterProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {priceDisplay && (
        <>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{priceDisplay.label}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {priceDisplay.currency || "$"}
                {priceDisplay.amount.toFixed(2)}
              </span>
            </div>
          </div>
          <Separator />
        </>
      )}

      <div className="p-4 space-y-3">
        {children}

        <div className="flex gap-3">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="flex-1"
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button onClick={primaryAction.onClick} disabled={primaryAction.disabled} className="flex-1">
              {primaryAction.loading ? "Loading..." : primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
