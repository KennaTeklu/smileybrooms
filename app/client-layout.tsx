import type React from "react"
import { QueryClientProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AccessibilityProvider } from "@/providers/accessibility-provider"
import { EnhancedCartProvider } from "@/providers/cart/enhanced-cart-provider"
import { CartProvider } from "@/providers/cart-provider"
import { ResponsiveHeader } from "@/ui/responsive-header"
import { UnifiedFooter } from "@/ui/unified-footer"
import { Toaster } from "sonner"

// Make sure the CartProvider is wrapping the entire layout including the header
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <QueryClientProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AccessibilityProvider>
            <EnhancedCartProvider>
              <ResponsiveHeader />
              <main className="flex-1">{children}</main>
              <UnifiedFooter />
              <Toaster />
            </EnhancedCartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CartProvider>
  )
}
