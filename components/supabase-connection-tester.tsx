"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle, XCircle } from "lucide-react"

export default function SupabaseConnectionTester() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("profiles").select("*").limit(1)

        if (error) {
          setStatus("error")
          setMessage(`Error connecting to Supabase: ${error.message}`)
          console.error("Supabase connection test error:", error)
        } else {
          setStatus("success")
          setMessage('Successfully connected to Supabase and fetched data from "profiles" table!')
          setData(data)
          console.log("Supabase connection test success. Data:", data)
        }
      } catch (err: any) {
        setStatus("error")
        setMessage(`Unexpected error during Supabase connection test: ${err.message}`)
        console.error("Supabase connection test unexpected error:", err)
      }
    }

    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" /> Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Testing connection...</AlertTitle>
            <AlertDescription>Attempting to connect to Supabase and fetch data.</AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert className="border-green-500 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              {message}
              {data && data.length > 0 && (
                <p className="mt-2">Found existing profile data. Example: {JSON.stringify(data[0])}</p>
              )}
              {data && data.length === 0 && (
                <p className="mt-2">No profiles found yet. This is expected for new databases.</p>
              )}
            </AlertDescription>
          </Alert>
        )}
        {status === "error" && (
          <Alert className="border-red-500 text-red-700 dark:text-red-300">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
