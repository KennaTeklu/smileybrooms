"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TranslationProvider } from "@/contexts/translation-context" // Import TranslationProvider
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccessibilityProvider>
        <TranslationProvider>
          {" "}
          {/* Wrap with TranslationProvider */}
          <CartProvider>
            <RoomProvider>
              <div className="flex min-h-screen flex-col">
                <EnhancedHeader />
                <main className="flex-1">{children}</main>
                <EnhancedFooter />
                <CollapsibleSettingsPanel />
                <CollapsibleSharePanel />
                <CollapsibleChatbotPanel />
              </div>
            </RoomProvider>
          </CartProvider>
        </TranslationProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}

export default ClientRootLayout // Default export

// Also export as a named export for consumers using `import { ClientRootLayout }`
export { ClientRootLayout }
