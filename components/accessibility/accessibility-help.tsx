"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccessibilityHelp() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-50" aria-label="Accessibility Help">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Accessibility Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Accessibility Features Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the accessibility features to customize your experience.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard Shortcuts</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Welcome to Our Accessibility Tools</h3>
            <p>
              We've designed these accessibility features to make our website more inclusive and easier to use for
              everyone. You can customize text size, colors, contrast, and more.
            </p>
            <p>
              To access these features, click the settings icon in the bottom right corner of any page. You can also use
              keyboard shortcuts for quick access to common features.
            </p>
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Getting Started</h4>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Click the <span className="font-medium">Settings icon</span> in the bottom right corner
                </li>
                <li>Explore the different tabs to find settings that work for you</li>
                <li>Use the quick access buttons for common adjustments</li>
                <li>Your settings will be saved for future visits</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Available Features</h3>

            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Text Adjustments</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Font size adjustment</li>
                  <li>Line height control</li>
                  <li>Letter spacing</li>
                  <li>Dyslexia-friendly font</li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Visual Adjustments</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>High contrast mode</li>
                  <li>Dark mode</li>
                  <li>Color filters for color blindness</li>
                  <li>Reduced motion</li>
                  <li>Simplified UI</li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Reading Aids</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Reading guide</li>
                  <li>Screen reader</li>
                  <li>Text captions</li>
                  <li>Enhanced image descriptions</li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Navigation Aids</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keyboard navigation mode</li>
                  <li>Focus indicators</li>
                  <li>Larger cursor options</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
            <p>Use these keyboard shortcuts for quick access to accessibility features:</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Action</th>
                    <th className="p-2 text-left">Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Toggle Screen Reader</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + R</kbd>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Increase Font Size</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + +</kbd>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Decrease Font Size</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + -</kbd>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Toggle High Contrast</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + C</kbd>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Toggle Dark Mode</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + D</kbd>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Toggle Motion Reduction</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + M</kbd>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Toggle Keyboard Navigation</td>
                    <td className="p-2">
                      <kbd className="px-2 py-1 bg-muted rounded">Alt + K</kbd>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Will my settings be saved?</h4>
                <p>
                  Yes, your accessibility settings are saved in your browser's local storage and will be remembered the
                  next time you visit our site on the same device and browser.
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">What is the reading guide?</h4>
                <p>
                  The reading guide is a horizontal bar that follows your cursor to help you keep track of your place
                  while reading. It's especially helpful for users with dyslexia or visual tracking difficulties.
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">How do color filters work?</h4>
                <p>
                  Color filters simulate different types of color blindness to help you see how your content appears to
                  users with these conditions. They can also help users with color blindness by adjusting colors to be
                  more distinguishable.
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Can I use the screen reader with my own screen reader?</h4>
                <p>
                  Yes, our built-in screen reader is designed to complement, not replace, assistive technologies. It
                  works alongside screen readers like NVDA, JAWS, or VoiceOver.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
