import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">
            This page requires authentication, which has been removed from the application.
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Please return to the{" "}
            <Link href="/" className="underline" prefetch={false}>
              homepage
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
