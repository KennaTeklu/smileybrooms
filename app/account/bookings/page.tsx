"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, MoreHorizontal, Repeat } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"

interface Booking {
  id: string
  serviceName: string
  date: string
  time: string
  address: string
  status: "upcoming" | "completed" | "canceled"
  isRecurring: boolean
  frequency?: string
  total: number
}

// Mock data for demonstration
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-1234",
    serviceName: "Standard Home Cleaning",
    date: "2023-06-15",
    time: "10:00 AM - 12:00 PM",
    address: "123 Main St, New York, NY 10001",
    status: "upcoming",
    isRecurring: true,
    frequency: "Bi-weekly",
    total: 149.99,
  },
  {
    id: "BK-1235",
    serviceName: "Deep Cleaning",
    date: "2023-05-20",
    time: "1:00 PM - 4:00 PM",
    address: "456 Park Ave, New York, NY 10022",
    status: "completed",
    isRecurring: false,
    total: 249.99,
  },
  {
    id: "BK-1236",
    serviceName: "Move-Out Cleaning",
    date: "2023-05-10",
    time: "9:00 AM - 2:00 PM",
    address: "789 Broadway, New York, NY 10003",
    status: "completed",
    isRecurring: false,
    total: 349.99,
  },
  {
    id: "BK-1237",
    serviceName: "Office Cleaning",
    date: "2023-04-28",
    time: "6:00 PM - 8:00 PM",
    address: "555 5th Ave, New York, NY 10017",
    status: "canceled",
    isRecurring: false,
    total: 199.99,
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    return booking.status === activeTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Canceled
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleReschedule = (bookingId: string) => {
    // In a real app, this would open a reschedule dialog
    console.log(`Reschedule booking ${bookingId}`)
  }

  const handleCancel = (bookingId: string) => {
    // In a real app, this would show a confirmation dialog before canceling
    setBookings(
      bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "canceled" as const } : booking)),
    )
  }

  const handleRebook = (booking: Booking) => {
    // In a real app, this would create a new booking based on the old one
    const newBooking: Booking = {
      ...booking,
      id: `BK-${Math.floor(Math.random() * 10000)}`,
      date: "2023-06-30", // Future date
      status: "upcoming",
    }
    setBookings([newBooking, ...bookings])
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Calendar className="h-6 w-6 text-gray-500" />
              </div>
              <h2 className="text-xl font-medium mb-2">No bookings found</h2>
              <p className="text-gray-500 mb-6">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming bookings."
                  : activeTab === "completed"
                    ? "You don't have any completed bookings yet."
                    : "You don't have any bookings yet."}
              </p>
              <Button>Book a Service</Button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.serviceName}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(booking.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {booking.status === "upcoming" && (
                            <>
                              <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancel(booking.id)}>Cancel</DropdownMenuItem>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <DropdownMenuItem onClick={() => handleRebook(booking)}>Book Again</DropdownMenuItem>
                          )}
                          {booking.status === "canceled" && (
                            <DropdownMenuItem onClick={() => handleRebook(booking)}>Rebook</DropdownMenuItem>
                          )}
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-gray-500">{formatDate(booking.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Time</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-500 truncate max-w-xs">{booking.address}</div>
                      </div>
                    </div>
                  </div>

                  {booking.isRecurring && (
                    <div className="mt-4 flex items-center text-blue-600">
                      <Repeat className="h-4 w-4 mr-1" />
                      <span className="text-sm">Recurring {booking.frequency} service</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t bg-gray-50 py-3">
                  <div className="font-medium">Total: {formatCurrency(booking.total)}</div>
                  <div className="flex space-x-2">
                    {booking.status === "upcoming" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleReschedule(booking.id)}>
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(booking.id)}>
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === "completed" && (
                      <Button size="sm" onClick={() => handleRebook(booking)}>
                        Book Again
                      </Button>
                    )}
                    {booking.status === "canceled" && (
                      <Button size="sm" onClick={() => handleRebook(booking)}>
                        Rebook
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
