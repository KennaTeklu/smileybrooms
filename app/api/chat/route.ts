import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Basic validation for messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required and cannot be empty" }, { status: 400 })
    }

    // Extract the last message from the user to use as the prompt
    const lastUserMessage = messages[messages.length - 1]?.content

    if (!lastUserMessage) {
      return NextResponse.json({ error: "Last message content is empty" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using the gpt-4o model from OpenAI
      prompt: lastUserMessage,
      system:
        "You are a helpful assistant for a cleaning service company called SmileyBrooms. Provide concise and helpful answers related to cleaning services, bookings, pricing, and general inquiries about SmileyBrooms. If asked about topics outside of cleaning services, politely redirect the user to focus on cleaning-related questions.",
    })

    return NextResponse.json({ response: text }, { status: 200 })
  } catch (error) {
    console.error("Error generating chat response:", error)
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 })
  }
}
