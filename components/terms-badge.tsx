"use client"

import { useState, useEffect } from "react"
import { Lock, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TermsModal from "./terms-modal"
import { useToast } from "@/hooks/use-toast"

export default function TermsBadge() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    try {
      // Check if terms have been accepted
      const accepted = localStorage.getItem("termsAccepted") === "true"
      setTermsAccepted(accepted)

      // Auto-open modal if terms not accepted
      if (!accepted) {
        setIsModalOpen(true)
      }

      setMounted(true)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Fallback to showing the modal
      setIsModalOpen(true)
      setMounted(true)
    }
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms to continue using all features.",
        variant: "destructive",
      })
      return
    }
    setIsModalOpen(false)
  }

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setIsModalOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Badge */}
      <AnimatePresence>
        {!isModalOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenModal}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg flex items-center justify-center"
            style={{
              backgroundColor: termsAccepted ? "rgba(22, 163, 74, 0.9)" : "rgba(220, 38, 38, 0.9)",
              color: "white",
            }}
            aria-label={termsAccepted ? "Terms Accepted" : "View Terms and Conditions"}
          >
            {termsAccepted ? <CheckCircle className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <TermsModal isOpen={isModalOpen} onClose={handleCloseModal} onAccept={handleAcceptTerms} initialTab="terms" />
    </>
  )
}
