import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await generateText({
      model: openai("gpt-4o"), // Using the specified model
      messages,
      maxTokens: 500, // Limit response length
    })

    return new Response(result.text, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
