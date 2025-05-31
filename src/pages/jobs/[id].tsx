"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface JobDetails {
  id: string
  address: string
  start_time: string
  checklist: { item: string; completed: boolean }[]
  client_notes: string
  photos: { type: string; url: string }[]
}

export default function JobDetailsPage() {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (id) {
      const fetchJobDetails = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/jobs/${id}`)
          const data = await response.json()
          if (response.ok) {
            setJob(data.job)
          } else {
            setMessage(data.error || "Failed to load job details.")
          }
        } catch (error) {
          setMessage("An unexpected error occurred while fetching job details.")
          console.error("Fetch job details error:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchJobDetails()
    }
  }, [id])

  const handleCheckin = async () => {
    setSubmitting(true)
    setMessage("")
    try {
      const response = await fetch(`/api/jobs/${id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Checked in successfully!")
      } else {
        setMessage(data.error || "Check-in failed.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred during check-in.")
      console.error("Check-in error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChecklistChange = (index: number, checked: boolean) => {
    if (job) {
      const updatedChecklist = [...job.checklist]
      updatedChecklist[index].completed = checked
      setJob({ ...job, checklist: updatedChecklist })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id) return

    const file = e.target.files[0]
    if (!file) return

    setSubmitting(true)
    setMessage("")

    const formData = new FormData()
    formData.append("photo", file)
    formData.append("jobId", id as string)
    formData.append("type", "before") // Or 'after', depending on context

    try {
      const response = await fetch(`/api/jobs/${id}/photos`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Photo uploaded successfully!")
        // Optionally update job state with new photo URL
        if (job) {
          setJob({
            ...job,
            photos: [...job.photos, { type: "before", url: data.url }],
          })
        }
      } else {
        setMessage(data.error || "Photo upload failed.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred during photo upload.")
      console.error("Photo upload error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return <div className="container mx-auto p-4 text-red-500">{message || "Job not found."}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Job Details: {job.address}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>Details about the current job.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Address:</h3>
              <p>{job.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Start Time:</h3>
              <p>{new Date(job.start_time).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Client Notes:</h3>
              <p>{job.client_notes || "No specific notes."}</p>
            </div>
            <Button onClick={handleCheckin} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Check In
            </Button>
            {message && <p className={message.includes("success") ? "text-green-500" : "text-red-500"}>{message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Checklist</CardTitle>
            <CardDescription>Mark items as completed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {job.checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checklist-item-${index}`}
                  checked={item.completed}
                  onCheckedChange={(checked) => handleChecklistChange(index, checked as boolean)}
                />
                <Label htmlFor={`checklist-item-${index}`}>{item.item}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Photos</CardTitle>
            <CardDescription>Upload before/after photos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload Photo</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handlePhotoUpload} disabled={submitting} />
            </div>
            {submitting && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </div>
            )}
            {message && <p className={message.includes("success") ? "text-green-500" : "text-red-500"}>{message}</p>}
            <div className="grid grid-cols-2 gap-2">
              {job.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={`${photo.type} photo`}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                    {photo.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
