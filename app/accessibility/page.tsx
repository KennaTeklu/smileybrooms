"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Share2, Settings } from "lucide-react" // Importing Lucide icons

export default function AccessibilityPage() {
  return (
    <AccessibilityProvider>
      <div className="container py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center">How to Use Our Accessibility Features</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          We are committed to making our website accessible to everyone. Here's how you can utilize our built-in tools
          to enhance your browsing experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Enhanced Accessibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our comprehensive accessibility panel offers a suite of tools to tailor your visual and interactive
                experience on our website.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Panel:** Click the accessibility icon (a person icon) usually found at the
                  bottom-right of your screen, or press{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded text-sm">Alt + A</code> on your keyboard.
                </li>
                <li>
                  **Features within the Panel:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **High Contrast Mode:** This feature significantly increases the contrast between text and
                      background elements, making content easier to read for users with low vision or color blindness.
                    </li>
                    <li>
                      **Adjustable Text Size:** Users can scale the text size up or down to their preferred reading
                      comfort, ensuring readability across different devices and visual needs.
                    </li>
                    <li>
                      **Reduced Motion Settings:** For individuals sensitive to animations, this option minimizes or
                      removes decorative motion and transitions, providing a calmer browsing experience.
                    </li>
                    <li>
                      **Keyboard Navigation Enhancements:** This mode optimizes the website for users who prefer or
                      require keyboard-only navigation, improving focus visibility and tab order.
                    </li>
                    <li>
                      **Screen Reader Optimizations:** Our site is designed to work seamlessly with assistive
                      technologies, providing proper semantic structure and ARIA attributes for screen reader users.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                These settings are typically accessed via a floating icon or a dedicated menu item available throughout
                the site.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI-Powered Chatbot Assistance</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our intelligent AI-powered chatbot is designed to provide instant assistance and guide you through the
                website using natural language interactions.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Chatbot:** Look for the chat icon (a speech bubble) typically located at the
                  bottom-right of your screen.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **Information Retrieval:** Ask specific questions about our services, pricing models, company
                      policies, or any other content on the site, and receive concise answers.
                    </li>
                    <li>
                      **Navigation Guidance:** The chatbot can understand requests like "Show me the careers page" or
                      "Where can I find contact information?" and provide direct links or instructions.
                    </li>
                    <li>
                      **Content Clarification:** If you find any information unclear, the chatbot can rephrase or
                      summarize complex topics to enhance understanding.
                    </li>
                    <li>
                      **Troubleshooting Support:** Get immediate help with common issues or frequently asked questions
                      without needing to search manually.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                The chatbot can be engaged through a chat icon, usually located at the bottom-right of your screen,
                offering interactive support.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Share2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Share Content with Accessibility Options</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our sharing functionality allows you to easily distribute web pages, with considerations for how the
                content might be best viewed by others.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Share Panel:** Click the share icon (usually a paper plane or arrow) found on relevant
                  pages.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **Direct Link Sharing:** Quickly copy the URL of any page to share it via email, messaging apps,
                      or social media platforms.
                    </li>
                    <li>
                      **Platform Integration:** Utilize native sharing capabilities of your device to send content to
                      various applications installed on your system.
                    </li>
                    <li>
                      **Accessibility-Aware Sharing:** While the core content is shared, the recipient's own
                      accessibility settings on their device or browser will apply, ensuring they can view the content
                      in their preferred mode.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                The share panel is accessible via a share icon on relevant pages, allowing you to distribute content
                with various options.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AccessibilityProvider>
  )
}
