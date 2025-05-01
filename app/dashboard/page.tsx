"use client"
import { Button } from "@/components/ui/button"

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome to your dashboard! Here you can manage your services and account settings.</p>

      {/* Example section - replace with actual dashboard content */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <p>Get started with these common tasks:</p>

        {/* Option 1: Using onClick and window.location.href */}
        <Button onClick={() => (window.location.href = "/pricing")} className="mt-4">
          Book a new service
        </Button>

        {/* Option 2: Using Next.js Link */}
        {/* <Button asChild className="mt-4">
          <Link href="/pricing">Book a new service</Link>
        </Button> */}
      </div>

      {/* More dashboard content can be added here */}
    </div>
  )
}

export default DashboardPage
