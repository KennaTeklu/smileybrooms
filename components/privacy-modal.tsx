"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              This Privacy Policy ("Policy") explains how [Company Name] ("we," "our," "us") collects, uses, and
              protects your personal information when you access and use our services, including our website, platform,
              and waitlist services (collectively referred to as the "Service"). By using the Service, you consent to
              the practices described in this Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when using the Service, including but
              not limited to your name, email address, phone number, and any other information you submit through forms
              on our website or platform. We may also collect non-personally identifiable information, such as usage
              data and cookies, to improve the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Use of Information</h2>
            <p>We use your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>To manage your position on our waitlist;</li>
              <li>To send you updates about the launch of our service;</li>
              <li>To improve and personalize the Service;</li>
              <li>To send important notifications related to your use of the Service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information. However, we may share your data with trusted
              third parties for purposes such as data storage, analysis, or communication. We ensure that such third
              parties adhere to similar privacy and security standards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction. While we strive to protect your data, no
              method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
            <p>Under applicable law, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal information we hold about you;</li>
              <li>Request corrections to any inaccurate data;</li>
              <li>Request the deletion of your personal data;</li>
              <li>Opt out of receiving communications from us.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Updates to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
              the revised Policy on our website. Continued use of the Service after the posting of any updates
              constitutes your acceptance of the new terms.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
