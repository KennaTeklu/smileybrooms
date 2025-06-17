"use client"

import AnalyticsDashboard from "@/components/analytics-dashboard"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <AnalyticsDashboard />
      </main>
    </div>
  )
}
