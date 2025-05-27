"use client"

import { Button } from "@/components/ui/button"
import { Contact } from "lucide-react"
import { useState } from "react"
import { CustomQuoteWizard } from "./custom-quote-wizard"
import { autoScrollToSection } from "@/lib/scroll-to-section"

interface RequestQuoteButtonProps {
  showIcon?: boolean
  className?: string
  scrollToSection?: string
  autoScroll?: boolean
}

export function RequestQuoteButton({
  showIcon = false,
  className = "",
  scrollToSection = "custom-quote-section",
  autoScroll = true,
}: RequestQuoteButtonProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const handleClick = () => {
    setIsWizardOpen(true)

    // Auto-scroll to the custom quote section when wizard opens
    if (autoScroll) {
      autoScrollToSection(scrollToSection, 200, 80)
    }
  }

  return (
    <>
      <Button variant="outline" className={className} onClick={handleClick} aria-label="Request a custom quote">
        {showIcon && <Contact className="mr-2 h-4 w-4" aria-hidden="true" />}
        Request Custom Quote
      </Button>

      <CustomQuoteWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  )
}
