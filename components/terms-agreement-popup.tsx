"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TermsAgreementPopupProps {
  onAccept: () => void
}

export default function TermsAgreementPopup({ onAccept }: TermsAgreementPopupProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/*<DialogTrigger asChild>*/}
      {/*  <Button variant="outline">Show Terms</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>Please agree to our terms to continue.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Terms content would go here, possibly in a scrollable area */}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl sed ultricies lacinia, nisl nisl
            aliquet nisl, eget euismod nisl nisl eget.
          </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onAccept}>
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
