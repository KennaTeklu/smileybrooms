"use client"

import type React from "react"

import { useEffect, useRef, useCallback } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { useToast } from "@/components/ui/use-toast"

interface AbandonmentProviderProps {
  children: React.ReactNode
  userId: string
  cartId: string
  thresholdSeconds?: number
  enabled?: boolean
}

export function AbandonmentProvider({
  children,
  userId,
  cartId,
  thresholdSeconds = 60,
  enabled = true,
}: AbandonmentProviderProps) {
  const { toast } = useToast()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    lastActivityTimeRef.current = Date.now()
    if (enabled) {
      timerRef.current = setTimeout(async () => {
        const response = await rescueFunnel(userId, cartId)
        if (response.success) {
          toast({
            title: "We miss you!",
            description: "We noticed you left something in your cart. Can we help?",
            duration: 5000,
          })
        } else {
          toast({
            title: "Rescue Failed",
            description: "Could not initiate abandonment rescue.",
            variant: "destructive",
          })
        }
      }, thresholdSeconds * 1000)
    }
  }, [userId, cartId, thresholdSeconds, enabled, toast])

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      return
    }

    const handleActivity = () => {
      resetTimer()
    }

    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("scroll", handleActivity)
    window.addEventListener("click", handleActivity)

    resetTimer()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
    }
  }, [resetTimer, enabled])

  return <>{children}</>
}
