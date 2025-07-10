"use client" // This component needs to be a client component to use usePathname

import type React from "react"
import { usePathname } from "next/navigation" // Import usePathname
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { RoomProvider } from "@/lib/room-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider" // Ensure QueryClientProvider is imported
import { TooltipProvider } from "@/components/ui/tooltip" // Ensure TooltipProvider is imported
import { TourProvider } from "@/contexts/tour-context" // Ensure TourProvider is imported

export function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AccessibilityProvider>
          <CartProvider>
            <RoomProvider>
              <TourProvider>
                <TooltipProvider>
                  <div className="flex flex-col min-h-screen">
                    {!isHomePage && <Header />} {/* Conditionally render Header */}
                    <main className="flex-1">{children}</main>
                    {/* Footer is not in the previous layout, adding it back if it was intended to be global */}
                    {/* <Footer /> */}
                  </div>
                  <Toaster />
                  {/* Global Collapsible Panels */}
                  <CollapsibleSettingsPanel />
                  <CollapsibleSharePanel />
                  <CollapsibleChatbotPanel />
                  <CollapsibleAddAllPanel />
                </TooltipProvider>
              </TourProvider>
            </RoomProvider>
          </CartProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default ClientRootLayout
