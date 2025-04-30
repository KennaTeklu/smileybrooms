"\"use client"

// Google Apps Script URL - replace with your actual deployed script URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"

// Track events
export async function trackEvent(eventName: string, eventData: Record<string, any>) {
  try {
    const data = {
      requestType: "event",
      eventName: eventName,
      ...eventData,
    }

    // Only send in production or if explicitly enabled
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") {
      // Use a non-blocking approach to avoid affecting UX
      navigator.sendBeacon(GOOGLE_APPS_SCRIPT_URL, JSON.stringify(data))
    } else {
      console.log("Analytics (Dev Mode):", data)
    }
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}
