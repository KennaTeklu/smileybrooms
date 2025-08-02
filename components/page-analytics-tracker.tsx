"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { logToGoogleSheet } from "@/lib/google-sheet-logger"

interface AnalyticsData {
  // Page Information
  page_url: string
  page_title: string
  page_path: string
  page_referrer: string
  page_query_params: string
  page_hash: string
  page_type: string

  // Location Data
  country?: string
  state?: string
  city?: string
  latitude?: number
  longitude?: number
  accuracy?: number
  altitude?: number
  speed?: number
  heading?: number
  timezone: string
  ip_address?: string
  isp?: string

  // Device & Browser
  device_type: string
  device_model?: string
  screen_width: number
  screen_height: number
  viewport_width: number
  viewport_height: number
  pixel_ratio: number
  color_depth: number
  orientation: string
  browser_name: string
  browser_version: string
  browser_engine: string
  os_name: string
  os_version: string
  user_agent: string
  language: string
  languages: string
  platform: string
  hardware_concurrency: number
  device_memory?: number

  // Network & Performance
  connection_type?: string
  connection_speed?: string
  connection_rtt?: number
  connection_downlink?: number
  connection_save_data?: boolean
  page_load_time?: number
  dom_ready_time?: number
  first_paint?: number
  first_contentful_paint?: number
  largest_contentful_paint?: number

  // User Behavior
  time_on_page: number
  scroll_depth: number
  max_scroll_depth: number
  scroll_events: number
  click_events: number
  keyboard_events: number
  mouse_move_events: number
  focus_events: number
  visibility_changes: number
  page_views_session: number
  total_page_views: number

  // Session Data
  session_id: string
  visitor_id: string
  is_new_visitor: boolean
  is_returning_visitor: boolean
  session_start_time: string
  session_duration: number
  pages_per_session: number

  // Marketing Attribution
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  referrer_domain?: string
  referrer_path?: string

  // Technical Capabilities
  cookies_enabled: boolean
  local_storage_enabled: boolean
  session_storage_enabled: boolean
  webgl_enabled: boolean
  webrtc_enabled: boolean
  service_worker_enabled: boolean
  push_notifications_enabled: boolean
  geolocation_enabled: boolean
  camera_enabled?: boolean
  microphone_enabled?: boolean

  // Accessibility & Preferences
  prefers_reduced_motion: boolean
  prefers_high_contrast: boolean
  prefers_color_scheme: string
  font_size: string

  // Timestamps
  timestamp: string
  local_time: string
  utc_time: string

  // Engagement Metrics
  engaged_time: number
  bounce_rate_indicator: boolean
  exit_intent: boolean

  // Custom Events
  button_clicks: number
  link_clicks: number
  form_interactions: number
  video_plays: number
  download_clicks: number
}

interface ClickData {
  // Event Information
  event_type: "click"
  event_timestamp: string
  event_id: string

  // Page Context
  page_url: string
  page_title: string
  page_path: string
  page_type: string
  page_referrer: string
  page_query_params: string

  // Click Details
  click_element: string
  click_element_id: string
  click_element_class: string
  click_element_text: string
  click_element_href?: string
  click_element_type?: string
  click_coordinates_x: number
  click_coordinates_y: number
  click_viewport_x: number
  click_viewport_y: number
  click_scroll_x: number
  click_scroll_y: number

  // Element Context
  element_parent: string
  element_siblings_count: number
  element_depth: number
  element_xpath: string
  element_css_selector: string

  // User Behavior Context
  time_on_page: number
  scroll_depth_at_click: number
  clicks_before_this: number
  time_since_last_click: number
  user_is_engaged: boolean

  // Session Context
  session_id: string
  visitor_id: string
  page_view_id: string
  click_sequence_number: number
  session_duration: number
  pages_in_session: number

  // Device & Browser
  device_type: string
  browser_name: string
  browser_version: string
  screen_width: number
  screen_height: number
  viewport_width: number
  viewport_height: number

