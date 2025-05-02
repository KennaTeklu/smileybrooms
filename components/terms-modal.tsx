"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your use of the services provided by [Company Name] ("Company,"
              "we," "our," or "us") and any related services, including our waitlist, website, and platform (the
              "Service"). By accessing or using the Service, you agree to comply with and be bound by these Terms. If
              you do not agree to these Terms, you should refrain from using the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age or have the legal capacity to enter into a binding agreement under
              the laws of your jurisdiction to use the Service. By using the Service, you represent and warrant that you
              meet these eligibility requirements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Registration and Account</h2>
            <p>
              To join the waitlist, you may be required to provide certain personal information, including your name,
              email address, and phone number. You agree to provide accurate and complete information and to promptly
              update any changes to your account. You are responsible for maintaining the confidentiality of your
              account credentials and agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Use of Service</h2>
            <p>
              The Service is provided solely for your personal use. You may not use the Service for any unlawful purpose
              or in any manner that could damage, disable, overburden, or impair the Service. You agree not to engage in
              any activity that interferes with or disrupts the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Privacy and Data Collection</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which outlines the types of data we
              collect, how we use that data, and your rights concerning your personal data. By using the Service, you
              consent to the collection and use of your data as described in the Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service, or any portion thereof, at any time
              without notice. We also reserve the right to amend these Terms at our sole discretion. Any modifications
              will be effective upon posting the updated Terms on our website. Continued use of the Service after such
              modifications constitutes your acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from or related to your use of the Service. Our total
              liability under these Terms shall not exceed the amount you have paid to us, if any, for access to the
              Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
              the Company is headquartered, without regard to its conflict of law principles. Any disputes arising from
              or related to these Terms or the Service shall be resolved in the competent courts of that jurisdiction.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
