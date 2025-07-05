"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react" // Import Suspense
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EnhancedAccessibilityPanel } from "@/components/enhanced-accessibility-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// A simple loading component to show as a fallback
function AccessibilityPanelLoading() {
  return (
    <div className="flex items-center justify-center p-4 text-muted-foreground">Loading accessibility panel...</div>
  )
}

// Lazy-load the client bundle (disabled during SSR)
const AccessibilityPageClient = dynamic(() => import("./page.client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 text-muted-foreground">Loading accessibility page…</div>
  ),
})

export default function AccessibilityPage() {
  return (
    /* `Suspense` here is just for the dynamic fallback */
    <Suspense fallback={null}>
      <AccessibilityProvider>
        {/* Wrap the entire page content in Suspense */}
        <Suspense fallback={<AccessibilityPanelLoading />}>
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-2">Accessibility Features</h1>
            <p className="text-muted-foreground mb-8">
              Explore our enhanced accessibility features designed to make smileybrooms accessible to everyone.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize how content appears</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>High contrast mode</li>
                    <li>Large text option</li>
                    <li>Reduced motion settings</li>
                    <li>Screen reader optimizations</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Open Display Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voice Control</CardTitle>
                  <CardDescription>Navigate using voice commands</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Open cart with voice</li>
                    <li>Add items to cart</li>
                    <li>Proceed to checkout</li>
                    <li>Navigate between pages</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Try Voice Commands
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Navigation</CardTitle>
                  <CardDescription>Use keyboard shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Alt+C to open cart</li>
                    <li>Alt+A for accessibility panel</li>
                    <li>Alt+H to go to homepage</li>
                    <li>Improved focus indicators</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Shortcuts
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Our Commitment to Accessibility</h2>
              <p className="mb-4">
                At smileybrooms, we believe that everyone should be able to access and use our services, regardless of
                ability or circumstance. We are committed to meeting WCAG 2.2 AA standards and continuously improving
                our accessibility features.
              </p>
              <p>
                If you encounter any accessibility barriers or have suggestions for improvement, please contact us at{" "}
                <a href="mailto:accessibility@smileybrooms.com" className="underline">
                  accessibility@smileybrooms.com
                </a>
              </p>
            </div>

            {/* The accessibility panel is available throughout the site */}
            <EnhancedAccessibilityPanel />
          </div>
        </Suspense>
      </AccessibilityProvider>
    </Suspense>
  )
}
