import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { messages, userPreferences } = await req.json()

    // Create system message based on user preferences
    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful AI assistant for SmileyBrooms cleaning service. 

User Preferences and Accessibility Settings:
- Theme: ${userPreferences?.theme || "system"}
- High Contrast: ${userPreferences?.highContrast ? "enabled" : "disabled"}
- Large Text: ${userPreferences?.largeText ? "enabled" : "disabled"}
- Reduced Motion: ${userPreferences?.reducedMotion ? "enabled" : "disabled"}
- Screen Reader: ${userPreferences?.screenReader ? "enabled" : "disabled"}
- Keyboard Navigation: ${userPreferences?.keyboardOnly ? "enabled" : "disabled"}
- Voice Control: ${userPreferences?.voiceControl ? "enabled" : "disabled"}

Please tailor your responses to be accessible and considerate of these preferences. For example:
- If screen reader is enabled, provide clear, structured responses
- If reduced motion is enabled, avoid suggesting animated interactions
- If keyboard navigation is enabled, mention keyboard shortcuts when relevant
- Be mindful of the user's accessibility needs in your recommendations

About SmileyBrooms:
- Professional cleaning service
- Offers residential and commercial cleaning
- Provides customizable cleaning packages
- Focus on eco-friendly cleaning solutions
- Available for one-time or recurring services

Always be helpful, friendly, and professional. If asked about services not related to cleaning, politely redirect to cleaning-related topics.`,
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      messages: [systemMessage, ...messages],
      maxTokens: 500,
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
