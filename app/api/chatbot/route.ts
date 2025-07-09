import { streamText } from "ai" // [^1]
import { openai } from "@ai-sdk/openai" // [^1]

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"), // [^1]
    messages,
  })

  return result.to
}
