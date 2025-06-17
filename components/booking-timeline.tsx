import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils" // Assuming cn utility is available

// Define the type for a single booking
interface Booking {
  id: string
  title: string
  start: Date
  end: Date
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Project Kick-off Meeting",
    start: new Date("2025-06-10T09:00:00"),
    end: new Date("2025-06-10T10:00:00"),
  },
  {
    id: "2",
    title: "Client Demo - Phase 1",
    start: new Date("2025-06-17T14:00:00"),
    end: new Date("2025-06-17T15:30:00"),
  },
  {
    id: "3",
    title: "Team Brainstorm Session",
    start: new Date("2025-06-18T11:00:00"),
    end: new Date("2025-06-18T12:00:00"),
  },
  {
    id: "4",
    title: "Past Event - Workshop",
    start: new Date("2025-05-20T10:00:00"),
    end: new Date("2025-05-20T16:00:00"),
  },
  {
    id: "5",
    title: "Future Planning Session",
    start: new Date("2025-07-01T09:30:00"),
    end: new Date("2025-07-01T11:00:00"),
  },
]

// Helper function to format dates
const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const BookingTimeline = () => {
  const now = new Date()

  // Sort bookings by start date
  const sortedBookings = [...mockBookings].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Booking Timeline</h2>
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const isUpcoming = booking.start > now
          const isCurrent = booking.start <= now && booking.end >= now

          return (
            <Card
              key={booking.id}
              className={cn(
                "border",
                isCurrent && "border-blue-500 shadow-md",
                !isUpcoming && !isCurrent && "opacity-70",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{booking.title}</CardTitle>
                <Badge variant={isUpcoming ? "default" : "secondary"}>
                  {isCurrent ? "Current" : isUpcoming ? "Upcoming" : "Past"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <p>
                    <span className="font-semibold">Start:</span> {formatDate(booking.start)}
                  </p>
                  <p>
                    <span className="font-semibold">End:</span> {formatDate(booking.end)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default BookingTimeline
