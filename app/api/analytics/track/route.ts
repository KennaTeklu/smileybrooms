import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { eventName, properties } = data

    // In a real application, you would send this data to a dedicated analytics service
    // (e.g., Segment, Mixpanel, Amplitude, Google Analytics Measurement Protocol, or a data warehouse)
    // For this example, we'll just log it to the console.

    console.log(`[SERVER ANALYTICS] Event: ${eventName}`, properties)

    // You could also store it in a database:
    // await db.analyticsEvents.create({
    //   data: {
    //     eventName,
    //     properties: properties, // Store as JSONB or similar
    //     timestamp: new Date(properties.timestamp),
    //     page: properties.page,
    //     userAgent: properties.userAgent,
    //   },
    // });

    return NextResponse.json({ message: "Analytics event received" }, { status: 200 })
  } catch (error) {
    console.error("Error processing analytics event:", error)
    return NextResponse.json({ error: "Failed to process analytics event" }, { status: 500 })
  }
}
