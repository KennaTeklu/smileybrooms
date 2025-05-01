import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import ClientLayout from "./client-layout"
import PageViewTracker from "@/components/page-view-tracker"
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider"
import AccessibilitySettings from "@/components/accessibility/accessibility-settings"

export const metadata = {
  title: "Smiley Brooms Cleaning Service",
  description: "Professional cleaning services for homes and businesses",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <AccessibilityProvider>
              <ClientLayout>
                <PageViewTracker />
                {children}
                <Toaster />
                <AccessibilitySettings position="bottom-right" />
              </ClientLayout>
            </AccessibilityProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
