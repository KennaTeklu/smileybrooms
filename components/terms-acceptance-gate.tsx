"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ComprehensiveTermsDocument } from "./comprehensive-terms-document"
import { Button } from "@/components/ui/button"
import { FileText, Lock, Unlock } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface TermsAcceptanceGateProps {
  children: React.ReactNode
}

export function TermsAcceptanceGate({ children }: TermsAcceptanceGateProps) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Check if user has previously accepted terms
    const termsAccepted = localStorage.getItem("termsAccepted")
    if (termsAccepted === "true") {
      setHasAcceptedTerms(true)
    }
    setIsLoading(false)
  }, [])

  const handleAcceptTerms = () => {
    localStorage.setItem("termsAccepted", "true")
    setHasAcceptedTerms(true)
    setIsDialogOpen(false)
  }

  const handleDeclineTerms = () => {
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!hasAcceptedTerms) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto my-8">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Terms and Conditions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Before accessing our pricing information and services, please review and accept our Terms and Conditions.
            These terms outline important information about our services, your rights, and our obligations.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="mr-2 h-4 w-4" />
                Review Terms and Conditions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
              <ComprehensiveTermsDocument onAccept={handleAcceptTerms} onDecline={handleDeclineTerms} />
            </DialogContent>
          </Dialog>

          <p className="text-sm text-gray-500">By accepting, you agree to our terms of service and privacy policy.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Unlock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">Terms Accepted</h3>
            <p className="text-sm text-green-600">You have accepted our terms and conditions</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Review Terms
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0">
            <ComprehensiveTermsDocument showActions={false} />
          </DialogContent>
        </Dialog>
      </div>
      {children}
    </div>
  )
}
