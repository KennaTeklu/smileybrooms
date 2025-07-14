import { NextResponse } from "next/server"

// In production you’d call a real geo-IP service here.
// For now we return a stable mock so the client never crashes.
export async function GET() {
  return NextResponse.json({
    country: "US",
    region: "CA",
    requiresExplicitConsent: false,
    hasRightToForget: false,
  })
}
