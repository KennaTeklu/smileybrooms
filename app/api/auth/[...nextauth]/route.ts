import { NextResponse } from "next/server"

// Simple mock authentication endpoint that returns JSON instead of throwing errors
export async function GET() {
  return NextResponse.json({
    user: null,
    message: "Auth API disabled",
  })
}

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Auth API disabled",
  })
}
