"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}

// Alias so other modules can import { QueryClientProviderWrapper }
export const QueryClientProviderWrapper = QueryClientProvider

// Optional default export for convenience
export default QueryClientProvider
