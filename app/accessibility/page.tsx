"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EnhancedAccessibilityPanel } from "@/components/enhanced-accessibility-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Share2, Settings } from "lucide-react" // Importing Lucide icons
import { useAccessibility } from "@/hooks/use-accessibility" // Import useAccessibility hook
import { useToast } from "@/components/ui/use-toast" // Import useToast hook

export default function AccessibilityPage() {
  const { togglePanel } = useAccessibility() // Use the togglePanel function
  const { toast } = useToast() // Use the toast function

  const handleLaunchChatbot = () => {
    toast({
      title: "Chatbot Available",
      description: "The AI-Powered Chatbot panel is located on the right side of your screen.",
      duration: 3000,
    })
  }

  const handleOpenSharePanel = () => {
    toast({
      title: "Share Panel Available",
      description: "The Share panel is located on the right side of your screen.",
      duration: 3000,
    })
  }

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
                Customize your browsing experience with various display and interaction options.
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
                    <li>High contrast mode for better visibility.</li>
                    <li>Adjustable text size for improved readability.</li>
                    <li>Reduced motion settings for sensitive users.</li>
                    <li>Keyboard navigation enhancements and shortcuts.</li>
                    <li>Screen reader optimizations for assistive technologies.</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full bg-transparent" onClick={togglePanel}>
                Explore Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI-Powered Chatbot Assistance</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our intelligent chatbot can help you navigate the site and find information using natural language.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Chatbot:** Look for the chat icon (a speech bubble) typically located at the
                  bottom-right of your screen.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>Ask questions about services, pricing, or policies.</li>
                    <li>Request navigation to specific pages (e.g., "Take me to the pricing page").</li>
                    <li>Get information summarized or rephrased for clarity.</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleLaunchChatbot}>
                Launch Chatbot
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Share2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Share Content with Accessibility Options</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Share pages with friends or family, optionally adjusting content for their accessibility needs.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **Accessing the Share Panel:** Click the share icon (usually a paper plane or arrow) found on relevant
                  pages.
                </li>
                <li>
                  **How it Helps:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>Share links to pages via various platforms.</li>
                    <li>
                      Optionally share content with specific display settings (e.g., larger text version) if supported
                      by the shared content.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full bg-transparent" onClick={handleOpenSharePanel}>
                Open Share Panel
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* The accessibility panel is available throughout the site */}
        <EnhancedAccessibilityPanel />
      </div>
    </AccessibilityProvider>
  )
}
