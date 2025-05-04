import { NextResponse } from "next/server"
import { processFormSubmission } from "@/lib/form-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, question, page } = body

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // Google Sheets integration
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

    // Process the form submission with enhanced metadata
    await processFormSubmission(
      scriptURL,
      "question",
      {
        name: name || "Anonymous User",
        email: email || "not provided",
        message: `❓ Question: ${question.substring(0, 50)}${question.length > 50 ? "..." : ""}`,
        fullMessage: question,
        source: "Question Box Widget",
      },
      {
        submitDate: new Date().toISOString(),
        page: page || "unknown",
      },
      {
        priority: "high",
        responseNeeded: true,
        questionLength: question.length,
      },
    )

    // In a real implementation, you would send an email notification here
    // using a service like SendGrid, Mailgun, or AWS SES

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing question:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
