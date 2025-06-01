"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { TourProvider } from "@/contexts/tour-context"
import ClientOnlyWrapper from "@/components/client-only-wrapper"
import dynamic from "next/dynamic"

// Dynamic imports without SSR for components that need browser APIs
const ChatbotManager = dynamic(() => import("@/components/chatbot-manager"), {
  ssr: false,
})

const UnifiedFloatingWrapper = dynamic(() => import("@/components/unified-floating-wrapper"), {
  ssr: false,
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <CartProvider>
          <RoomProvider>
            <TourProvider>
              {children}
              <ClientOnlyWrapper>
                <ChatbotManager />
                <UnifiedFloatingWrapper />
              </ClientOnlyWrapper>
            </TourProvider>
          </RoomProvider>
        </CartProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  )
}
