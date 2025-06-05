"use client"

import type React from "react"
import { RoomProvider } from "@/lib/room-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Simplified: RoomProvider is now the primary purpose of this layout
  return <RoomProvider>{children}</RoomProvider>
}
