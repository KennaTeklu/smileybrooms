"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/crew-app/src/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/crew-app/src/components/ui/card"
import { Button } from "@/crew-app/src/components/ui/button"
import { Loader2 } from "lucide-react"

interface Cleaner {
  id: number
  name: string
  phone: string
}

export default function CleanersList() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCleaners() {
      setLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("cleaners").select("id, name, phone")

        if (error) {
          throw error
        }
        setCleaners(data || [])
      } catch (err: any) {
        console.error("Error fetching cleaners:", err.message)
        setError("Failed to load cleaners: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCleaners()
  }, [])

  if (loading) {
    return (
      <div className="text-center p-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading cleaners...
      </div>
    )
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>All Cleaners (for testing)</CardTitle>
      </CardHeader>
      <CardContent>
        {cleaners.length === 0 ? (
          <p className="text-gray-500">No cleaners found. Please ensure your 'cleaners' table is populated.</p>
        ) : (
          <ul className="space-y-2">
            {cleaners.map((cleaner) => (
              <li key={cleaner.id} className="flex justify-between items-center p-2 border rounded-md">
                <span>
                  {cleaner.name} ({cleaner.phone})
                </span>
                {/* In a real app, this might link to a cleaner's detailed profile */}
                <Button variant="outline" size="sm" disabled>
                  View Profile
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
