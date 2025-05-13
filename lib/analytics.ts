"use client"

import { track } from "@vercel/analytics"

/**
 * Track page views with proper error handling
 */
export function trackPageView(url: string, title: string) {
  try {
    track("page_view", {
      page_url: url,
      page_title: title,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}

/**
 * Track custom events with proper error handling
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error)
  }
}

/**
 * Track errors for monitoring
 */
export function trackError(errorType: string, errorMessage: string, errorStack?: string) {
  try {
    track("error", {
      error_type: errorType,
      error_message: errorMessage,
      error_stack: errorStack,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error tracking error event:", error)
  }
}
