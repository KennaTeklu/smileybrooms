"use client"

import { useState } from "react"
import { Phone, UserPlus, Copy } from "lucide-react"
import { useDeviceDetection } from "@/hooks/use-device-detection"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface InteractivePhoneNumberProps {
  phoneNumber: string
  className?: string
  showIcon?: boolean
  variant?: "default" | "subtle" | "link"
}

export function InteractivePhoneNumber({
  phoneNumber,
  className,
  showIcon = true,
  variant = "default",
}: InteractivePhoneNumberProps) {
  const [copied, setCopied] = useState(false)
  const deviceInfo = useDeviceDetection()
  const formattedNumber = phoneNumber.replace(/[^\d+]/g, "")

  // Format for display
  const displayNumber = phoneNumber.includes("(")
    ? phoneNumber
    : phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(formattedNumber)
    setCopied(true)
    toast({
      title: "Phone number copied",
      description: `${displayNumber} has been copied to your clipboard.`,
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddContact = () => {
    // Create a vCard format
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:smileybrooms
TEL;TYPE=WORK,VOICE:${formattedNumber}
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.download = "smileybrooms.vcf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Contact created",
      description: "The contact file has been downloaded. Open it to add to your contacts.",
      duration: 3000,
    })
  }

  // Determine if we should show the dropdown or direct call link
  const showDropdown = !deviceInfo.isMobile || (deviceInfo.isMobile && !deviceInfo.isIOS && !deviceInfo.isAndroid)

  const variantStyles = {
    default: "text-primary hover:text-primary-dark transition-colors",
    subtle: "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors",
    link: "underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors",
  }

  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn("inline-flex items-center gap-1 cursor-pointer", variantStyles[variant], className)}
            aria-label={`Phone number: ${displayNumber}`}
          >
            {showIcon && <Phone className="h-4 w-4" />}
            <span>{displayNumber}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleAddContact}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Add to contacts</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyNumber}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy number</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`tel:${formattedNumber}`}>
              <Phone className="mr-2 h-4 w-4" />
              <span>Call now</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // For mobile devices, show tooltip with direct call link
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={`tel:${formattedNumber}`}
            className={cn("inline-flex items-center gap-1", variantStyles[variant], className)}
            onClick={(e) => {
              // On iOS and Android, also try to create a contact
              if (deviceInfo.isIOS || deviceInfo.isAndroid) {
                // This will happen after the call is initiated or rejected
                setTimeout(handleAddContact, 1000)
              }
            }}
          >
            {showIcon && <Phone className="h-4 w-4" />}
            <span>{displayNumber}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tap to call or add contact</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
