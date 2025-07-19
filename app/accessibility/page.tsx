"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Share2, Settings } from "lucide-react" // Importing Lucide icons

export default function AccessibilityPage() {
  return (
    <AccessibilityProvider>
      <div className="container py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Making Our Website Accessible for Everyone</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          We are dedicated to providing an inclusive online experience. Discover how our built-in tools can help you
          customize your browsing for better comfort and ease of use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Accessibility Settings Panel</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our dedicated accessibility panel offers various options to adjust how you view and interact with our
                site.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **How to Open:** Look for the accessibility icon (often a person icon) usually found at the
                  bottom-right of your screen. You can also press{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded text-sm">Alt + A</code> on your keyboard.
                </li>
                <li>
                  **Key Features:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **High Contrast Mode:** Boosts color contrast for easier reading, especially helpful for users
                      with visual impairments or color blindness.
                    </li>
                    <li>
                      **Adjust Text Size:** Change the size of the text to suit your reading preference, making content
                      more comfortable to read.
                    </li>
                    <li>
                      **Reduce Motion:** Minimizes or removes animations and transitions, creating a calmer experience
                      for those sensitive to movement.
                    </li>
                    <li>
                      **Keyboard Navigation:** Enhances site navigation using only your keyboard, with clear focus
                      indicators and logical tab order.
                    </li>
                    <li>
                      **Screen Reader Optimization:** Improves compatibility with screen readers and other assistive
                      technologies by providing proper semantic structure.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                These settings are available site-wide through a floating icon or a menu option.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI-Powered Chatbot Support</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our smart chatbot provides instant help and guides you through the website using simple, natural
                language.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  **How to Access:** Find the chat icon (a speech bubble) typically located at the bottom-right of your
                  screen.
                </li>
                <li>
                  **How it Helps You:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>
                      **Get Answers:** Ask questions about our services, prices, or policies, and receive quick, clear
                      responses.
                    </li>
                    <li>
                      **Navigate Easily:** Tell the chatbot where you want to go (e.g., "Take me to the pricing page"),
                      and it will guide you.
                    </li>
                    <li>
                      **Understand Content:** If something is unclear, the chatbot can rephrase or summarize complex
                      information for better understanding.
                    </li>
                    <li>
                      **Troubleshoot:** Get immediate assistance with common issues or frequently asked questions
                      without manual searching.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                Engage with the chatbot via its icon for interactive support whenever you need it.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Share2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Share Content with Ease</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardDescription className="mb-4">
                Our sharing feature lets you easily send web pages to others, with built-in considerations for
                accessibility.
              </CardDescription>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>**How to Share:** Click the share icon (often a paper plane or arrow) found on relevant pages.</li>
                <li>
                  **What You Can Do:**
                  <ul className="list-circle pl-4 mt-1 space-y-1">
                    <li>**Copy Link:** Quickly copy the page URL to share via email, messages, or social media.</li>
                    <li>
                      **Use Device Sharing:** Integrate with your device's native sharing options to send content to
                      various installed applications.
                    </li>
                    <li>
                      **Accessibility for Recipients:** When you share, the recipient's own device or browser
                      accessibility settings will apply, ensuring they can view the content in their preferred way.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <p className="text-sm text-muted-foreground">
                The share panel is available on relevant pages, making it simple to distribute content.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AccessibilityProvider>
  )
}
