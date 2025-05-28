export interface TourStep {
  id: string
  target: string // CSS selector
  title: string
  content: string
  placement: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "scroll" | "wait"
  actionTarget?: string
  nextButton?: string
  prevButton?: string
  skipButton?: string
  showProgress?: boolean
  delay?: number
  spotlight?: boolean
  allowClickOutside?: boolean
}

export interface TourConfig {
  id: string
  name: string
  description: string
  steps: TourStep[]
  autoStart?: boolean
  showProgress?: boolean
  allowSkip?: boolean
  onComplete?: () => void
  onSkip?: () => void
}

// Main website tour configuration
export const mainWebsiteTour: TourConfig = {
  id: "main-website-tour",
  name: "Welcome to Smiley Brooms",
  description: "Let us show you how easy it is to book professional cleaning services",
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: "welcome",
      target: "body",
      title: "👋 Welcome to Smiley Brooms!",
      content:
        "We're excited to help you find the perfect cleaning service. Let's take a quick tour to show you how easy it is to book professional cleaning.",
      placement: "center",
      nextButton: "Start Tour",
      skipButton: "Skip Tour",
      showProgress: true,
      spotlight: false,
      allowClickOutside: false,
    },
    {
      id: "hero-section",
      target: '.hero-section, [data-tour="hero"]',
      title: "🏠 Professional Cleaning Services",
      content:
        "We offer comprehensive cleaning services for homes and offices. Our professional team ensures your space is spotless and sanitized.",
      placement: "bottom",
      nextButton: "Next",
      prevButton: "Previous",
      spotlight: true,
      delay: 500,
    },
    {
      id: "service-calculator",
      target: '[data-tour="price-calculator"], .price-calculator',
      title: "💰 Instant Price Calculator",
      content:
        "Get an instant quote by selecting your rooms and service preferences. Our transparent pricing means no surprises!",
      placement: "top",
      nextButton: "Show Me",
      prevButton: "Back",
      spotlight: true,
      action: "scroll",
    },
    {
      id: "room-selection",
      target: '[data-tour="room-selection"], .room-category',
      title: "🏠 Choose Your Rooms",
      content:
        "Select which rooms you'd like cleaned. You can customize each room with different service levels and add-ons.",
      placement: "right",
      nextButton: "Continue",
      prevButton: "Back",
      spotlight: true,
      action: "click",
      actionTarget: '[data-tour="room-increment"]',
    },
    {
      id: "customization",
      target: '[data-tour="customize-button"], button[id^="customize-"]',
      title: "⚙️ Customize Your Service",
      content: 'Click "Customize" to choose service tiers, add-ons, and special instructions for each room type.',
      placement: "left",
      nextButton: "Try It",
      prevButton: "Back",
      spotlight: true,
      action: "click",
    },
    {
      id: "service-tiers",
      target: '[data-tour="service-tiers"], .service-tier',
      title: "⭐ Service Tiers",
      content: "Choose from Essential Clean, Premium Clean, or Deep Clean based on your needs and budget.",
      placement: "top",
      nextButton: "Got It",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "add-to-cart",
      target: '[data-tour="add-to-cart"], .cart-button',
      title: "🛒 Add to Cart",
      content: "Once you've configured your service, add it to your cart. You can book multiple services or locations.",
      placement: "bottom",
      nextButton: "Next",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "cart-review",
      target: '[data-tour="cart"], .cart, [role="dialog"]',
      title: "📋 Review Your Order",
      content: "Review your selected services, adjust quantities, and proceed to checkout when ready.",
      placement: "left",
      nextButton: "Continue",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "booking-complete",
      target: "body",
      title: "🎉 You're All Set!",
      content:
        'That\'s how easy it is to book with Smiley Brooms! Ready to get started? Click "Book Now" to begin your cleaning journey.',
      placement: "center",
      nextButton: "Start Booking",
      prevButton: "Review",
      spotlight: false,
      allowClickOutside: false,
    },
  ],
}

// Quick booking tour for returning users
export const quickBookingTour: TourConfig = {
  id: "quick-booking-tour",
  name: "Quick Booking Guide",
  description: "Fast track to booking your cleaning service",
  autoStart: false,
  showProgress: false,
  allowSkip: true,
  steps: [
    {
      id: "quick-start",
      target: '[data-tour="price-calculator"]',
      title: "⚡ Quick Booking",
      content: "Select your rooms and preferences here for instant pricing.",
      placement: "top",
      nextButton: "Next",
      skipButton: "Skip",
      spotlight: true,
    },
    {
      id: "quick-cart",
      target: '[data-tour="add-to-cart"]',
      title: "🚀 Add & Checkout",
      content: "Add to cart and checkout in just a few clicks!",
      placement: "bottom",
      nextButton: "Done",
      prevButton: "Back",
      spotlight: true,
    },
  ],
}

// Feature-specific tours
export const customizationTour: TourConfig = {
  id: "customization-tour",
  name: "Room Customization Guide",
  description: "Learn how to customize your cleaning service",
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: "customization-intro",
      target: '[data-tour="customization-panel"]',
      title: "🎨 Customization Panel",
      content: "This panel lets you fine-tune your cleaning service for each room type.",
      placement: "left",
      nextButton: "Explore",
      skipButton: "Skip",
      spotlight: true,
    },
    {
      id: "service-tabs",
      target: '[data-tour="service-tabs"]',
      title: "📑 Service Categories",
      content: "Use these tabs to navigate between Basic services, Advanced options, and Scheduling preferences.",
      placement: "bottom",
      nextButton: "Next",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "tier-selection",
      target: '[data-tour="tier-selection"]',
      title: "⭐ Choose Your Tier",
      content: "Select the cleaning intensity that matches your needs and budget.",
      placement: "right",
      nextButton: "Continue",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "add-ons",
      target: '[data-tour="add-ons"]',
      title: "➕ Add Extra Services",
      content: "Enhance your cleaning with additional services like window cleaning or appliance deep clean.",
      placement: "right",
      nextButton: "Next",
      prevButton: "Back",
      spotlight: true,
    },
    {
      id: "price-summary",
      target: '[data-tour="price-summary"]',
      title: "💰 Live Price Updates",
      content: "Watch your price update in real-time as you make selections. No hidden fees!",
      placement: "left",
      nextButton: "Finish",
      prevButton: "Back",
      spotlight: true,
    },
  ],
}

// Tour management
export const availableTours = {
  main: mainWebsiteTour,
  quickBooking: quickBookingTour,
  customization: customizationTour,
}

export type TourType = keyof typeof availableTours
