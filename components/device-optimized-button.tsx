"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useDeviceDetection } from "@/lib/device-detection"
import { cn } from "@/lib/utils"

interface DeviceOptimizedButtonProps extends ButtonProps {
  hapticFeedback?: boolean
}

export function DeviceOptimizedButton({
  children,
  className,
  hapticFeedback = true,
  ...props
}: DeviceOptimizedButtonProps) {
  const deviceInfo = useDeviceDetection()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback on supported devices
    if (hapticFeedback && deviceInfo.supportsHapticFeedback) {
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    }

    // Call the original onClick handler if provided
    if (props.onClick) {
      props.onClick(e)
    }
  }

  if (!mounted) {
    return null // Prevent rendering until client-side
  }

  return (
    <Button
      className={cn(
        // Device-specific classes
        deviceInfo.isIOS && "ios-button",
        deviceInfo.isAndroid && "android-button",
        deviceInfo.isDesktop && "desktop-button",
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
