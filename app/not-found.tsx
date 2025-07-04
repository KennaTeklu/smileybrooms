import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <Frown className="mx-auto h-16 w-16 text-gray-500" />
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            The page you are looking for does not exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">Please check the URL or navigate back to the homepage.</p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
