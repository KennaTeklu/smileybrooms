"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CleanersList from "@/src/components/cleaners-list" // Import the new component

interface Job {
  id: string
  address: string
  start_time: string
  checklist: any
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTodayJobs() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/jobs/today")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch jobs")
        }
        setJobs(data.jobs || [])
      } catch (err: any) {
        console.error("Error fetching today's jobs:", err.message)
        setError("Failed to load today's jobs: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTodayJobs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cleaner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Jobs Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading jobs...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && jobs.length === 0 && <p>No jobs scheduled for today.</p>}
            {!loading && !error && jobs.length > 0 && (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li key={job.id} className="border p-3 rounded-md bg-white shadow-sm">
                    <h3 className="font-semibold text-lg">{job.address}</h3>
                    <p className="text-sm text-gray-600">Start Time: {new Date(job.start_time).toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Job
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Earnings Summary Card (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0.00</p>
            <p className="text-sm text-gray-600">Total earnings today</p>
            <Button variant="outline" className="mt-4">
              View Full History
            </Button>
          </CardContent>
        </Card>

        {/* Next Job Countdown (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Next Job Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">--:--:--</p>
            <p className="text-sm text-gray-600">Until next job</p>
            <Button variant="outline" className="mt-4">
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Display Cleaners List */}
      <div className="mt-8">
        <CleanersList />
      </div>
    </div>
  )
}
