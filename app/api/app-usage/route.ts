import { type NextRequest, NextResponse } from "next/server"
import { trackEvent } from "@/lib/analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, action, userId } = body

    if (!platform || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Track app usage event
    trackEvent("app_usage", {
      platform,
      action,
      userId: userId || "anonymous",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking app usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
