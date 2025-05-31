"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"

interface Job {
  id: string
  address: string
  start_time: string
  checklist: any // JSONB type
}

export default function DashboardPage() {
  const [todayJobs, setTodayJobs] = useState<Job[]>([])
  const [earningsSummary, setEarningsSummary] = useState<string>("Loading...")
  const [nextJobCountdown, setNextJobCountdown] = useState<string>("No upcoming jobs.")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const jobsResponse = await fetch("/api/jobs/today")
        const jobsData = await jobsResponse.json()
        if (jobsResponse.ok) {
          setTodayJobs(jobsData.jobs)
          // Calculate next job countdown
          const now = new Date()
          const upcomingJobs = jobsData.jobs.filter((job: Job) => new Date(job.start_time) > now)
          if (upcomingJobs.length > 0) {
            const nextJob = upcomingJobs.sort(
              (a: Job, b: Job) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
            )[0]
            const interval = setInterval(() => {
              const diff = new Date(nextJob.start_time).getTime() - Date.now()
              if (diff <= 0) {
                setNextJobCountdown("Next job starting now!")
                clearInterval(interval)
              } else {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setNextJobCountdown(`Next job in: ${hours}h ${minutes}m ${seconds}s`)
              }
            }, 1000)
            return () => clearInterval(interval)
          }
        } else {
          console.error("Failed to fetch jobs:", jobsData.error)
        }

        // Placeholder for earnings summary
        setEarningsSummary("$250.00 (Today)")
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Cleaner Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Jobs</CardTitle>
            <CardDescription>Your schedule for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {todayJobs.length === 0 ? (
              <p>No jobs scheduled for today.</p>
            ) : (
              <ul className="space-y-2">
                {todayJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-medium">{job.address}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(job.start_time), "p")}
                      </p>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm">View Job</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
            <CardDescription>Your earnings at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{earningsSummary}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {format(new Date(), "PPP")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Job Countdown</CardTitle>
            <CardDescription>Time until your next scheduled job.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{nextJobCountdown}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
