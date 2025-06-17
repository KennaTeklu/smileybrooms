"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton" // Assuming you have a Skeleton component or similar for loading states

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

export default function SupabaseConnectionTester() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("profiles").select("*").limit(5) // Fetch up to 5 profiles

        if (error) {
          throw error
        }

        setProfiles(data || [])
      } catch (err: any) {
        console.error("Error fetching profiles:", err)
        setError(err.message || "Failed to fetch profiles.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Tester</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        )}
        {error && (
          <div className="text-red-500">
            <p className="font-semibold">Error connecting to Supabase or fetching data:</p>
            <p>{error}</p>
            <p className="mt-2 text-sm text-gray-600">
              Please ensure your Supabase project is correctly configured, the `profiles` table exists, and your
              environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set.
            </p>
          </div>
        )}
        {!loading && !error && profiles.length === 0 && (
          <p className="text-gray-500">No profiles found in the database. Try signing up a user!</p>
        )}
        {!loading && !error && profiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Fetched Profiles:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <strong>ID:</strong> {profile.id.substring(0, 8)}... | <strong>Username:</strong>{" "}
                  {profile.username || "N/A"} | <strong>Full Name:</strong> {profile.full_name || "N/A"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
