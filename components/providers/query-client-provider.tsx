"use client"

import type React from "react"

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}

// Alias export so other modules can import { QueryClientProviderWrapper }
export const QueryClientProviderWrapper = QueryClientProvider

// Optional: make it the default export, useful for
// `import QueryClientProviderWrapper from ...`
export default QueryClientProviderWrapper
