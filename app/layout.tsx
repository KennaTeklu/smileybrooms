import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { PanelControlProvider } from "@/contexts/panel-control-context" // Import PanelControlProvider
import { CollapseAllButton } from "@/components/collapse-all-button" // Import CollapseAllButton

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smiley Brooms",
  description: "Professional cleaning services with a smile.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PanelControlProvider>
          {" "}
          {/* Wrap with PanelControlProvider */}
          <QueryClientProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AccessibilityProvider>
                <CartProvider>{children}</CartProvider>
              </AccessibilityProvider>
              <Toaster />
            </ThemeProvider>
          </QueryClientProviderWrapper>
          <CollapseAllButton /> {/* Add the collapse all button */}
        </PanelControlProvider>
      </body>
    </html>
  )
}
