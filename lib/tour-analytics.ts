interface AnalyticsEvent {
  event: string
  data?: Record<string, any>
}

class TourAnalytics {
  private events: AnalyticsEvent[] = []

  track(event: string, data: Record<string, any> = {}) {
    const eventData = {
      event,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
      },
    }

    this.events.push(eventData)

    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", event, {
        event_category: "Tour",
        custom_parameter_1: data.step || "",
        custom_parameter_2: data.variant || "",
        ...data,
      })
    }

    // Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", event, data)
    }

    // Console log for development
    if (process.env.NODE_ENV === "development") {
      console.log(`🎯 Tour Analytics: ${event}`, data)
    }

    // Send to your analytics endpoint
    this.sendToEndpoint(eventData)
  }

  private async sendToEndpoint(eventData: AnalyticsEvent) {
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/analytics/tour", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        })
      }
    } catch (error) {
      console.error("Failed to send analytics:", error)
    }
  }

  getEvents() {
    return this.events
  }

  clearEvents() {
    this.events = []
  }
}

export const tourAnalytics = typeof window !== "undefined" ? new TourAnalytics() : null
