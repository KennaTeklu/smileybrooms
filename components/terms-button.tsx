"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useTerms } from "@/lib/terms-context"
import Link from "next/link"

interface TermsButtonProps extends ButtonProps {
  showIcon?: boolean
  label?: string
  useLink?: boolean
}

export function TermsButton({
  showIcon = true,
  label = "Terms & Privacy",
  useLink = false,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: TermsButtonProps) {
  const { openTermsModal } = useTerms()

  if (useLink) {
    return (
      <Link href="/terms" passHref>
        <Button as="a" variant={variant} size={size} className={className} {...props}>
          {showIcon && <FileText className="h-4 w-4 mr-2" />}
          {label}
        </Button>
      </Link>
    )
  }

  return (
    <Button onClick={openTermsModal} variant={variant} size={size} className={className} {...props}>
      {showIcon && <FileText className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  )
}
