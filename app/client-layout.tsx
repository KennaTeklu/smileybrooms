"use client"

import type React from "react"

import { RoomProvider } from "@/lib/room-context"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isPricingPage, setIsPricingPage] = useState(false)

  useEffect(() => {
    setIsPricingPage(pathname === "/pricing")
  }, [pathname])

  return <RoomProvider>{children}</RoomProvider>
}
