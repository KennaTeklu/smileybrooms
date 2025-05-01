"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setErrorMessage("You do not have access to this resource.")
          break
        case "Verification":
          setErrorMessage("The verification link may have been used or is invalid.")
          break
        default:
          setErrorMessage("An unexpected error occurred.")
          break
      }
    } else {
      setErrorMessage("An unexpected error occurred.")
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </div>
          <CardDescription>There was a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <p className="mt-4 text-sm text-gray-500">If this problem persists, please contact support for assistance.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Return Home
          </Button>
          <Button onClick={() => router.push("/login")}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
