"use client"

import type { ReactNode } from "react"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AbandonmentProvider>{children}</AbandonmentProvider>
}
