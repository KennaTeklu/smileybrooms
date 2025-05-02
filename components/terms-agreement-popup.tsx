"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TermsAgreementPopupProps {
  onAccept: () => void
}

export default function TermsAgreementPopup({ onAccept }: TermsAgreementPopupProps) {
  const [open, setOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    // Check if terms have been accepted before
    const termsAccepted = localStorage.getItem("termsAccepted")
    if (!termsAccepted) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true")
    setOpen(false)
    onAccept()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Only allow closing if terms are accepted
        if (!isOpen && !accepted) {
          return // Prevent closing
        }
        setOpen(isOpen)
      }}
    >
      <DialogContent
        className="sm:max-w-md max-h-[80vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue using our services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 text-sm">
          <h3 className="font-medium">Service Agreement</h3>
          <p>
            By using our website and services, you agree to the following terms and conditions. These terms govern your
            use of the smileybrooms LLC website and services.
          </p>

          <h3 className="font-medium">Cleaning Services</h3>
          <p>
            Our cleaning services are provided as described on our website. Prices may vary based on the size of your
            home, current cleanliness level, and selected service type.
          </p>

          <h3 className="font-medium">Special Requests and Allergies</h3>
          <p>
            If you have any special requests, allergies, or sensitivities to cleaning products, please include this
            information in the special instructions field when adding your service to the cart. We can accommodate most
            requests with advance notice.
          </p>

          <h3 className="font-medium">Multiple Addresses</h3>
          <p>
            You can add cleaning services for multiple addresses in a single checkout for your convenience. Each address
            will be treated as a separate service with its own scheduling.
          </p>

          <h3 className="font-medium">Cancellation Policy</h3>
          <p>
            Cancellations must be made at least 24 hours before your scheduled service. Late cancellations may be
            subject to a fee of up to 50% of the service cost.
          </p>

          <h3 className="font-medium">Privacy Policy</h3>
          <p>
            We respect your privacy and will only use your personal information to provide and improve our services. We
            will not share your information with third parties except as necessary to provide our services.
          </p>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="terms" checked={accepted} onCheckedChange={(checked) => setAccepted(checked === true)} />
            <Label htmlFor="terms">I have read and agree to the terms and conditions</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" disabled={!accepted} onClick={handleAccept}>
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
