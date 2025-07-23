"use client"

import { useCallback, useRef } from "react"

export function useElasticScroll(elasticity = 0.3) {
  const isElasticRef = useRef(false)
  const elasticAnimationRef = useRef<number>()

  const applyElasticEffect = useCallback((element: HTMLElement, overscroll: number) => {
    if (isElasticRef.current) return

    isElasticRef.current = true
    const startTime = performance.now()
    const duration = 300
    const startTransform = overscroll

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Elastic ease-out
      const easeOutElastic =
        progress === 1 ? 1 : Math.pow(2, -10 * progress) * Math.sin(((progress * 10 - 0.75) * (2 * Math.PI)) / 3) + 1

      const currentTransform = startTransform * (1 - easeOutElastic)
      element.style.transform = `translateY(${currentTransform}px)`

      if (progress < 1) {
        elasticAnimationRef.current = requestAnimationFrame(animate)
      } else {
        element.style.transform = ""
        isElasticRef.current = false
      }
    }

    elasticAnimationRef.current = requestAnimationFrame(animate)
  }, [])

  const handleElasticScroll = useCallback(
    (event: Event, containerHeight: number) => {
      const element = event.target as HTMLElement
      const { scrollTop, scrollHeight, clientHeight } = element

      // Top overscroll
      if (scrollTop < 0) {
        const overscroll = Math.abs(scrollTop) * elasticity
        applyElasticEffect(element, overscroll)
        element.scrollTop = 0
      }

      // Bottom overscroll
      if (scrollTop + clientHeight > scrollHeight) {
        const overscroll = (scrollTop + clientHeight - scrollHeight) * elasticity
        applyElasticEffect(element, -overscroll)
        element.scrollTop = scrollHeight - clientHeight
      }
    },
    [applyElasticEffect, elasticity],
  )

  return { handleElasticScroll, isElastic: isElasticRef.current }
}
