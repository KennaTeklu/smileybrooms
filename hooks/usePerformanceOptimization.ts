"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  renderTime: number
  interactionLatency: number
}

interface PerformanceOptions {
  enableFPSMonitoring?: boolean
  enableMemoryTracking?: boolean
  enableRenderTimeTracking?: boolean
  targetFPS?: number
  performanceThreshold?: number
}

export function usePerformanceOptimization(options: PerformanceOptions = {}) {
  const {
    enableFPSMonitoring = true,
    enableMemoryTracking = true,
    enableRenderTimeTracking = true,
    targetFPS = 60,
    performanceThreshold = 16.67, // 60fps = 16.67ms per frame
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderTime: 0,
    interactionLatency: 0,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsRef = useRef(60)
  const renderStartRef = useRef(0)
  const interactionStartRef = useRef(0)

  // FPS Monitoring
  const measureFPS = useCallback(() => {
    if (!enableFPSMonitoring) return

    const now = performance.now()
    const delta = now - lastTimeRef.current

    if (delta >= 1000) {
      // Calculate FPS over the last second
      fpsRef.current = Math.round((frameCountRef.current * 1000) / delta)
      frameCountRef.current = 0
      lastTimeRef.current = now

      setMetrics((prev) => ({
        ...prev,
        fps: fpsRef.current,
        frameTime: 1000 / fpsRef.current,
      }))
    }

    frameCountRef.current++
  }, [enableFPSMonitoring])

  // Memory Usage Tracking
  const measureMemory = useCallback(() => {
    if (!enableMemoryTracking || !("memory" in performance)) return

    const memory = (performance as any).memory
    const memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // Convert to MB

    setMetrics((prev) => ({
      ...prev,
      memoryUsage,
    }))
  }, [enableMemoryTracking])

  // Render Time Tracking
  const startRenderMeasurement = useCallback(() => {
    if (!enableRenderTimeTracking) return
    renderStartRef.current = performance.now()
  }, [enableRenderTimeTracking])

  const endRenderMeasurement = useCallback(() => {
    if (!enableRenderTimeTracking || !renderStartRef.current) return

    const renderTime = performance.now() - renderStartRef.current
    setMetrics((prev) => ({
      ...prev,
      renderTime,
    }))
  }, [enableRenderTimeTracking])

  // Interaction Latency Tracking
  const startInteractionMeasurement = useCallback(() => {
    interactionStartRef.current = performance.now()
  }, [])

  const endInteractionMeasurement = useCallback(() => {
    if (!interactionStartRef.current) return

    const latency = performance.now() - interactionStartRef.current
    setMetrics((prev) => ({
      ...prev,
      interactionLatency: latency,
    }))
  }, [])

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = []

    if (metrics.fps < targetFPS * 0.8) {
      suggestions.push("Consider reducing animation complexity")
    }

    if (metrics.frameTime > performanceThreshold * 1.5) {
      suggestions.push("Frame time is high - optimize render operations")
    }

    if (metrics.memoryUsage > 50) {
      suggestions.push("Memory usage is high - check for memory leaks")
    }

    if (metrics.interactionLatency > 100) {
      suggestions.push("Interaction latency is high - optimize event handlers")
    }

    return suggestions
  }, [metrics, targetFPS, performanceThreshold])

  // Adaptive quality based on performance
  const getAdaptiveQuality = useCallback(() => {
    if (metrics.fps < 30) return "low"
    if (metrics.fps < 45) return "medium"
    return "high"
  }, [metrics.fps])

  // Performance monitoring loop
  useEffect(() => {
    let animationFrame: number

    const performanceLoop = () => {
      measureFPS()
      measureMemory()
      animationFrame = requestAnimationFrame(performanceLoop)
    }

    animationFrame = requestAnimationFrame(performanceLoop)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [measureFPS, measureMemory])

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    startInteractionMeasurement,
    endInteractionMeasurement,
    getOptimizationSuggestions,
    getAdaptiveQuality,
  }
}
