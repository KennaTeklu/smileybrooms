"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { DiscountRescueModal } from "./discount-rescue-modal" // Assuming this component exists

interface AbandonmentProviderProps {
  children: React.ReactNode
}

export function AbandonmentProvider({ children }: AbandonmentProviderProps) {
  const [showRescueModal, setShowRescueModal] = useState(false)

  const handleAbandonmentDetected = useCallback(() => {
    console.log("Abandonment detected! Showing rescue modal.")
    setShowRescueModal(true)
  }, [])

  // Use environment variable for threshold if available, otherwise default
  const abandonmentThreshold = process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS
    ? Number.parseInt(process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS, 10)
    : 30

  // Use environment variable to enable/disable the feature
  const enableAbandonmentRescue = process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_ENABLED === "true"

  const { resetTimer } = rescueFunnel({
    thresholdSeconds: abandonmentThreshold,
    onAbandonmentDetected: handleAbandonmentDetected,
    enabled: enableAbandonmentRescue,
  })

  const handleCloseModal = useCallback(() => {
    setShowRescueModal(false)
    resetTimer() // Reset timer after modal is closed
  }, [resetTimer])

  useEffect(() => {
    // Optionally, reset timer on route change if using Next.js router
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // const handleRouteChange = () => resetTimer();
    // router.events.on('routeChangeStart', handleRouteChange);
    // return () => {
    //   router.events.off('routeChangeStart', handleRouteChange);
    // };
  }, [resetTimer])

  if (!enableAbandonmentRescue) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      {showRescueModal && (
        <DiscountRescueModal
          isOpen={showRescueModal}
          onClose={handleCloseModal}
          // You might pass other props to the modal, e.g., discount code
        />
      )}
    </>
  )
}
