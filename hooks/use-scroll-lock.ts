"use client"

import { useEffect, useCallback, useRef } from "react"

export function useScrollLock() {
  const scrollPositionRef = useRef<number>(0)
  const isLockedRef = useRef<boolean>(false)

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return

    scrollPositionRef.current = window.pageYOffset
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollPositionRef.current}px`
    document.body.style.width = "100%"
    document.body.style.overflow = "hidden"
    isLockedRef.current = true
  }, [])

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return

    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    document.body.style.overflow = ""
    window.scrollTo(0, scrollPositionRef.current)
    isLockedRef.current = false
  }, [])

  const toggleScrollLock = useCallback(
    (shouldLock: boolean) => {
      if (shouldLock) {
        lockScroll()
      } else {
        unlockScroll()
      }
    },
    [lockScroll, unlockScroll],
  )

  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        unlockScroll()
      }
    }
  }, [unlockScroll])

  return { lockScroll, unlockScroll, toggleScrollLock, isLocked: isLockedRef.current }
}
