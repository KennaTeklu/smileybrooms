/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
import type React from "react"
import { FaHome, FaBed, FaMoneyBillWave, FaCheck, FaStar, FaClock, FaShieldAlt } from "react-icons/fa"

export interface TourStep {
  id: string
  title: string
  content: React.ReactNode
  target?: string
  placement?: "top" | "bottom" | "left" | "right"
  showProgress?: boolean
  buttons?: Array<{
    text: string
    action: string
    classes?: string
  }>
}

export const createTourSteps = (): TourStep[] => [
  {
    id: "welcome",
    title: "Welcome to CleanPro! 🏠",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaHome />
        </div>
        <h3>
          Get <span className="highlight">custom cleaning for every room</span>
        </h3>
        <p>
          We're the only service that lets you customize cleaning intensity for each room. Let us show you how it works!
        </p>
        <div className="tour-benefits">
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>Only pay for what you need</span>
          </div>
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>Transparent, upfront pricing</span>
          </div>
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>Professional, insured cleaners</span>
          </div>
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [{ text: "Get Started →", action: "next", classes: "shepherd-button-primary" }],
  },
  {
    id: "room-selection",
    title: "Step 1: Choose Your Rooms",
    target: ".room-category, .service-selections",
    placement: "top",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaBed />
        </div>
        <h3>Select which rooms need cleaning</h3>
        <p>Pick bedrooms, bathrooms, kitchen, living areas - whatever you need cleaned.</p>
        <div className="tour-tip">
          <strong>💡 Pro Tip:</strong> You can customize each room differently in the next step!
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Next →", action: "next", classes: "shepherd-button-primary" },
    ],
  },
  {
    id: "service-tiers",
    title: "Step 2: Choose Cleaning Intensity",
    target: ".room-configurator, .service-tiers",
    placement: "bottom",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaStar />
        </div>
        <h3>Pick the right cleaning level for each room</h3>
        <div className="service-tiers-explanation">
          <div className="tier">
            <div className="tier-badge essential">Essential</div>
            <p>Basic cleaning for tidy rooms ($25/room)</p>
          </div>
          <div className="tier">
            <div className="tier-badge advanced">Advanced</div>
            <p>Thorough cleaning for regular maintenance ($75/room)</p>
          </div>
          <div className="tier">
            <div className="tier-badge premium">Premium</div>
            <p>Deep cleaning for maximum freshness ($225/room)</p>
          </div>
        </div>
        <div className="tour-tip">
          <strong>💡 Smart Choice:</strong> Kitchen and bathrooms often need Advanced, while bedrooms might only need
          Essential.
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Next →", action: "next", classes: "shepherd-button-primary" },
    ],
  },
  {
    id: "customization",
    title: "Step 3: Add-ons & Customization",
    target: ".room-customization-panel, .enhanced-room-customization-panel",
    placement: "left",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaShieldAlt />
        </div>
        <h3>Make it perfect for your needs</h3>
        <p>Add extra services like inside oven cleaning, or remove services you don't need to save money.</p>
        <div className="customization-examples">
          <div className="example">
            <strong>Add:</strong> Inside refrigerator cleaning (+$15)
          </div>
          <div className="example">
            <strong>Remove:</strong> Window cleaning (-$10)
          </div>
        </div>
        <div className="tour-tip">
          <strong>🎯 This is what makes us different:</strong> Total control over your cleaning service!
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Next →", action: "next", classes: "shepherd-button-primary" },
    ],
  },
  {
    id: "pricing",
    title: "Step 4: Transparent Pricing",
    target: ".price-calculator, .price-breakdown",
    placement: "top",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaMoneyBillWave />
        </div>
        <h3>See your exact price with no hidden fees</h3>
        <p>Watch your total update in real-time as you make changes. What you see is what you pay!</p>
        <div className="pricing-benefits">
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>No surprise charges</span>
          </div>
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>Recurring service discounts</span>
          </div>
          <div className="benefit">
            <FaCheck className="benefit-icon" />
            <span>Secure online payment</span>
          </div>
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Next →", action: "next", classes: "shepherd-button-primary" },
    ],
  },
  {
    id: "frequency",
    title: "Step 5: Save with Regular Service",
    target: ".frequency-selector",
    placement: "bottom",
    content: (
      <div className="tour-content">
        <div className="tour-header-icon">
          <FaClock />
        </div>
        <h3>Get discounts for recurring cleaning</h3>
        <div className="frequency-discounts">
          <div className="discount">
            <strong>Weekly:</strong> 15% off every cleaning
          </div>
          <div className="discount">
            <strong>Bi-weekly:</strong> 10% off every cleaning
          </div>
          <div className="discount">
            <strong>Monthly:</strong> 5% off every cleaning
          </div>
        </div>
        <div className="tour-tip">
          <strong>💰 Money Saver:</strong> Weekly service can save you $100+ per month!
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Next →", action: "next", classes: "shepherd-button-primary" },
    ],
  },
  {
    id: "booking",
    title: "You're Almost Done! 🎉",
    target: ".checkout-button, .book-now-button",
    placement: "top",
    content: (
      <div className="tour-content">
        <h3>Ready for a spotless home?</h3>
        <div className="booking-steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Enter your address</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Choose date & time</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Pay upfront securely</p>
          </div>
        </div>
        <div className="satisfaction-guarantee">
          <FaShieldAlt className="guarantee-icon" />
          <p>
            <strong>100% Satisfaction Guaranteed</strong> - Not happy? We'll make it right or refund your money.
          </p>
        </div>
      </div>
    ),
    showProgress: true,
    buttons: [
      { text: "← Back", action: "back", classes: "shepherd-button-secondary" },
      { text: "Finish Tour", action: "complete", classes: "shepherd-button-primary" },
    ],
  },
]
