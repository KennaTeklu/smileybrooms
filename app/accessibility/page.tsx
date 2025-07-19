"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EnhancedAccessibilityPanel } from "@/components/enhanced-accessibility-panel"
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
                Our Enhanced Accessibility Panel provides a comprehensive suite of tools to customize your browsing
                experience. This panel is designed to adapt the website's interface to your specific needs, ensuring a
                comfortable and efficient interaction.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Panel:** You can easily open the panel by clicking the accessibility icon (a person
                  icon) usually found at the bottom-right of your screen, or by pressing{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded text-sm">Alt + A</code> on your keyboard.
                </li>
                <li>
                  **Features within the Panel:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **High Contrast Mode:** Toggles a high contrast theme for improved text and background visibility,
                      reducing eye strain.
                    </li>
                    <li>
                      **Adjustable Text Size:** Allows you to increase or decrease the font size across the entire
                      website for better readability.
                    </li>
                    <li>
                      **Reduced Motion Settings:** Minimizes animations and transitions for users sensitive to motion,
                      providing a calmer browsing experience.
                    </li>
                    <li>
                      **Keyboard Navigation Enhancements:** Optimizes the site for keyboard-only navigation, making it
                      easier to tab through elements and interact without a mouse.
                    </li>
                    <li>
                      **Focus Indicators:** Highlights interactive elements when they are in focus, aiding keyboard
                      users in understanding their current position.
                    </li>
                    <li>
                      **Dyslexia-Friendly Font:** Applies a specialized font designed to improve readability for
                      individuals with dyslexia.
                    </li>
                    <li>**Cursor Size Adjustment:** Increases the size of the mouse cursor for better visibility.</li>
                    <li>
                      **Sound Effects Toggle:** Enables or disables interface sounds for actions like clicks or
                      notifications.
                    </li>
                  </ul>
                </li>
                <li>
                  **Persistent Settings:** Your chosen accessibility settings are saved and will persist across your
                  browsing sessions, so you don't need to reconfigure them each time you visit.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">{/* Removed Button: Explore Settings */}</CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI-Powered Chatbot Assistance</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our intelligent chatbot is available to provide instant support and guidance, making your site
                navigation seamless and efficient. It leverages artificial intelligence to understand your queries and
                respond in a natural, conversational manner.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Chatbot:** The chatbot can be activated by clicking the chat icon (a speech bubble)
                  typically located at the bottom-right of your screen. It's designed to be readily available whenever
                  you need assistance.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **Information Retrieval:** Ask questions about our services, pricing structures, company policies,
                      or any other content on the website.
                    </li>
                    <li>
                      **Navigation Assistance:** Request direct navigation to specific pages (e.g., "Take me to the
                      pricing page," "Show me career opportunities").
                    </li>
                    <li>
                      **Content Summarization:** Get complex information summarized or rephrased for clarity and easier
                      understanding.
                    </li>
                    <li>
                      **Troubleshooting:** Receive guided steps for common issues or questions you might encounter while
                      using the site.
                    </li>
                    <li>
                      **Personalized Recommendations:** Based on your interactions, the chatbot can offer relevant
                      suggestions or direct you to helpful resources.
                    </li>
                  </ul>
                </li>
                <li>
                  **24/7 Availability:** The chatbot is available around the clock, providing support even outside of
                  business hours.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">{/* Removed Button: Launch Chatbot */}</CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Share2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Share Content with Accessibility Options</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our sharing features allow you to easily disseminate content from our website, with considerations for
                accessibility. This ensures that the information you share can be comfortably consumed by others,
                regardless of their accessibility needs.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Share Panel:** You can find the share icon (usually a paper plane or an arrow) on
                  relevant pages or content sections. Clicking this icon will open the share options.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **Direct Sharing:** Share links to pages directly via various integrated platforms like email,
                      social media, or messaging apps.
                    </li>
                    <li>
                      **Clipboard Copy:** Easily copy the page URL to your clipboard for manual pasting into any
                      application or document.
                    </li>
                    <li>
                      **Accessibility-Aware Sharing:** In some cases, the shared content may retain or offer options for
                      specific display settings (e.g., a version with larger text or higher contrast) if supported by
                      the receiving platform or the content itself, ensuring the recipient can view it optimally.
                    </li>
                    <li>
                      **Enhanced Reach:** By providing accessible sharing options, we aim to make our content available
                      to a wider audience, promoting inclusivity.
                    </li>
                  </ul>
                </li>
                <li>
                  **Browser Integration:** Our share functionality often integrates with your browser's native sharing
                  capabilities, providing a familiar and efficient experience.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">{/* Removed Button: Open Share Panel */}</CardFooter>
          </Card>
        </div>

        {/* The accessibility panel is available throughout the site */}
        <EnhancedAccessibilityPanel />
      </div>
    </AccessibilityProvider>
  )
}
