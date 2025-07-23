"use client"

import { useCallback, useRef, useState } from "react"

export interface ScrollPerformanceMetrics {
  fps: number
  averageFrameTime: number
  droppedFrames: number
  isSmooth: boolean
}

export function useScrollPerformance() {
  const [metrics, setMetrics] = useState<ScrollPerformanceMetrics>({
    fps: 60,
    averageFrameTime: 16.67,
    droppedFrames: 0,
    isSmooth: true,
  })

  const frameTimesRef = useRef<number[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const droppedFramesRef = useRef<number>(0)
  const rafRef = useRef<number>()

  const measurePerformance = useCallback((timestamp: number) => {
    if (lastFrameTimeRef.current > 0) {
      const frameTime = timestamp - lastFrameTimeRef.current
      frameTimesRef.current.push(frameTime)

      // Keep only last 60 frames for rolling average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift()
      }

      // Count dropped frames (frame time > 20ms indicates dropped frame at 60fps)
      if (frameTime > 20) {
        droppedFramesRef.current++
      }

      // Calculate metrics every 10 frames
      if (frameTimesRef.current.length % 10 === 0) {
        const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
        const fps = 1000 / averageFrameTime
        const isSmooth = fps > 55 && droppedFramesRef.current < 3

        setMetrics({
          fps: Math.round(fps),
          averageFrameTime: Math.round(averageFrameTime * 100) / 100,
          droppedFrames: droppedFramesRef.current,
          isSmooth,
        })
      }
    }

    lastFrameTimeRef.current = timestamp
    rafRef.current = requestAnimationFrame(measurePerformance)
  }, [])

  const startMonitoring = useCallback(() => {
    frameTimesRef.current = []
    droppedFramesRef.current = 0
    rafRef.current = requestAnimationFrame(measurePerformance)
  }, [measurePerformance])

  const stopMonitoring = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const resetMetrics = useCallback(() => {
    frameTimesRef.current = []
    droppedFramesRef.current = 0
    setMetrics({
      fps: 60,
      averageFrameTime: 16.67,
      droppedFrames: 0,
      isSmooth: true,
    })
  }, [])

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
  }
}
