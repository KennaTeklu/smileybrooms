"use client"

import { useState, useEffect } from "react"

// This is a client-side hook for demonstration purposes.
// In a real application, feature flags would typically be fetched from a server
// or a dedicated feature flag service (e.g., LaunchDarkly, Split.io).
// Environment variables are usually server-side only unless prefixed with NEXT_PUBLIC_.

interface FeatureFlag {
  key: string
  enabled: boolean
  description: string
}

const defaultFeatureFlags: FeatureFlag[] = [
  {
    key: "NEXT_PUBLIC_FEATURE_NEW_PRICING_MODEL",
    enabled: process.env.NEXT_PUBLIC_FEATURE_NEW_PRICING_MODEL === "true",
    description: "Enables the new pricing model interface.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ADVANCED_CART",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_CART === "true",
    description: "Enables advanced cart features like abandonment rescue.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ROOM_VISUALIZATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ROOM_VISUALIZATION === "true",
    description: "Enables 3D room visualization.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_AI_POWERED_CHATBOT",
    enabled: process.env.NEXT_PUBLIC_FEATURE_AI_POWERED_CHATBOT === "true",
    description: "Enables the AI-powered chatbot.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DYNAMIC_PAYMENT_OPTIONS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DYNAMIC_PAYMENT_OPTIONS === "true",
    description: "Enables dynamic payment gateway selection.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ENHANCED_ACCESSIBILITY",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ENHANCED_ACCESSIBILITY === "true",
    description: "Enables enhanced accessibility toolbar.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CAREER_APPLICATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CAREER_APPLICATION === "true",
    description: "Enables online career application forms.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_EMAIL_SUMMARY",
    enabled: process.env.NEXT_PUBLIC_FEATURE_EMAIL_SUMMARY === "true",
    description: "Enables email summary of services.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_TERMS_AGREEMENT_POPUP",
    enabled: process.env.NEXT_PUBLIC_FEATURE_TERMS_AGREEMENT_POPUP === "true",
    description: "Enables a popup for terms agreement.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DEVICE_OPTIMIZED_THEMES",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DEVICE_OPTIMIZED_THEMES === "true",
    description: "Enables themes optimized for different devices.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ADVANCED_SCROLL_PHYSICS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_SCROLL_PHYSICS === "true",
    description: "Enables advanced scroll physics.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_GEOLOCATION_SERVICES",
    enabled: process.env.NEXT_PUBLIC_FEATURE_GEOLOCATION_SERVICES === "true",
    description: "Enables geolocation services for service area detection.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_BIOMETRIC_AUTHENTICATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_BIOMETRIC_AUTHENTICATION === "true",
    description: "Enables biometric authentication.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_WEB_SHARE_API",
    enabled: process.env.NEXT_PUBLIC_FEATURE_WEB_SHARE_API === "true",
    description: "Enables Web Share API for sharing content.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_VOICE_COMMANDS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_VOICE_COMMANDS === "true",
    description: "Enables voice command interface.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_PERFORMANCE_MONITORING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_PERFORMANCE_MONITORING === "true",
    description: "Enables client-side performance monitoring.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_NETWORK_STATUS_INDICATOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_NETWORK_STATUS_INDICATOR === "true",
    description: "Enables network status indicator.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_BATTERY_STATUS_OPTIMIZATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_BATTERY_STATUS_OPTIMIZATION === "true",
    description: "Enables battery status optimization.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_VIBRATION_FEEDBACK",
    enabled: process.env.NEXT_PUBLIC_FEATURE_VIBRATION_FEEDBACK === "true",
    description: "Enables haptic feedback for interactions.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_KEYBOARD_SHORTCUTS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_KEYBOARD_SHORTCUTS === "true",
    description: "Enables keyboard shortcuts.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CLIPBOARD_INTEGRATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CLIPBOARD_INTEGRATION === "true",
    description: "Enables clipboard integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DRAG_AND_DROP_SUPPORT",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DRAG_AND_DROP_SUPPORT === "true",
    description: "Enables drag and drop support.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_FULL_HOUSE_PACKAGES",
    enabled: process.env.NEXT_PUBLIC_FEATURE_FULL_HOUSE_PACKAGES === "true",
    description: "Enables full house cleaning packages.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CLEANLINESS_SLIDER",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CLEANLINESS_SLIDER === "true",
    description: "Enables cleanliness level slider.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CUSTOM_QUOTE_WIZARD",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_QUOTE_WIZARD === "true",
    description: "Enables custom quote wizard.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_SERVICE_COMPARISON_TABLE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_SERVICE_COMPARISON_TABLE === "true",
    description: "Enables service comparison table.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_TESTIMONIALS_SECTION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_TESTIMONIALS_SECTION === "true",
    description: "Enables testimonials section.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_FAQ_SECTION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_FAQ_SECTION === "true",
    description: "Enables FAQ section.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_HOW_IT_WORKS_SECTION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_HOW_IT_WORKS_SECTION === "true",
    description: "Enables 'How It Works' section.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CALL_TO_ACTION_SECTION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CALL_TO_ACTION_SECTION === "true",
    description: "Enables call to action section.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_FLOATING_CART_BUTTON",
    enabled: process.env.NEXT_PUBLIC_FEATURE_FLOATING_CART_BUTTON === "true",
    description: "Enables floating cart button.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE === "true",
    description: "Enables cart abandonment rescue features.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CART_HEALTH_DASHBOARD",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CART_HEALTH_DASHBOARD === "true",
    description: "Enables cart health dashboard.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_PRODUCT_CATALOG",
    enabled: process.env.NEXT_PUBLIC_FEATURE_PRODUCT_CATALOG === "true",
    description: "Enables product catalog display.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_SERVICE_MAP",
    enabled: process.env.NEXT_PUBLIC_FEATURE_SERVICE_MAP === "true",
    description: "Enables service area map.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CLEANING_CHECKLIST",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CLEANING_CHECKLIST === "true",
    description: "Enables cleaning checklist.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CLEANING_TEAM_SELECTOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CLEANING_TEAM_SELECTOR === "true",
    description: "Enables cleaning team selector.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CLEANING_TIME_ESTIMATOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CLEANING_TIME_ESTIMATOR === "true",
    description: "Enables cleaning time estimator.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_SERVICE_DETAILS_MODAL",
    enabled: process.env.NEXT_PUBLIC_FEATURE_SERVICE_DETAILS_MODAL === "true",
    description: "Enables service details modal.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_SERVICE_TYPE_SELECTOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_SERVICE_TYPE_SELECTOR === "true",
    description: "Enables service type selector.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ROOM_CONFIGURATOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ROOM_CONFIGURATOR === "true",
    description: "Enables room configurator.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_MULTI_STEP_CUSTOMIZATION_WIZARD",
    enabled: process.env.NEXT_PUBLIC_FEATURE_MULTI_STEP_CUSTOMIZATION_WIZARD === "true",
    description: "Enables multi-step customization wizard.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DYNAMIC_FORM_GENERATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DYNAMIC_FORM_GENERATION === "true",
    description: "Enables dynamic form generation.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CONDITIONAL_FIELDS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CONDITIONAL_FIELDS === "true",
    description: "Enables conditional form fields.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_FORM_VALIDATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_FORM_VALIDATION === "true",
    description: "Enables form validation.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_MASKED_INPUTS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_MASKED_INPUTS === "true",
    description: "Enables masked inputs.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ERROR_BOUNDARY",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ERROR_BOUNDARY === "true",
    description: "Enables error boundary component.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_COOKIE_CONSENT_MANAGER",
    enabled: process.env.NEXT_PUBLIC_FEATURE_COOKIE_CONSENT_MANAGER === "true",
    description: "Enables cookie consent manager.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_GDPR_COMPLIANCE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_GDPR_COMPLIANCE === "true",
    description: "Enables GDPR compliance features.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_TOS_GENERATOR",
    enabled: process.env.NEXT_PUBLIC_FEATURE_TOS_GENERATOR === "true",
    description: "Enables Terms of Service generator.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CSRF_PROTECTION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CSRF_PROTECTION === "true",
    description: "Enables CSRF protection.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_RATE_LIMITING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_RATE_LIMITING === "true",
    description: "Enables rate limiting.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_HONEYPOT_TRAPS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_HONEYPOT_TRAPS === "true",
    description: "Enables honeypot traps for spam.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ANALYTICS_DASHBOARD",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_DASHBOARD === "true",
    description: "Enables analytics dashboard.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_USER_BEHAVIOR_TRACKING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_USER_BEHAVIOR_TRACKING === "true",
    description: "Enables user behavior tracking.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CONVERSION_FUNNEL_TRACKING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CONVERSION_FUNNEL_TRACKING === "true",
    description: "Enables conversion funnel tracking.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_A_B_TESTING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_A_B_TESTING === "true",
    description: "Enables A/B testing.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_HEATMAPS_AND_SESSION_REPLAY",
    enabled: process.env.NEXT_PUBLIC_FEATURE_HEATMAPS_AND_SESSION_REPLAY === "true",
    description: "Enables heatmaps and session replay.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_REALTIME_ANALYTICS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_REALTIME_ANALYTICS === "true",
    description: "Enables real-time analytics.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_CUSTOM_EVENTS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_EVENTS === "true",
    description: "Enables custom event tracking.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_USER_SEGMENTATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_USER_SEGMENTATION === "true",
    description: "Enables user segmentation.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_PREDICTIVE_ANALYTICS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_PREDICTIVE_ANALYTICS === "true",
    description: "Enables predictive analytics.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_AI_DRIVEN_INSIGHTS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_AI_DRIVEN_INSIGHTS === "true",
    description: "Enables AI-driven insights.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DATA_EXPORT",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DATA_EXPORT === "true",
    description: "Enables data export.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_REPORT_GENERATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_REPORT_GENERATION === "true",
    description: "Enables report generation.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_DASHBOARD_CUSTOMIZATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD_CUSTOMIZATION === "true",
    description: "Enables dashboard customization.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_ALERT_NOTIFICATIONS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_ALERT_NOTIFICATIONS === "true",
    description: "Enables alert notifications.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CRM",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CRM === "true",
    description: "Enables CRM integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_MARKETING_AUTOMATION",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_MARKETING_AUTOMATION === "true",
    description: "Enables marketing automation integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_HELP_DESK",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_HELP_DESK === "true",
    description: "Enables help desk integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_PAYMENT_GATEWAYS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_PAYMENT_GATEWAYS === "true",
    description: "Enables payment gateway integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_ACCOUNTING_SOFTWARE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_ACCOUNTING_SOFTWARE === "true",
    description: "Enables accounting software integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SCHEDULING_TOOLS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SCHEDULING_TOOLS === "true",
    description: "Enables scheduling tools integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_COMMUNICATION_PLATFORMS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_COMMUNICATION_PLATFORMS === "true",
    description: "Enables communication platforms integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SOCIAL_MEDIA",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SOCIAL_MEDIA === "true",
    description: "Enables social media integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CLOUD_STORAGE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CLOUD_STORAGE === "true",
    description: "Enables cloud storage integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_EMAIL_MARKETING",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_EMAIL_MARKETING === "true",
    description: "Enables email marketing integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SMS_GATEWAYS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_SMS_GATEWAYS === "true",
    description: "Enables SMS gateway integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_VOICE_APIS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_VOICE_APIS === "true",
    description: "Enables voice APIs integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_MAP_APIS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_MAP_APIS === "true",
    description: "Enables map APIs integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_WEATHER_APIS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_WEATHER_APIS === "true",
    description: "Enables weather APIs integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CALENDAR_APIS",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_CALENDAR_APIS === "true",
    description: "Enables calendar APIs integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_HR_SOFTWARE",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_HR_SOFTWARE === "true",
    description: "Enables HR software integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_INVENTORY_MANAGEMENT",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_INVENTORY_MANAGEMENT === "true",
    description: "Enables inventory management integration.",
  },
  {
    key: "NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_PROJECT_MANAGEMENT",
    enabled: process.env.NEXT_PUBLIC_FEATURE_INTEGRATION_WITH_PROJECT_MANAGEMENT === "true",
    description: "Enables project management integration.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_ANALYTICS",
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    description: "Enables general analytics tracking.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE",
    enabled: process.env.NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE === "true",
    description: "Enables multi-language support.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_VERSION_COMPARISON",
    enabled: process.env.NEXT_PUBLIC_ENABLE_VERSION_COMPARISON === "true",
    description: "Enables version comparison features.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_ADMIN_INTERFACE",
    enabled: process.env.NEXT_PUBLIC_ENABLE_ADMIN_INTERFACE === "true",
    description: "Enables the admin interface.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_ANALYTICS_TRACKING",
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_TRACKING === "true",
    description: "Enables detailed analytics tracking.",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION",
    enabled: process.env.NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION === "true",
    description: "Enables email confirmation for user actions.",
  },
  {
    key: "NEXT_PUBLIC_CHATBOT_ENABLED",
    enabled: process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true",
    description: "Enables the main chatbot functionality.",
  },
  {
    key: "NEXT_PUBLIC_ACCESSIBILITY_TOOLBAR_ENABLED",
    enabled: process.env.NEXT_PUBLIC_ACCESSIBILITY_TOOLBAR_ENABLED === "true",
    description: "Enables the accessibility toolbar.",
  },
  {
    key: "NEXT_PUBLIC_WEBSITE_TOUR_ENABLED",
    enabled: process.env.NEXT_PUBLIC_WEBSITE_TOUR_ENABLED === "true",
    description: "Enables the website tour feature.",
  },
  {
    key: "NEXT_PUBLIC_ABANDONMENT_RESCUE_ENABLED",
    enabled: process.env.NEXT_PUBLIC_ABANDONMENT_RESCUE_ENABLED === "true",
    description: "Enables cart abandonment rescue features.",
  },
]

export function useFeatureFlag(key: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const flag = defaultFeatureFlags.find((f) => f.key === key)
    if (flag) {
      setIsEnabled(flag.enabled)
    } else {
      console.warn(`Feature flag "${key}" not found. Defaulting to disabled.`)
      setIsEnabled(false)
    }
  }, [key])

  return isEnabled
}

export function useFeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(defaultFeatureFlags)

  const isFeatureEnabled = (key: string): boolean => {
    return featureFlags.find((flag) => flag.key === key)?.enabled || false
  }

  const setFeatureFlag = (key: string, enabled: boolean) => {
    setFeatureFlags((prevFlags) => prevFlags.map((flag) => (flag.key === key ? { ...flag, enabled } : flag)))
  }

  return { featureFlags, isFeatureEnabled, setFeatureFlag }
}
