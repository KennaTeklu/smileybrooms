"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useDeviceDetection } from "@/hooks/use-device-detection"

interface PhoneNumberContextType {
  formatPhoneNumber: (phoneNumber: string) => string
  createContact: (phoneNumber: string, name?: string) => void
  callPhoneNumber: (phoneNumber: string) => void
  deviceSupportsDirectCalls: boolean
}

const PhoneNumberContext = createContext<PhoneNumberContextType | undefined>(undefined)

export function PhoneNumberProvider({ children }: { children: ReactNode }) {
  const deviceInfo = useDeviceDetection()

  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, "")

    // Format for US numbers
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
    }

    // Format for international numbers
    if (cleaned.startsWith("+") && cleaned.length > 10) {
      return cleaned
    }

    // Format for US numbers with country code
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`
    }

    return phoneNumber
  }

  const createContact = (phoneNumber: string, name = "smileybrooms") => {
    // Create a vCard format
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=WORK,VOICE:${phoneNumber.replace(/[^\d+]/g, "")}
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.download = `${name}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const callPhoneNumber = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`
  }

  const value = {
    formatPhoneNumber,
    createContact,
    callPhoneNumber,
    deviceSupportsDirectCalls: deviceInfo.isMobile || deviceInfo.isTablet,
  }

  return <PhoneNumberContext.Provider value={value}>{children}</PhoneNumberContext.Provider>
}

export function usePhoneNumber() {
  const context = useContext(PhoneNumberContext)
  if (context === undefined) {
    throw new Error("usePhoneNumber must be used within a PhoneNumberProvider")
  }
  return context
}
