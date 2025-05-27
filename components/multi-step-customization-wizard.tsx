"use client"

import { useEffect } from "react"

const MultiStepCustomizationWizard = ({ isOpen }: { isOpen: boolean }) => {
  // Add this useEffect after the existing useEffects
  useEffect(() => {
    if (isOpen) {
      // Scroll to top when wizard opens
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [isOpen])

  return (
    <div>
      {isOpen ? (
        <div>
          <h1>Customization Wizard</h1>
          <p>This is a multi-step customization wizard.</p>
        </div>
      ) : null}
    </div>
  )
}

export default MultiStepCustomizationWizard
