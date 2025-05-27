"use client"

import { useEffect } from "react"

const MultiStepCustomizationWizard = ({ isOpen }: { isOpen: boolean }) => {
  // Add the scroll to top effect to the existing MultiStepCustomizationWizard component
  // Add this useEffect at the beginning of the component, after the existing useState declarations:

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

// Make sure the component is exported as a named export
export { MultiStepCustomizationWizard }
