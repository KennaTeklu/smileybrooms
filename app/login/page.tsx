"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Authentication Disabled</CardTitle>
          <CardDescription>User authentication features have been removed from this application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Please contact support if you believe this is an error.
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            You can still explore other parts of the application, such as our{" "}
            <Link href="/pricing" className="underline" prefetch={false}>
              Pricing
            </Link>{" "}
            or{" "}
            <Link href="/about" className="underline" prefetch={false}>
              About Us
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
