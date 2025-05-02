import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccessibilityDemoPage() {
  return (
    <div className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold text-center">Accessibility Features Demo</h1>
      <p className="text-xl text-center max-w-2xl mx-auto">
        This page demonstrates our accessibility features. Use the toolbar in the bottom right corner to customize your
        experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Text Customization</CardTitle>
            <CardDescription>Adjust text size, spacing, and font</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You can adjust the font size, line height, letter spacing, and font family to make text easier to read.
            </p>
            <p>Try increasing the font size or switching to the OpenDyslexic font if you have reading difficulties.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Adjustments</CardTitle>
            <CardDescription>Change colors, contrast, and motion</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              High contrast mode makes text stand out more against backgrounds. Color filters help with color blindness.
            </p>
            <p>Reduced motion minimizes animations that can cause discomfort or distraction.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reading Aids</CardTitle>
            <CardDescription>Tools to help with reading content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The reading guide helps you keep your place while reading long passages of text.</p>
            <p>The screen reader can read page content aloud, with adjustable speed and pitch.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Aids</CardTitle>
            <CardDescription>Easier navigation and interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Keyboard navigation mode optimizes the site for keyboard-only users, with enhanced focus indicators.
            </p>
            <p>Larger cursor options make it easier to see and control your pointer.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Example</CardTitle>
            <CardDescription>Test image descriptions</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img
              src="/professional-cleaning-team.png"
              alt="A professional cleaning service team at work"
              className="rounded-md"
              width={300}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>Quick access to features</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">Alt + R</kbd> Toggle screen reader
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">Alt + +</kbd> Increase font size
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">Alt + -</kbd> Decrease font size
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">Alt + C</kbd> Toggle high contrast
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">Alt + D</kbd> Toggle dark mode
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Test Reading Content</h2>
        <p className="mb-4">
          This is a longer passage of text that you can use to test the reading guide and screen reader features. The
          reading guide helps you keep track of your place in the text, which can be especially helpful for users with
          dyslexia or visual tracking difficulties.
        </p>
        <p className="mb-4">
          The screen reader can read this text aloud. You can adjust the reading speed and voice pitch to suit your
          preferences. If you enable captions, you'll see the words being read displayed at the bottom of the screen.
        </p>
        <p>
          Try different combinations of settings to find what works best for you. Your preferences will be saved for
          future visits to this site.
        </p>
      </div>
    </div>
  )
}
