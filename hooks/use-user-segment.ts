"use client"

import { useState, useEffect } from "react"

type UserSegment = "new" | "returning" | "unknown"

const USER_SEGMENT_KEY = "user_segment"
const FIRST_VISIT_KEY = "first_visit_timestamp"

export function useUserSegment(): UserSegment {
  const [segment, setSegment] = useState<UserSegment>("unknown")

  useEffect(() => {
    if (typeof window === "undefined") {
      // Server-side rendering, segment is unknown until client-side hydration
      return
    }

    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)

    if (!firstVisit) {
      // First visit, set timestamp and mark as new
      localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString())
      localStorage.setItem(USER_SEGMENT_KEY, "new")
      setSegment("new")
      console.log("User segment: New User")
    } else {
      // Returning user
      localStorage.setItem(USER_SEGMENT_KEY, "returning")
      setSegment("returning")
      console.log("User segment: Returning User")
    }
  }, [])

  return segment
}
