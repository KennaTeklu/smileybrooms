"use client" // This page needs to be a client component to use hooks like usePerformanceOptimization

import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import FeedbackSurvey from "@/components/feedback-survey"
import PersonalizedMessage from "@/components/personalized-message"
import AdvancedSearchFilter from "@/components/advanced-search-filter"
import BookingTimeline from "@/components/booking-timeline" // Assuming this is the correct import path
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization" // Import the performance hook
import { useState } from "react" // Import useState for BookingTimeline
import SupabaseConnectionTester from "@/components/supabase-connection-tester" // Import the new component
import ErrorTrigger from "@/components/error-trigger" // Keep for testing error boundary

export default function Home() {
  const { metrics, getAdaptiveQuality } = usePerformanceOptimization({
    enableFPSMonitoring: true,
    enableMemoryTracking: true,
    enableRenderTimeTracking: false, // Can enable if needed for specific component monitoring
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const adaptiveQuality = getAdaptiveQuality()

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        {" "}
        {/* Added relative for the performance overlay */}
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
        <SupabaseConnectionTester /> {/* Add the connection tester here */}
        <ErrorTrigger /> {/* Keep for testing error boundary */}
        {/* Performance Monitoring Overlay (for development/debugging) */}
        {process.env.NODE_ENV === "development" && (
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
        )}
      </div>
    </ErrorBoundary>
  )
}
