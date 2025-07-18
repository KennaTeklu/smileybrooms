"use client"

import { useEffect, useState } from "react"
import { useTour } from "../../contexts/tour-context"
import { useExitIntent, useElementHesitation, useScrollTrigger } from "../../hooks/use-tour-triggers"
import { createTourSteps } from "../../lib/tour-steps"
import { FaQuestion, FaTimes, FaExclamationTriangle } from "react-icons/fa"

const WebsiteTour = () => {
  const { tourState, updateTourState, startTour, completeTour, skipTour, analytics } = useTour()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showOptOutConfirmation, setShowOptOutConfirmation] = useState(false)
  const tourSteps = createTourSteps()

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS

  const exitIntentCallback = () => {
    if (!tourState.hasCompleted && !tourState.isActive) {
      analytics.trackEvent("tour_triggered_exit_intent")
      startTour()
    }
  }

  const priceHesitationCallback = () => {
    if (!tourState.hasCompleted && !tourState.isActive) {
      analytics.trackEvent("tour_triggered_price_hesitation")
      setCurrentStepIndex(4)
      startTour()
    }
  }

  const configHesitationCallback = () => {
    if (!tourState.hasCompleted && !tourState.isActive) {
      analytics.trackEvent("tour_triggered_config_hesitation")
      setCurrentStepIndex(3)
      startTour()
    }
  }

  const scrollTriggerCallback = () => {
    if (!tourState.hasCompleted && !tourState.isActive) {
      analytics.trackEvent("tour_triggered_scroll")
      startTour()
    }
  }

  // Hook calls - these must always run
  useExitIntent(exitIntentCallback)
  useElementHesitation(".price-calculator", 5000, priceHesitationCallback)
  useElementHesitation(".room-configurator", 3000, configHesitationCallback)
  useScrollTrigger(50, scrollTriggerCallback)

  // Effect hooks
  useEffect(() => {
    if (tourState.isActive) {
      setIsVisible(true)
      const currentStep = tourSteps[currentStepIndex]
      if (currentStep.target) {
        const element = document.querySelector(currentStep.target)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    } else {
      setIsVisible(false)
    }
  }, [tourState.isActive, currentStepIndex])

  // NOW we can do conditional returns after all hooks are called
  if (!tourState.showAgain) {
    return null
  }

  // Handle opt-out confirmation
  const handleOptOutRequest = () => {
    setShowOptOutConfirmation(true)
    analytics.trackEvent("tour_opt_out_requested", {
      step: currentStepIndex + 1,
      stepId: tourSteps[currentStepIndex].id,
    })
  }

  const confirmOptOut = () => {
    updateTourState({ showAgain: false })
    setShowOptOutConfirmation(false)
    setIsVisible(false)
    analytics.trackEvent("tour_opt_out_confirmed", {
      step: currentStepIndex + 1,
      stepId: tourSteps[currentStepIndex].id,
    })
  }

  const cancelOptOut = () => {
    setShowOptOutConfirmation(false)
    analytics.trackEvent("tour_opt_out_cancelled", {
      step: currentStepIndex + 1,
      stepId: tourSteps[currentStepIndex].id,
    })
  }

  // Rest of the component logic remains the same...
  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      updateTourState({ lastStepCompleted: currentStepIndex + 1 })
      analytics.trackEvent("tour_step_completed", { step: currentStepIndex + 1 })
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      analytics.trackEvent("tour_step_back", { step: currentStepIndex })
    }
  }

  const handleComplete = () => {
    completeTour()
    setIsVisible(false)
    setCurrentStepIndex(0)
  }

  const handleSkip = () => {
    skipTour()
    setIsVisible(false)
    setCurrentStepIndex(0)
  }

  const currentStep = tourSteps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / tourSteps.length) * 100

  if (!isVisible) {
    return (
      <button
        className="tour-launch-button"
        onClick={() => {
          analytics.trackEvent("tour_manual_start")
          startTour()
        }}
        aria-label="Start website tour"
      >
        <span className="tour-icon">
          <FaQuestion />
        </span>
        <span className="tour-label">How It Works</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" onClick={handleSkip} />

      {/* Opt-out Confirmation Modal */}
      {showOptOutConfirmation && (
        <div className="tour-confirmation-overlay">
          <div className="tour-confirmation-modal">
            <div className="confirmation-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Are you sure?</h3>
            </div>
            <div className="confirmation-content">
              <p>
                If you choose "Don't show this again," you won't see this helpful tour in the future, even if you visit
                from a different device or clear your browser data.
              </p>
              <div className="confirmation-benefits">
                <p>
                  <strong>This tour helps you:</strong>
                </p>
                <ul>
                  <li>Understand our customization options</li>
                  <li>See transparent pricing</li>
                  <li>Learn about discounts and savings</li>
                  <li>Navigate the booking process easily</li>
                </ul>
              </div>
              <p className="confirmation-note">
                <strong>Note:</strong> You can always restart the tour by clicking the "How It Works" button.
              </p>
            </div>
            <div className="confirmation-buttons">
              <button className="tour-button tour-button-secondary" onClick={cancelOptOut}>
                Keep Tour Available
              </button>
              <button className="tour-button tour-button-danger" onClick={confirmOptOut}>
                Don't Show Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour tooltip */}
      <div className="tour-tooltip" data-step={currentStep.id}>
        {/* Header */}
        <div className="tour-header">
          <div className="tour-title-section">
            <h3 className="tour-title">{currentStep.title}</h3>
            <button className="tour-close" onClick={handleSkip} aria-label="Close tour">
              <FaTimes />
            </button>
          </div>
          {currentStep.showProgress && (
            <div className="tour-progress">
              <div className="tour-progress-bar" style={{ width: `${progress}%` }} />
              <span className="tour-progress-text">
                Step {currentStepIndex + 1} of {tourSteps.length}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="tour-content-wrapper">{currentStep.content}</div>

        {/* Footer */}
        <div className="tour-footer">
          <div className="tour-buttons">
            {currentStepIndex > 0 && (
              <button className="tour-button tour-button-secondary" onClick={handleBack}>
                ← Back
              </button>
            )}

            {currentStepIndex < tourSteps.length - 1 ? (
              <button className="tour-button tour-button-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button className="tour-button tour-button-primary" onClick={handleComplete}>
                Finish Tour
              </button>
            )}
          </div>

          {/* Don't show again option - NOW ON EVERY STEP */}
          <div className="tour-settings">
            <label className="tour-checkbox-label">
              <input
                type="checkbox"
                checked={false} // Always unchecked, confirmation handles the actual state
                onChange={handleOptOutRequest}
              />
              Don't show this tour again
            </label>
          </div>
        </div>
      </div>

      {/* Highlight target element */}
      {currentStep.target && (
        <style jsx>{`
          ${currentStep.target} {
            position: relative;
            z-index: 9999;
            box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.5);
            border-radius: 8px;
            animation: tourHighlight 2s infinite;
          }
          
          @keyframes tourHighlight {
            0% { box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.5); }
            50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0.3); }
            100% { box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.5); }
          }
        `}</style>
      )}
    </>
  )
}

export default WebsiteTour
