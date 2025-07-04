import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, DollarSign, Home, Settings, User } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Welcome to Your Dashboard!</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Manage your cleaning services, view your history, and update your preferences.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Bookings Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold">Upcoming Bookings</CardTitle>
            <Calendar className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">2</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">services scheduled</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4">
              <Link href="/bookings">View Details</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold">Payment History</CardTitle>
            <DollarSign className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">$1,250</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">total spent this year</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4">
              <Link href="/payments">View Transactions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Properties Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold">My Properties</CardTitle>
            <Home className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">registered property</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4">
              <Link href="/properties">Manage Properties</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile Settings Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold">Profile Settings</CardTitle>
            <User className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your personal information and preferences.
            </p>
            <Button asChild variant="link" className="p-0 h-auto mt-4">
              <Link href="/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* General Settings Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold">General Settings</CardTitle>
            <Settings className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adjust app settings, notifications, and accessibility.
            </p>
            <Button asChild variant="link" className="p-0 h-auto mt-4">
              <Link href="/settings">Manage Settings</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Book New Service Card */}
        <Card className="shadow-lg flex flex-col items-center justify-center p-6 text-center">
          <CardTitle className="text-2xl font-semibold mb-4">Book a New Service</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ready for another sparkling clean home?</p>
          <Button asChild size="lg">
            <Link href="/calculator">Get a Quote Now</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}
