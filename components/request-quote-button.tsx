"use client"

import { Button } from "@/components/ui/button"
import { Contact } from "lucide-react"
import { useState } from "react"
import { CustomQuoteWizard } from "./custom-quote-wizard"

interface RequestQuoteButtonProps {
  showIcon?: boolean
  className?: string
}

export function RequestQuoteButton({ showIcon = false, className = "" }: RequestQuoteButtonProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className={className}
        onClick={() => setIsWizardOpen(true)}
        aria-label="Request a custom quote"
      >
        {showIcon && <Contact className="mr-2 h-4 w-4" aria-hidden="true" />}
        Request Custom Quote
      </Button>

      <CustomQuoteWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  )
}
