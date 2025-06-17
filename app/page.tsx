"use client" // This page needs to be a client component to use hooks like usePerformanceOptimization

import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import FeedbackSurvey from "@/components/feedback-survey"
import PersonalizedMessage from "@/components/personalized-message"
import AdvancedSearchFilter from "@/components/advanced-search-filter"
import BookingTimeline from "@/components/booking-timeline"
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization"
import { useState } from "react"
import SupabaseConnectionTester from "@/components/supabase-connection-tester"
import ErrorTrigger from "@/components/error-trigger"

export default function Home() {
  const { metrics, getAdaptiveQuality } = usePerformanceOptimization({
    enableFPSMonitoring: true,
    enableMemoryTracking: true,
    enableRenderTimeTracking: false,
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const adaptiveQuality = getAdaptiveQuality()

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
        <PersonalizedMessage />
        <AdvancedSearchFilter />
        <div className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">Book Your Cleaning</h2>
          <BookingTimeline
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelected={setSelectedDate}
            onTimeSelected={setSelectedTime}
          />
        </div>
        <FeedbackSurvey />
        <SupabaseConnectionTester />
        <ErrorTrigger />
        {/* Performance Monitoring Overlay (for development/debugging) */}
        {/* Removed process.env.NODE_ENV check as it's not accessible on client */}
        <div className="fixed bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-xs z-[1000]">
          <h3 className="font-bold mb-1">Performance Metrics:</h3>
          <p>FPS: {metrics.fps.toFixed(0)}</p>
          <p>Frame Time: {metrics.frameTime.toFixed(2)} ms</p>
          <p>Memory Usage: {metrics.memoryUsage.toFixed(2)} MB</p>
          <p>
            Adaptive Quality: <span className="font-bold uppercase">{adaptiveQuality}</span>
          </p>
          {adaptiveQuality === "low" && (
            <p className="text-yellow-300 mt-1">Consider simplifying animations or reducing content density.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
