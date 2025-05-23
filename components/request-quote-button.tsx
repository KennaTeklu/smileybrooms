"use client"

import { Button } from "@/components/ui/button"
import { Contact } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface RequestQuoteButtonProps {
  showIcon?: boolean
  className?: string
}

export function RequestQuoteButton({ showIcon = false, className = "" }: RequestQuoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleClick = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Request Received",
        description: "We'll contact you shortly to discuss your custom quote.",
        duration: 5000,
      })
    }, 1000)
  }

  return (
    <Button
      variant="outline"
      className={className}
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Request a custom quote"
    >
      {isLoading ? (
        "Sending Request..."
      ) : (
        <>
          {showIcon && <Contact className="mr-2 h-4 w-4" aria-hidden="true" />}
          Request Custom Quote
        </>
      )}
    </Button>
  )
}
