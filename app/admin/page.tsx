import { getUserWithRole } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminPage() {
  const { user, role } = await getUserWithRole()

  if (!user) {
    redirect("/login") // Redirect unauthenticated users
  }

  if (role !== "admin") {
    redirect("/dashboard") // Redirect non-admin users
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">Welcome, Admin {user.email}!</p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            This is a highly restricted area for administrators only.
          </p>
          <Link href="/dashboard" className="block">
            <Button className="w-full" variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
