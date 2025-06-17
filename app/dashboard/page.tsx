import { getUserWithRole } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const { user, role } = await getUserWithRole()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">Hello, {user.email}!</p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Your role: <span className="font-semibold capitalize">{role || "N/A"}</span>
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            You are successfully logged in. This is a protected route.
          </p>
          {role === "admin" && (
            <Link href="/admin" className="block">
              <Button className="w-full" variant="outline">
                Go to Admin Panel
              </Button>
            </Link>
          )}
          <form action={signOut}>
            <Button type="submit" className="w-full" variant="destructive">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