  // Location (if available)
  user_country?: string
  user_state?: string
  user_city?: string
  user_timezone: string

  // Marketing Attribution
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referrer_domain?: string

  // Technical Details
  connection_type?: string
  user_agent: string
  language: string

  // Engagement Metrics
  engagement_score: number
  bounce_probability: number
  conversion_likelihood: number
}

interface SessionSummary {
  event_type: "session_summary"
  session_id: string
  visitor_id: string
  session_start: string
  session_end: string
  session_duration: number
  pages_visited: number
  total_clicks: number
  total_scroll_events: number
  max_scroll_depth: number
  engagement_score: number
  exit_page: string
  entry_page: string
  conversion_events: number
  device_type: string
  user_timezone: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export default function PageAnalyticsTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Session and tracking refs
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const visitorId = useRef(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("visitor_id")
      if (!id) {
        id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("visitor_id", id)
      }
      return id
    }
    return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })
  const pageViewId = useRef(`page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Tracking state
  const startTime = useRef(Date.now())
  const sessionStartTime = useRef(Date.now())
  const lastClickTime = useRef(0)
  const clickSequenceNumber = useRef(0)
  const totalClicks = useRef(0)
  const scrollDepth = useRef(0)
  const maxScrollDepth = useRef(0)
  const scrollEvents = useRef(0)
  const pagesVisited = useRef(new Set([pathname]))
  const conversionEvents = useRef(0)
  const initialized = useRef(false)

  // Device and browser info (cached)
  const deviceInfo = useRef<any>(null)
  const locationInfo = useRef<any>(null)

  // Rate limiting for Google Sheets
  const lastSheetUpdate = useRef(0)
  const pendingClicks = useRef<ClickData[]>([])
  const SHEET_UPDATE_INTERVAL = 2000 // Minimum 2 seconds between updates
  const MAX_BATCH_SIZE = 5 // Maximum clicks to send in one batch

  // Initialize device and location info once
  const initializeDeviceInfo = useCallback(async () => {
    if (typeof window === "undefined" || deviceInfo.current) return

    const ua = navigator.userAgent
    const screen = window.screen
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    // Device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
    const deviceType = isMobile ? (isTablet ? "tablet" : "mobile") : "desktop"

    // Browser detection
    let browserName = "Unknown"
    let browserVersion = "Unknown"

    if (ua.includes("Chrome") && !ua.includes("Edge")) {
      browserName = "Chrome"
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Firefox")) {
      browserName = "Firefox"
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browserName = "Safari"
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Edge")) {
      browserName = "Edge"
      browserVersion = ua.match(/Edge\/([0-9.]+)/)?.[1] || "Unknown"
    }

    deviceInfo.current = {
      device_type: deviceType,
      browser_name: browserName,
      browser_version: browserVersion,
      screen_width: screen.width,
      screen_height: screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      connection_type: connection?.effectiveType,
      user_agent: ua,
      language: navigator.language,
    }

    // Get location info (cached for session)
    try {
      const response = await fetch("https://ipapi.co/json/")
      const ipData = await response.json()
      locationInfo.current = {
        user_country: ipData.country_name,
        user_state: ipData.region,
        user_city: ipData.city,
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    } catch (error) {
      locationInfo.current = {
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    }
  }, [])

  // Calculate scroll depth
  const updateScrollDepth = useCallback(() => {
    if (typeof window === "undefined") return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentDepth = documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0

    scrollDepth.current = currentDepth
    maxScrollDepth.current = Math.max(maxScrollDepth.current, currentDepth)
  }, [])

  // Generate XPath for element
  const getElementXPath = useCallback((element: Element): string => {
    if (element.id) {
      return `//*[@id="${element.id}"]`
    }

    const parts: string[] = []
    let current: Element | null = element

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 1
      let sibling = current.previousElementSibling

      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++
        }
        sibling = sibling.previousElementSibling
      }

      const tagName = current.tagName.toLowerCase()
      parts.unshift(`${tagName}[${index}]`)
      current = current.parentElement
    }

    return `/${parts.join("/")}`
  }, [])

  // Generate CSS selector for element
  const getElementSelector = useCallback((element: Element): string => {
    if (element.id) {
      return `#${element.id}`
    }

    const parts: string[] = []
    let current: Element | null = element

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase()

      if (current.className) {
        const classes = current.className.split(/\s+/).filter((c) => c && !c.includes(" "))
        if (classes.length > 0) {
          selector += `.${classes.slice(0, 2).join(".")}`
        }
      }

      parts.unshift(selector)
      current = current.parentElement
    }

    return parts.join(" > ")
  }, [])

  // Calculate engagement metrics
  const calculateEngagementMetrics = useCallback(() => {
    const timeOnPage = Date.now() - startTime.current
    const sessionDuration = Date.now() - sessionStartTime.current

    // Engagement score (0-100)
    let engagementScore = 0
    engagementScore += Math.min((timeOnPage / 1000 / 60) * 10, 30) // Time on page (max 30 points)
    engagementScore += Math.min((maxScrollDepth.current / 100) * 20, 20) // Scroll depth (max 20 points)
    engagementScore += Math.min(totalClicks.current * 5, 25) // Clicks (max 25 points)
    engagementScore += Math.min(pagesVisited.current.size * 5, 25) // Pages visited (max 25 points)

    // Bounce probability (0-100)
    const bounceProbability =
      timeOnPage < 30000 && maxScrollDepth.current < 25 && totalClicks.current === 0
        ? 90
        : timeOnPage < 60000 && maxScrollDepth.current < 50
          ? 60
          : timeOnPage < 120000
            ? 30
            : 10

    // Conversion likelihood (0-100) - based on engagement patterns
    const conversionLikelihood = engagementScore > 70 ? 80 : engagementScore > 50 ? 60 : engagementScore > 30 ? 40 : 20

    return {
      engagement_score: Math.round(engagementScore),
      bounce_probability: bounceProbability,
      conversion_likelihood: conversionLikelihood,
      user_is_engaged: engagementScore > 40,
    }
  }, [])

  // Get marketing attribution
  const getMarketingAttribution = useCallback(() => {
    if (typeof window === "undefined") return {}

    const urlParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer
    const referrerUrl = referrer ? new URL(referrer) : null

    return {
      utm_source: urlParams.get("utm_source") || undefined,
      utm_medium: urlParams.get("utm_medium") || undefined,
      utm_campaign: urlParams.get("utm_campaign") || undefined,
      referrer_domain: referrerUrl?.hostname || undefined,
    }
  }, [])

  // Send clicks to Google Sheets in batches
  const sendClickBatch = useCallback(async () => {
    if (pendingClicks.current.length === 0) return

    const now = Date.now()
    if (now - lastSheetUpdate.current < SHEET_UPDATE_INTERVAL) {
      return // Rate limiting
    }

    const clicksToSend = pendingClicks.current.splice(0, MAX_BATCH_SIZE)
    lastSheetUpdate.current = now

    try {
      // Send batch of clicks
      for (const clickData of clicksToSend) {
        await logToGoogleSheet(clickData)
      }

      console.log(`📊 Sent ${clicksToSend.length} clicks to Google Sheets`)
    } catch (error) {
      console.error("Failed to send clicks to Google Sheets:", error)
      // Put failed clicks back at the beginning of the queue
      pendingClicks.current.unshift(...clicksToSend)
    }
  }, [])

  // Handle click events
  const handleClick = useCallback(
    async (event: MouseEvent) => {
      if (!deviceInfo.current || !locationInfo.current) return

      const target = event.target as HTMLElement
      const now = Date.now()
      const timeOnPage = now - startTime.current
      const timeSinceLastClick = lastClickTime.current ? now - lastClickTime.current : 0

      clickSequenceNumber.current++
      totalClicks.current++
      lastClickTime.current = now

      updateScrollDepth()
      const engagementMetrics = calculateEngagementMetrics()
      const marketingData = getMarketingAttribution()

      // Check if this is a conversion event
      const isConversionClick =
        target.tagName === "BUTTON" &&
        (target.textContent?.toLowerCase().includes("buy") ||
          target.textContent?.toLowerCase().includes("purchase") ||
          target.textContent?.toLowerCase().includes("checkout") ||
          target.textContent?.toLowerCase().includes("book") ||
          target.id?.includes("checkout") ||
          target.className?.includes("checkout"))

      if (isConversionClick) {
        conversionEvents.current++
      }

      // Create comprehensive click data
      const clickData: ClickData = {
        // Event Information
        event_type: "click",
        event_timestamp: new Date().toISOString(),
        event_id: `click_${now}_${Math.random().toString(36).substr(2, 6)}`,

        // Page Context
        page_url: window.location.href,
        page_title: document.title,
        page_path: pathname,
        page_type: pathname === "/" ? "homepage" : pathname.split("/")[1] || "other",
        page_referrer: document.referrer,
        page_query_params: searchParams.toString(),

        // Click Details
        click_element: target.tagName.toLowerCase(),
        click_element_id: target.id || "",
        click_element_class: target.className || "",
        click_element_text: target.textContent?.substring(0, 100) || "",
        click_element_href: (target as HTMLAnchorElement).href || undefined,
        click_element_type: (target as HTMLInputElement).type || undefined,
        click_coordinates_x: event.clientX,
        click_coordinates_y: event.clientY,
        click_viewport_x: event.clientX,
        click_viewport_y: event.clientY,
        click_scroll_x: window.pageXOffset || 0,
        click_scroll_y: window.pageYOffset || 0,

        // Element Context
        element_parent: target.parentElement?.tagName.toLowerCase() || "",
        element_siblings_count: target.parentElement?.children.length || 0,
        element_depth: target.closest("body") ? target.closest("body")!.querySelectorAll("*").length : 0,
        element_xpath: getElementXPath(target),
        element_css_selector: getElementSelector(target),

        // User Behavior Context
        time_on_page: Math.round(timeOnPage / 1000),
        scroll_depth_at_click: scrollDepth.current,
        clicks_before_this: clickSequenceNumber.current - 1,
        time_since_last_click: Math.round(timeSinceLastClick / 1000),
        user_is_engaged: engagementMetrics.user_is_engaged,

        // Session Context
        session_id: sessionId.current,
        visitor_id: visitorId.current(),
        page_view_id: pageViewId.current,
        click_sequence_number: clickSequenceNumber.current,
        session_duration: Math.round((now - sessionStartTime.current) / 1000),
        pages_in_session: pagesVisited.current.size,

        // Device & Browser
        device_type: deviceInfo.current.device_type,
        browser_name: deviceInfo.current.browser_name,
        browser_version: deviceInfo.current.browser_version,
        screen_width: deviceInfo.current.screen_width,
        screen_height: deviceInfo.current.screen_height,
        viewport_width: deviceInfo.current.viewport_width,
        viewport_height: deviceInfo.current.viewport_height,

        // Location
        ...locationInfo.current,

        // Marketing Attribution
        ...marketingData,

        // Technical Details
        connection_type: deviceInfo.current.connection_type,
        user_agent: deviceInfo.current.user_agent,
        language: deviceInfo.current.language,

        // Engagement Metrics
        engagement_score: engagementMetrics.engagement_score,
        bounce_probability: engagementMetrics.bounce_probability,
        conversion_likelihood: engagementMetrics.conversion_likelihood,
      }

      // Add to pending clicks queue
      pendingClicks.current.push(clickData)

      // Send immediately for high-value clicks, otherwise batch
      if (isConversionClick || target.tagName === "BUTTON" || target.tagName === "A") {
        sendClickBatch()
      }

      console.log("🖱️ Click tracked:", {
        element: target.tagName,
        text: target.textContent?.substring(0, 30),
        sequence: clickSequenceNumber.current,
        engagement: engagementMetrics.engagement_score,
      })
    },
    [
      pathname,
      searchParams,
      updateScrollDepth,
      calculateEngagementMetrics,
      getMarketingAttribution,
      getElementXPath,
      getElementSelector,
      sendClickBatch,
    ],
  )

  // Handle scroll events (lightweight tracking)
  const handleScroll = useCallback(() => {
    scrollEvents.current++
    updateScrollDepth()
  }, [updateScrollDepth])

  // Send session summary on page unload
  const sendSessionSummary = useCallback(async () => {
    if (!deviceInfo.current || !locationInfo.current) return

    const marketingData = getMarketingAttribution()
    const engagementMetrics = calculateEngagementMetrics()

    const sessionSummary: SessionSummary = {
      event_type: "session_summary",
      session_id: sessionId.current,
      visitor_id: visitorId.current(),
      session_start: new Date(sessionStartTime.current).toISOString(),
      session_end: new Date().toISOString(),
      session_duration: Math.round((Date.now() - sessionStartTime.current) / 1000),
      pages_visited: pagesVisited.current.size,
      total_clicks: totalClicks.current,
      total_scroll_events: scrollEvents.current,
      max_scroll_depth: maxScrollDepth.current,
      engagement_score: engagementMetrics.engagement_score,
      exit_page: pathname,
      entry_page: Array.from(pagesVisited.current)[0],
      conversion_events: conversionEvents.current,
      device_type: deviceInfo.current.device_type,
      user_timezone: locationInfo.current.user_timezone,
      ...marketingData,
    }

    try {
      await logToGoogleSheet(sessionSummary)
      console.log("📊 Session summary sent to Google Sheets")
    } catch (error) {
      console.error("Failed to send session summary:", error)
    }
  }, [pathname, calculateEngagementMetrics, getMarketingAttribution])

  // Initialize tracking
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    initializeDeviceInfo()

    // Set session start time from localStorage if available
    const storedSessionStart = localStorage.getItem("session_start_time")
    if (storedSessionStart) {
      sessionStartTime.current = Number.parseInt(storedSessionStart)
    } else {
      localStorage.setItem("session_start_time", sessionStartTime.current.toString())
    }

    console.log("📊 Click tracking initialized for:", pathname)
  }, [initializeDeviceInfo, pathname])

  // Set up event listeners
  useEffect(() => {
    if (typeof window === "undefined") return

    // Add click listener
    document.addEventListener("click", handleClick, { passive: true })

    // Add scroll listener (throttled)
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100)
    }
    window.addEventListener("scroll", throttledScroll, { passive: true })

    // Send pending clicks periodically
    const batchInterval = setInterval(sendClickBatch, SHEET_UPDATE_INTERVAL)

    // Send session summary on page unload
    const handleBeforeUnload = () => {
      sendSessionSummary()
      // Send any remaining clicks
      if (pendingClicks.current.length > 0) {
        sendClickBatch()
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", throttledScroll)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      clearTimeout(scrollTimeout)
      clearInterval(batchInterval)
    }
  }, [handleClick, handleScroll, sendClickBatch, sendSessionSummary])

  // Handle route changes
  useEffect(() => {
    if (initialized.current) {
      // Add new page to visited pages
      pagesVisited.current.add(pathname)

      // Reset page-specific counters
      pageViewId.current = `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      startTime.current = Date.now()
      scrollDepth.current = 0
      clickSequenceNumber.current = 0

      console.log("📊 Page changed to:", pathname, `(${pagesVisited.current.size} pages visited)`)
    }
  }, [pathname])

  return <>{children}</>
}
