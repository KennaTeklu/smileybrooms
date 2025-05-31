"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/crew-app/src/components/ui/card"
import { Button } from "@/crew-app/src/components/ui/button"
import { format, differenceInSeconds } from "date-fns"
import Link from "next/link"
import CleanersList from "@/crew-app/src/components/cleaners-list" // Import the new component
import { Loader2 } from "lucide-react"

interface Job {
  id: string
  address: string
  start_time: string
  checklist: any // JSONB type
  status: string
}

export default function DashboardPage() {
  const [todayJobs, setTodayJobs] = useState<Job[]>([])
  const [earningsSummary, setEarningsSummary] = useState<string>("Loading...")
  const [nextJobCountdown, setNextJobCountdown] = useState<string>("No upcoming jobs.")
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobsError, setJobsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingJobs(true)
      setJobsError(null)
      try {
        const jobsResponse = await fetch("/api/jobs/today")
        const jobsData = await jobsResponse.json()
        if (jobsResponse.ok) {
          setTodayJobs(jobsData.jobs)
        } else {
          setJobsError(jobsData.error || "Failed to fetch jobs.")
          console.error("Failed to fetch jobs:", jobsData.error)
        }
      } catch (error) {
        setJobsError("An unexpected error occurred while fetching jobs.")
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoadingJobs(false)
      }

      // Placeholder for earnings summary
      setEarningsSummary("$250.00 (Today)")
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (todayJobs.length > 0) {
      const now = new Date()
      const upcomingJobs = todayJobs.filter((job: Job) => new Date(job.start_time) > now)
      if (upcomingJobs.length > 0) {
        const nextJob = upcomingJobs.sort(
          (a: Job, b: Job) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
        )[0]

        interval = setInterval(() => {
          const diffSeconds = differenceInSeconds(new Date(nextJob.start_time), new Date())
          if (diffSeconds <= 0) {
            setNextJobCountdown("Next job starting now!")
            if (interval) clearInterval(interval)
          } else {
            const hours = Math.floor(diffSeconds / 3600)
            const minutes = Math.floor((diffSeconds % 3600) / 60)
            const seconds = diffSeconds % 60
            setNextJobCountdown(`Next job in: ${hours}h ${minutes}m ${seconds}s`)
          }
        }, 1000)
      } else {
        setNextJobCountdown("No upcoming jobs today.")
      }
    } else {
      setNextJobCountdown("No jobs scheduled for today.")
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [todayJobs])

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
            {loadingJobs ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading jobs...
              </div>
            ) : jobsError ? (
              <p className="text-red-500">{jobsError}</p>
            ) : todayJobs.length === 0 ? (
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
                        {format(new Date(job.start_time), "p")} - Status: {job.status}
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
      <div className="mt-8">
        <CleanersList />
      </div>
    </div>
  )
}
