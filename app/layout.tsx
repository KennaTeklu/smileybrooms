import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./accessibility.css"
import "./device-themes.css"
import "./payment-themes.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { PanelControlProvider } from "@/contexts/panel-control-context"
import { CollapseAllButton } from "@/components/collapse-all-button"
import { AccessibilityProvider } from "@/lib/accessibility-context" // Import AccessibilityProvider

import ClientLayout from "./client-layout" // Import the client layout

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms Cleaning Service",
  description: "Professional and reliable cleaning services for your home and office.",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryClientProviderWrapper>
            <PanelControlProvider>
              <AccessibilityProvider>
                <CartProvider>
                  <RoomProvider>
                    <ClientLayout>{children}</ClientLayout>
                  </RoomProvider>
                </CartProvider>
              </AccessibilityProvider>
              <CollapseAllButton />
            </PanelControlProvider>
          </QueryClientProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
