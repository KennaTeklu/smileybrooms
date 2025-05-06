/**
 * Terms Button Component
 *
 * IMPORTANT: Company name is always "smileybrooms" (lowercase, one word)
 *
 * This component provides a button to open the terms modal from anywhere in the app.
 */

"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useTerms } from "@/lib/terms-context"

interface TermsButtonProps extends ButtonProps {
  showIcon?: boolean
  label?: string
}

export function TermsButton({
  showIcon = true,
  label = "Terms & Privacy",
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: TermsButtonProps) {
  const { openTermsModal } = useTerms()

  return (
    <Button onClick={openTermsModal} variant={variant} size={size} className={className} {...props}>
      {showIcon && <FileText className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  )
}
