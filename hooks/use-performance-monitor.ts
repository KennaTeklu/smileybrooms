"use client"

import { useState, useEffect, useCallback } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  fps: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
  })

  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime

      setMetrics((prev) => ({
        ...prev,
        renderTime,
      }))

      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
    }
  }, [])

  useEffect(() => {
    // Monitor FPS
    let frameCount = 0
    let lastTime = performance.now()

    const countFrames = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: frameCount,
        }))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(countFrames)
    }

    requestAnimationFrame(countFrames)

    // Monitor memory usage
    const updateMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }))
      }
    }

    const memoryInterval = setInterval(updateMemoryUsage, 5000)

    return () => clearInterval(memoryInterval)
  }, [])

  return {
    metrics,
    measureRenderTime,
  }
}
